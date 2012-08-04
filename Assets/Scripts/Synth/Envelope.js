#pragma strict

class Envelope {
    var release = 0.2;
    var level = 1.0;

    var current = 0.0;

    function Bang() {
        current = 1.0;
    }

    function Update() {
        release = Mathf.Clamp(release, 0.001, 10.0);
        current = Mathf.Max(0.0, current - 1.0 / (release * SynthConfig.kSampleRate));
    }
}
