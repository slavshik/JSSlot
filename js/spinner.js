define(["spinstate", "easing"], function(SpinState, Easing){

	function Spinner(reel){
	  	this.reel = reel;
	  	this.speed = {
	  		current:0,
	        acceleration:0,
	        max:900,
	    };
	    this.durationOf = {
	    	acceleration:0.5, 
	        spinning:7, 
	        braking:2
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
		    if (progress > 1) {
		    	progress = 1;
		      	this.state = SpinState.SPINNING;
		    }
		    easedProgress = Easing.outQuad(progress);
		    this.speed.current = easedProgress * this.speed.max;
      		break;
  		case SpinState.SPINNING:
  			if (this.getTimeFrom(this.timeOf.spinStart) > this.durationOf.acceleration + this.durationOf.spinning) {
		      this.stop();
		    }
  			break;
		case SpinState.HAS_BEEN_STOPPED:
			if (this.getTimeFrom(this.timeOf.brakingStart) > 0) {
			    this.brakingHeight = Math.abs(Math.ceil(this.speed.current / this.reel.iconH) * this.reel.iconH);
			    this.speed.acceleration = this.brakingHeight / (this.durationOf.braking * this.durationOf.braking);
			    this.state = SpinState.BRAKING;
			}
		case SpinState.BRAKING:
			var te = this.durationOf.braking - this.getTimeFrom(this.timeOf.brakingStart);
			if (te <=0) {
				this.state = SpinState.STOPPED;
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
	    this.spinY = this.brakingStart + this.brakingHeight - this.speed.acceleration * 2 * te*te / 2;
	  } else if (this.state === SpinState.STOPPED) {
	  		var remainingValue = this.reel.spinPos - this.spinY % this.reel.spinMax;
	       this.spinY = this.reel.spinPos + remainingValue;
		   return remainingValue;
	  } else { 
	    this.spinY = this.startSpinY + this.speed.current * this.getTimeFrom(this.timeOf.spinStart);
	  }
	  return this.spinY - lastSpinY;
	}
	Spinner.prototype.stop = function(){
	  if (SpinState.hasBeenStopped(this.state)) return;
	  
	  this.timeOf.spinStop = this.timeOf.now;
	  var elapsedSpinningHeight = this.reel.spinMax - this.reel.spinPos;
	  this.brakingStart = this.spinY + elapsedSpinningHeight;
	  this.timeOf.brakingStart = this.timeOf.spinStop + parseInt(elapsedSpinningHeight / this.speed.current * 1000);
	  this.state = SpinState.HAS_BEEN_STOPPED;
	};

	Spinner.prototype.spin = function(delay){
	  if (SpinState.isSpinning(this.state)) return;
	  this.timeOf.spinStart = Date.now();
	  this.startSpinY = this.spinY = this.reel.spinPos;
	  this.state = SpinState.ACCELERATING;
	};

	return Spinner;
});