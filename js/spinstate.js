define("spinstate", [], function(){

	return {
		STOPPED: 0,            // 000
		ACCELERATING: 1,       // 001
		ACCELERATED: 5,        // 101
		HAS_BEEN_STOPPED: 3,   // 011
		BRAKING: 7,            // 111

		hasBeenStopped: function(state){
		  return state & 2;
		},
		isSpinning: function(state){
		  return state & 1;
		}
	}
});