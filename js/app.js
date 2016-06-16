define("app", ["libs/easeljs-0.8.2.combined", "reel", "ui"], function(easel, Reel, ui){
	
	var reel = new Reel();
	var reelView = new ui.ReelView(reel);

	return {
		start: function(){
			
			ui.stage.addChild(reelView.iconsCont);

			reel.render();

			createjs.Ticker.addEventListener("tick", handleTick);
			createjs.Ticker.framerate = 45;

			function handleTick(){
				reel.spinner.update();
			    reelView.update();
				ui.stage.update();
			}
		},
		toggleSpin: function(){
			reel.toggleSpin();
		}
	}
})