define(["reel", "spinner", "spinstate"], function(Reel, Spinner, SpinState){

	var Game = function(config) {
		this.config = this.validateConfig(config);
		this.gameState = 0;
		this.createGame();
	}
	Game.prototype.validateConfig = function(config){
		if (!config) {
			config = {};
		}
		config.reels = config.reels || 5;
		config.reelSize = config.reelSize || 3;
		config.iconH = config.iconH || 122;
		return config;
	};
	Game.prototype.createGame = function(){
		this.spinners = [];
		for (var i = 0; i < this.config.reels; i++) {
			var reel = new Reel();
			reel.data = this.createReelData(10, [0,1,2,3,4]);
			reel.move(0);
			var spinner = new Spinner(reel);
			this.spinners.push(spinner);
		}
	};
	Game.prototype.createReelData = function(size, source){
		var data = [];
		for(var i = 0; i < size; i++) {
			data[i] = source[Math.round(Math.random() * (source.length-1))]
		}
		return  data;
	};
	Game.prototype.update = function(){
		var prevState = this.gameState;
		this.gameState = 0;
		for (var i = 0; i < this.config.reels; i++) {
			this.spinners[i].update();
			this.gameState |= this.spinners[i].state;
		}
		if (this.gameState != prevState) {
			return true;
		}
		return this.gameState != SpinState.STOPPED;
	};
	Game.prototype.toggleSpin = function(){
		for (var i = 0; i < this.spinners.length; i++) {
			if(SpinState.isSpinning(this.gameState)) {
				this.spinners[i].stop();
			} else if (this.gameState === SpinState.STOPPED) {
				setTimeout(this.spinners[i].spin.bind(this.spinners[i]), 200 + i * 200);
			}
		}
	};
	return Game;
})