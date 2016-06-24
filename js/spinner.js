define(["spinstate", "easing"], function(SpinState, Easing){

	function Spinner(reel){
	  	this.reel = reel;
	  	this.speed = {
	  		current:0,
	        acceleration:0,
	        max:500,
	    };
	    this.durationOf = {
	    	acceleration:2, 
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
	    this.brakingStart = 0;
	    this.brakingHeight = 0;
	    this.accelerationHeight = 0;
	    
	    this.state = SpinState.STOPPED;
	}

	Spinner.prototype.update = function(){

		if (!SpinState.isSpinning(this.state)) return;

		this.timeOf.now = Date.now();

		var spinDelta = -1,
			lastSpinY = this.spinY,
			te,
			easedTime,
			timeFromSpinStart = this.getTimeFrom(this.timeOf.spinStart);
		
		switch(this.state) {
			case SpinState.ACCELERATING:
				this.speed.current = Easing.easeOutCirc(timeFromSpinStart, 0, this.speed.max, this.durationOf.acceleration)
				//this.speed.current = easedTime * this.speed.acceleration;
				this.calcSpinYFromSpeed(timeFromSpinStart);
				this.switchStateForTime(this.timeOf.spinStart, this.durationOf.acceleration, SpinState.SPINNING);
				break;
			case SpinState.SPINNING:
				if (timeFromSpinStart > this.durationOf.acceleration + this.durationOf.spinning) {
					this.stop();
				}
				this.calcSpinYFromSpeed(timeFromSpinStart);
				break;
			case SpinState.HAS_BEEN_STOPPED:
				if (this.getTimeFrom(this.timeOf.brakingStart) > 0) {
					this.state = SpinState.BRAKING;
				}
				this.calcSpinYFromSpeed(timeFromSpinStart);
				break;
			case SpinState.BRAKING:
				te = this.durationOf.braking - this.getTimeFrom(this.timeOf.brakingStart);
				this.spinY = this.brakingStart + this.brakingHeight - this.speed.acceleration * 2 * te*te / 2;
				this.switchStateForTime(this.timeOf.brakingStart, this.durationOf.braking, SpinState.STOPPED);
				break;
			case SpinState.STOPPED:
				var remainingValue = this.reel.spinPos - this.spinY % this.reel.spinMax;
				this.reel.move(remainingValue);
				this.speed.current = 0;
				this.spinY = this.reel.spinPos + remainingValue;
				return;
		}

		spinDelta = this.spinY - lastSpinY;

		this.reel.move(spinDelta);
	};
	Spinner.prototype.calcSpinYFromSpeed = function(time){
		this.spinY = this.startSpinY + this.speed.current * time;
	}
	Spinner.prototype.switchStateForTime = function(time, duration, state) {
		var te = duration - this.getTimeFrom(time);
		if (te <= 0) this.state = state;
	};
	Spinner.prototype.getAcceleration = function(height, time) {
		return height / (time * time);
	};
	Spinner.prototype.getIconsHightForSpeed = function(speed) {
		return Math.abs(Math.ceil(speed / this.reel.iconH) * this.reel.iconH);
	};
	Spinner.prototype.getTimeFrom = function(time) {
		return (this.timeOf.now - time) / 1000;
	};
	Spinner.prototype.stop = function(){
		if (SpinState.hasBeenStopped(this.state)) return;

		var elapsedSpinningHeight = this.reel.spinMax - this.reel.spinPos;
		this.brakingHeight = this.getIconsHightForSpeed(this.speed.current);
		this.speed.acceleration = this.getAcceleration(this.brakingHeight, this.durationOf.braking);
		this.timeOf.spinStop = this.timeOf.now;
		this.timeOf.brakingStart = this.timeOf.spinStop + parseInt(elapsedSpinningHeight / this.speed.current * 1000);
		this.brakingStart = this.spinY + elapsedSpinningHeight;

		this.state = SpinState.HAS_BEEN_STOPPED;
	};

	Spinner.prototype.spin = function(delay){
		if (SpinState.isSpinning(this.state)) return;
		this.timeOf.spinStart = Date.now();
		this.startSpinY = this.spinY = this.reel.spinPos;
		this.speed.acceleration = this.speed.max / this.durationOf.acceleration;

		this.state = SpinState.ACCELERATING;
	};

	return Spinner;
});