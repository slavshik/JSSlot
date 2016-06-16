define('ui', ['libs/easeljs-0.8.2.combined'], function(){
	var stage = new createjs.Stage('canvas')

	function ReelView(reel){
		this.iconsCont = new createjs.Container();
		this.spinPos = new createjs.Shape()
		
		this.spinPos.graphics.beginFill("red");
		this.spinPos.graphics.drawRect(100, 0, 10, 2);

		this.iconsCont.addChild(this.spinPos);

		this.reel = reel;
		this.icons = [];

		this.applyMask();
	}

	ReelView.prototype.applyMask = function(){
		var msk = new createjs.Shape();
		msk.graphics.beginFill("red")
		msk.graphics.drawRect(0,0, this.reel.iconH*2, (this.reel.reelSize - 1) * this.reel.iconH);
		this.iconsCont.mask = msk;
	}

	ReelView.prototype.update = function(){
		for (var i = 0; i < this.reel.reelSize; i++) {
			if (i >= this.icons.length) {
				//Create new
				this.icons[i] = new createjs.Shape();
				this.iconsCont.addChild(this.icons[i]);
			}
			this.icons[i].id = this.reel.iconIds[i];
			this.icons[i].graphics.clear();
			this.icons[i].graphics.beginFill(this.reel.iconIds[i]).drawRect(0,0,this.reel.iconH,this.reel.iconH);
			this.icons[i].y = this.reel.iconCoords[i] - this.reel.iconH;
		}
		this.spinPos.y = this.reel.spinPos;
	}

	return {
		ReelView:ReelView,
		stage:stage
	}
});