define("app", ["libs/easeljs-0.8.2.combined", "reel", "ui", "spinner"], function(easel, Reel, ui, Spinner){
	
	var reel = new Reel();
	var spinner = new Spinner(reel);
	var reelView = new ui.ReelView(reel);

	return {
		start: function(){
			
			ui.stage.addChild(reelView.iconsCont);

			createjs.Ticker.addEventListener("tick", handleTick);
			createjs.Ticker.framerate = 65;

			function handleTick(){
				spinner.update();
			    reelView.update();
				ui.stage.update();
			}
		},
		toggleSpin: function(){
			spinner.toggleSpin();
		}
	}
})