define("spinner", ["spinstate", "easing"], function(SpinState, Easing){
	function Spinner(reel){
	  	this.reel = reel;
	  	this.seed = {
	  		current:0,
	        acceleration:0,
	        max:900,
	    };
	    this.durationOf = {
	    	acceleration:1, 
	        spinning:1.5, 
	        braking:2.5
	    }
	    this.timeOf = {
	    	now: -1,
	    	spinStart: -1,
	    	spinStop: -1,
	    	brakingStart: -1
	    };
	    this.startSpinY = 0;
	    this.spinY = 0;
	    this.brakingHeight = 0;
	    this.brakingValue = 0;
	    this.state = SpinState.STOPPED;
	}
	Spinner.prototype.update = function(){
		
	  if (!SpinState.isSpinning(this.state)) return;

	  this.timeOf.now = Date.now();

	  var easedProgress,
	      progress;
	  if(this.state === SpinState.ACCELERATING) {
	    progress = this.getTimeFrom(this.timeOf.spinStart) / this.durationOf.acceleration;
	    easedProgress = Easing.outQuad(progress);
	    
	    this.speed = progress * this.spinData.maxSpeed;
	    if (progress >= 1) {
	      this.speed = this.spinData.maxSpeed;
	      this.spinData.acceleration = 0;
	      this.state = SpinState.ACCELERATED;
	    }
	  }
	  if (this.state === SpinState.ACCELERATED) {
	    if (this.getTimeFrom(this.timeOf.spinStart) > this.durationOf.acceleration + this.durationOf.spinning) {
	      this.stop();
	    }
	  }
	  if (this.state === SpinState.HAS_BEEN_STOPPED && this.getTimeFrom(this.startBrakingTime) > 0) {
	    this.state = SpinState.BRAKING;
	    this.brakingStart = this.spinY;
	    this.brakingHeight = Math.abs(this.speed / this.reel.iconH * this.reel.iconH - this.reel.spinPos);
	    this.spinData.acceleration = this.brakingHeight / (this.spinData.brakingDuration * this.spinData.brakingDuration);
	  }

	  this.reel.move(this.getSpinDelta());
	}

	Spinner.prototype.getTimeFrom = function(time) {
	  return (this.timeOf.now - time) / 1000;
	};
	Spinner.prototype.getSpinDelta = function() {
	  var lastSpinY = this.spinY;
	  if (this.state === SpinState.BRAKING) {
	    var te = this.spinData.brakingDuration - this.getTimeFrom(this.startBrakingTime);
	    if (te <= 0) {
	       te = 0;
	       this.state = SpinState.STOPPED;
	       var remainingValue = this.reel.spinPos - this.spinY % this.reel.spinMax;
	       this.spinY = this.reel.spinPos + remainingValue;
	       return remainingValue;
	    }
	    this.spinY = this.brakingStart + this.brakingHeight - this.spinData.acceleration * 2 * te*te / 2;
	  } else { 
	    this.spinY = this.startSpinY + this.speed * this.getTimeFrom(this.timeOf.spinStart);
	  }
	  return this.spinY - lastSpinY;
	}

	Spinner.prototype.stop = function(){
	  if (SpinState.hasBeenStopped(this.state)) return;
	  this.state = SpinState.HAS_BEEN_STOPPED;
	  this.timeOf.spinStop = Date.now() / 1000;
	  this.startBrakingTime = this.timeOf.spinStop + (this.reel.spinPos % this.reel.iconH / this.speed);
	};

	Spinner.prototype.spin = function(){
	  if (SpinState.isSpinning(this.state)) return;
	  this.timeOf.spinStart = Date.now();
	  this.startSpinY = this.reel.spinPos;
	  this.state = SpinState.ACCELERATING;
	};
	Spinner.prototype.toggleSpin = function(){
	    if (this.state === SpinState.STOPPED){
	      this.spin();
	    } else {
	      this.stop();
	    }
	}

	return Spinner;
});