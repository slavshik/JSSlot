define("spinner", ["spinstate", "easing"], function(SpinState, Easing){
	function Spinner(reel){
	  this.reel = reel;
	  this.spinData = {
	        acceleration:0,
	        maxSpeed:900,
	        accDuration:1, 
	        duration:1.5, 
	        brakingDuration:2.5
	    };
	    this.startSpinY = 0;
	    this.spinY = 0;
	    this.speed = 0;
	    this.spinStartTime = -1;
	    this.spinStopTime = -1;
	    this.currentTime = -1;
	    this.braking = false;
	    this.brakingHeight = 0;
	    this.brakingValue = 0;
	    this.state = SpinState.STOPPED;
	}
	Spinner.prototype.update = function(){
		
	  if (!SpinState.isSpinning(this.state)) return;

	  this.currentTime = Date.now();

	  var easedProgress,
	      progress;
	  if(this.state === SpinState.ACCELERATING) {
	    progress = this.getTimeFrom(this.spinStartTime) / this.spinData.accDuration;
	    easedProgress = Easing.outQuad(progress);
	    
	    this.speed = progress * this.spinData.maxSpeed;
	    if (progress >= 1) {
	      this.speed = this.spinData.maxSpeed;
	      this.spinData.acceleration = 0;
	      this.state = SpinState.ACCELERATED;
	    }
	  }
	  if (this.state === SpinState.ACCELERATED) {
	    if (this.getTimeFrom(this.spinStartTime) > this.spinData.accDuration + this.spinData.duration) {
	      this.stop();
	    }
	  }
	  if (this.state === SpinState.HAS_BEEN_STOPPED && this.getTimeFrom(this.startBrakingTime) > 0) {
	    this.state = SpinState.BRAKING;
	    this.brakingStart = this.spinY;
	    this.brakingHeight = Math.abs(this.speed / this.reel.iconH * this.reel.iconH - this.reel.spinPos);
	    this.spinData.acceleration = this.brakingHeight / (this.spinData.brakingDuration * this.spinData.brakingDuration);
	  }

	  this.reel.render();
	}

	Spinner.prototype.stop = function(){
	  if (SpinState.hasBeenStopped(this.state)) return;
	  this.state = SpinState.HAS_BEEN_STOPPED;
	  this.spinStopTime = Date.now();
	  this.startBrakingTime = this.spinStopTime + (this.reel.spinPos % this.reel.iconH / this.speed) * 1000;
	}
	Spinner.prototype.spin = function(){
	  if (SpinState.isSpinning(this.state)) return;
	  this.spinStartTime = Date.now();
	  this.startSpinY = this.reel.spinPos;
	  this.state = SpinState.ACCELERATING;
	};
	Spinner.prototype.getTimeFrom = function(time) {
	  return (this.currentTime - time) / 1000;
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
	    this.spinY = this.startSpinY + this.speed * this.getTimeFrom(this.spinStartTime);
	  }
	  return this.spinY - lastSpinY;
	}
	return Spinner;
});