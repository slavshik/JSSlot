define(["reel", "spinner", "spinstate"], function(Reel, Spinner, SpinState){

	var Game = function(config) {
		this.config = this.validateConfig(config);

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
		for (var i = 0; i < this.config.reels; i++) {
			this.spinners[i].update();
		}
		return true; //TODO: 
	};
	Game.prototype.toggleSpin = function(){
		var gameState = this.getGameState();
		
		for (var i = 0; i < this.spinners.length; i++) {
			if(SpinState.isSpinning(gameState)) {
				this.spinners[i].stop();
			} else if (gameState === SpinState.STOPPED) {
				setTimeout(this.spinners[i].spin.bind(this.spinners[i]), 200 + i * 200);
			}
		}
	};
	Game.prototype.getGameState = function(){
		var state = 0;
		for (var i = 0; i < this.spinners.length; i++) {
			state |= this.spinners[i].state;
		}
		return state;
	};
	return Game;
})