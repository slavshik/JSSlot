define(["libs/easeljs-0.8.2.combined", "ui", "game"], function(easel, ui, Game){
	
	var game = new Game();
	var gameView = new ui.GameView(game);

	return {
		start: function(){
			
			ui.stage.addChild(gameView.stage);

			createjs.Ticker.addEventListener("tick", handleTick);
			createjs.Ticker.framerate = 65;

			function handleTick(){
				gameView.update();
				ui.stage.update();
			}
		},
		toggleSpin: function(){
			game.toggleSpin();
		}
	}
})