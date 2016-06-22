define(['spinstate'], function(SpinState){

	describe("State spec", function(){

		it("STOPPED", function(){
			expect(SpinState.hasBeenStopped(SpinState.STOPPED)).toBe(true);
			expect(SpinState.isSpinning(SpinState.STOPPED)).toBe(false);
		});
		it("ACCELERATING", function(){
			expect(SpinState.hasBeenStopped(SpinState.ACCELERATING)).toBe(false);
			expect(SpinState.isSpinning(SpinState.ACCELERATING)).toBe(true);
		});
		it("SPINNING", function(){
			expect(SpinState.hasBeenStopped(SpinState.SPINNING)).toBe(false);
			expect(SpinState.isSpinning(SpinState.SPINNING)).toBe(true);
		});
		it("HAS_BEEN_STOPPED", function(){
			expect(SpinState.hasBeenStopped(SpinState.HAS_BEEN_STOPPED)).toBe(true);
			expect(SpinState.isSpinning(SpinState.HAS_BEEN_STOPPED)).toBe(true);
		});
		it("BRAKING", function(){
			expect(SpinState.hasBeenStopped(SpinState.BRAKING)).toBe(true);
			expect(SpinState.isSpinning(SpinState.BRAKING)).toBe(true);
		});
	});
	describe("Game spec", function(){

		function getStatesSum(reels){
			var r = 0;
			for (var i = 0; i < reels.length; i++) {
				r |= reels[i];
			}
			return r;
		}

		it("STOPPED", function(){
			var sum = getStatesSum([
				SpinState.ACCELERATING,
				SpinState.SPINNING,
				SpinState.SPINNING,
				SpinState.HAS_BEEN_STOPPED
			]);
			console.log(sum.toString(2))
			expect(SpinState.isSpinning(sum)).toBe(true);
		});
	});
});