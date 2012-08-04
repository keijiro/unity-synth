#pragma strict

class Oscillator {
	private var x = 0.0;
	private var step = 0.0;
	
	function SetNote(note : int) {
		var freq = 440.0 * Mathf.Pow(2.0, 1.0 * (note - 69) / 12.0);
		step = freq / SynthConfig.kSampleRate;
	}
	
	function Run() {
		x += step;
		if (x > 1.0) x -= 1.0;
		return x * 2 - 1;
	}
}
