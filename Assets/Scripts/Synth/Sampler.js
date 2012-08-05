#pragma strict

class Sampler {
    private var samples = [0.0];
    private var position = 0;
    var volume = 1.0;
    
    function Load(clip : AudioClip) {
        samples = new float[clip.samples];
        clip.GetData(samples, 0);
        position = samples.Length;
    }
    
    function Bang() {
        position = 0;
    }
    
    function Run() {
        if (position < samples.Length) {
            return samples[position++] * volume;
        } else {
            return 0.0;
        }
    }
}
