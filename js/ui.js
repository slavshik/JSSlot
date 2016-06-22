define(['libs/easeljs-0.8.2.combined'], function(){
	var stage = new createjs.Stage('canvas')

	function BitmapPool(){
		this.src = [
			{ src:'img/symbol_10.png', instances:[], origin:null},
			{ src:'img/symbol_a.png', instances:[], origin:null},
			{ src:'img/symbol_j.png', instances:[], origin:null},
			{ src:'img/symbol_k.png', instances:[], origin:null},
			{ src:'img/symbol_q.png', instances:[], origin:null}
		];
	}
	BitmapPool.prototype.free = function(id) {
		if (id != -1 && this.src.length > id) {
			return this.src[id].instances.pop();
		}
		return null;
	}
	BitmapPool.prototype.get = function(id) {	
		if (id != -1 && this.src.length > id) {
			var obj = this.src[id];
			if(obj.instances.length > 0) {
				// clone
				var clonedObject = obj.origin.clone();
				obj.instances.push(clonedObject);
				return clonedObject;
			} else {
				if (obj.origin === null) {
					obj.origin = new createjs.Bitmap(obj.src);
				}
				obj.instances.push(obj.origin);
				return obj.origin;
			}
		}
	}
	var pool = new BitmapPool();

	function IconView(){
		this.cont = new createjs.Container();
		this.img = null;
		this.id = -1;
	}
	IconView.prototype.setId = function(id) {
		if (id === this.id) return;
		if (this.img) {
			this.cont.removeChild(this.img);
		}
		pool.free(this.id);
		this.id = id;
		this.img = pool.get(id);
		this.cont.addChild(this.img);
	}

	function ReelView(reel){
		this.iconsCont = new createjs.Container();
		this.spinPos = new createjs.Shape()
		
		this.spinPos.graphics.beginFill("red");
		this.spinPos.graphics.drawRect(100, 0, 10, 2);

		this.iconsCont.addChild(this.spinPos);

		this.reel = reel;
		this.icons = [];
	}

	ReelView.prototype.update = function(){
		
		for (var i = 0; i < this.reel.reelSize; i++) {
			if (i >= this.icons.length) {
				//Create new
				this.icons[i] = new IconView();
				this.iconsCont.addChild(this.icons[i].cont);
			}
			this.icons[i].setId(this.reel.iconIds[i]);
			this.icons[i].cont.y = this.reel.iconCoords[i] - this.reel.iconH;
		}
		this.spinPos.y = this.reel.spinPos;
	}
	var GameView = function(game){
		this.game = game;
		this.stage = new createjs.Container();
		this.reels = [];
		for (var i = 0; i < this.game.spinners.length; i++) {
			var reelView = new ReelView(this.game.spinners[i].reel);
			reelView.iconsCont.x = i * this.game.spinners[i].reel.iconH;
			this.stage.addChild(reelView.iconsCont);
			this.reels.push(reelView);
		}
		this.applyMask();
	};
	GameView.prototype.applyMask = function() {
		var msk = new createjs.Shape();
		msk.graphics.beginFill("red")
		msk.graphics.drawRect(0,0,  this.game.config.iconH * this.reels.length, this.game.config.reelSize * this.game.config.iconH);
		this.stage.mask = msk;
	}
	GameView.prototype.update = function() {
		if(this.game.update()){
			for (var i = 0; i < this.reels.length; i++) {
				this.reels[i].update();
			}		
		}
	}
	return {
		GameView:GameView,
		ReelView:ReelView,
		stage:stage
	}
});