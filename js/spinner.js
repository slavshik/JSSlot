define("spinner", ["spinstate", "easing"], function(SpinState, Easing){

	function Spinner(reel){
	  	this.reel = reel;
	  	this.speed = {
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

      switch(this.state) {
      	case SpinState.ACCELERATING:
			progress = this.getTimeFrom(this.timeOf.spinStart) / this.durationOf.acceleration;
		    easedProgress = Easing.inQuad(progress);
		    
		    this.speed.current = easedProgress * this.speed.max;
		    if (progress >= 1) {
		      this.speed.current = this.speed.max;
		      this.speed.acceleration = 0;
		      this.state = SpinState.ACCELERATED;
		    }
      		break;
  		case SpinState.ACCELERATED:
  			if (this.getTimeFrom(this.timeOf.spinStart) > this.durationOf.acceleration + this.durationOf.spinning) {
		      this.stop();
		    }
  			break;
		case SpinState.HAS_BEEN_STOPPED:
			if (this.getTimeFrom(this.timeOf.brakingStart) > 0) {
				this.brakingStart = this.spinY;
			    this.brakingHeight = Math.abs(Math.ceil(this.speed.current / this.reel.iconH) * this.reel.iconH - this.reel.spinPos);
			    this.speed.acceleration = this.brakingHeight / (this.durationOf.braking * this.durationOf.braking);
			    this.state = SpinState.BRAKING;
			}
			break;
      }

	  this.reel.move(this.getSpinDelta());
	}

	Spinner.prototype.getTimeFrom = function(time) {
	  return (this.timeOf.now - time) / 1000;
	};
	Spinner.prototype.getSpinDelta = function() {
	  var lastSpinY = this.spinY;
	  if (this.state === SpinState.BRAKING) {
	    var te = this.durationOf.braking - this.getTimeFrom(this.timeOf.brakingStart);
	    if (te <= 0) {
	       te = 0;
	       this.state = SpinState.STOPPED;
	       var remainingValue = this.reel.spinPos - this.spinY % this.reel.spinMax;
	       this.spinY = this.reel.spinPos + remainingValue;
		   return remainingValue;
	    }
	    this.spinY = this.brakingStart + this.brakingHeight - this.speed.acceleration * 2 * te*te / 2;
	  } else { 
	    this.spinY = this.startSpinY + this.speed.current * this.getTimeFrom(this.timeOf.spinStart);
	  }
	  return this.spinY - lastSpinY;
	}
	Spinner.prototype.stop = function(){
	  if (SpinState.hasBeenStopped(this.state)) return;
	  this.state = SpinState.HAS_BEEN_STOPPED;
	  this.timeOf.spinStop = Date.now();
	  this.timeOf.brakingStart = this.timeOf.spinStop;//this.timeOf.spinStop + this.reel.spinPos % this.reel.iconH / this.speed.current * 1000;
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