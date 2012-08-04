#pragma strict

class Envelope {
    private var minTime = 0.003;
    private var delta = 0.0;
    
    var release = 0.2;
    var current = 0.0;

    function Bang() {
        delta = 1.0 / (minTime * SynthConfig.kSampleRate);
    }

    function Update() {
        if (delta > 0.0) {
            current += delta;
            if (current >= 1.0) {
                current = 1.0;
                var r = Mathf.Max(release, minTime);
                delta = -1.0 / (r * SynthConfig.kSampleRate);
            }
        } else {
            current = Mathf.Max(current + delta, 0.0);
        }
    }
}
