define([], function(){

  function Reel(){
      this.data = [1,2,3,4,1,1,2,3,4,4,3,2,1,0,0,0];
      this.spinPos = 0;
      this.iconH = 122;
      this.iconCoords = [];
      this.iconIds = [];
      this.idx, offset = 0;
      this.reelSize = 4;
      this.offset = 0;
      this.spinMax = this.reelSize * this.iconH;
      this.move(0);
  }
  
  Reel.prototype.move = function(delta) {
      this.spinPos += delta;
      if (this.spinPos >= this.spinMax) {
          var posDelta = Math.floor(this.spinPos / this.spinMax);
          this.spinPos = this.spinPos % this.spinMax;
          this.offset += this.reelSize * posDelta;
      }
      this.offset = this.getMax(this.offset, this.data.length);
      this.idx = Math.floor(this.spinPos / this.iconH) + this.offset;
      this.idx = this.getMax(this.idx, this.data.length);

      var id = this.idx;
      for (var i = 0; i < this.reelSize; i++) {
        this.iconIds[i] = this.data[id];
        id++;
        if(id >= this.data.length) id = 0;
      }
      this.calcIcons();
  }
  Reel.prototype.calcIcons = function() {
      for (var i = 0; i < this.reelSize; i++) {
          this.iconCoords[i] = this.spinPos + this.iconH * i;
          this.iconCoords[i] = this.getMax(this.iconCoords[i], this.spinMax);
      }
      this.iconCoords.sort(function(a,b){return b-a});
  }
  Reel.prototype.getMax = function(value, max){
      if (value >= max){
          return value % max;
      }
      //TODO: add zero check
      return value;
  }

  return Reel;
  
});