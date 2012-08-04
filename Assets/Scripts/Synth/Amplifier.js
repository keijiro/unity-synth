#pragma strict

class Amplifier {
    var release = 0.2;
    var level = 1.0;
    
    var current = 0.0;
    
    function Bang() {
        current = 1.0;
    }
    
    function Run(input : float) {
        var out = input * current;
        current = Mathf.Max(0.0, current - 1.0 / (release * SynthConfig.kSampleRate));
        return out;
    }
}
