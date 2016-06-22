define(['spinstate'], function(SpinState){

	describe("Main spec", function(){

		it("STOPPED", function(){
			expect(SpinState.hasBeenStopped(SpinState.STOPPED)).toBe(false);
			expect(SpinState.isSpinning(SpinState.STOPPED)).toBe(false);
		});
		it("ACCELERATING", function(){
			expect(SpinState.hasBeenStopped(SpinState.ACCELERATING)).toBe(false);
			expect(SpinState.isSpinning(SpinState.ACCELERATING)).toBe(true);
		});
		it("ACCELERATED", function(){
			expect(SpinState.hasBeenStopped(SpinState.ACCELERATED)).toBe(false);
			expect(SpinState.isSpinning(SpinState.ACCELERATING)).toBe(true);
		});
		it("HAS_BEEN_STOPPED", function(){
			expect(SpinState.hasBeenStopped(SpinState.HAS_BEEN_STOPPED)).toBe(true);
			expect(SpinState.isSpinning(SpinState.ACCELERATING)).toBe(true);
		});
		it("BRAKING", function(){
			expect(SpinState.hasBeenStopped(SpinState.BRAKING)).toBe(true);
			expect(SpinState.isSpinning(SpinState.ACCELERATING)).toBe(true);
		});
	});
});