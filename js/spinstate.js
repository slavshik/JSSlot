define([], function(){
	return {

		STOPPED: 4,            // 100
		ACCELERATING: 3,       // 011
		SPINNING: 2, 	       // 010
		HAS_BEEN_STOPPED: 6,   // 110
		BRAKING: 7,            // 111

		hasBeenStopped: function(state){
		  return (state & this.STOPPED) === this.STOPPED;
		},
		isSpinning: function(state){
		  return (state & this.SPINNING) === this.SPINNING;
		}
	}
});