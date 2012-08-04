#pragma strict

// Moog-type LPF
// http://www.musicdsp.org/showArchiveComment.php?ArchiveID=26

class LowPassFilter {
    private var env : Envelope;
    
    private var i1 = 0.0;
    private var i2 = 0.0;
    private var i3 = 0.0;
    private var i4 = 0.0;
    
    private var o1 = 0.0;
    private var o2 = 0.0;
    private var o3 = 0.0;
    private var o4 = 0.0;
    
    var cutoff = 1.0;
    var resonance = 0.0;
    var envMod = 0.0;
    
    private function Saturate(x : float) {
        return Mathf.Clamp(x, -1.0, 1.0);
    }
    
    function LowPassFilter(anEnv : Envelope) {
        env = anEnv;
    }
    
    function Run(input : float) {
        var f = Mathf.Clamp01(cutoff + env.current * envMod) * 1.16;
        var fb = Mathf.Clamp01(resonance) * 4.0 * (1.0 - 0.15 * f * f);
        var x = input - o4 * fb;
        x = Mathf.Clamp(0.35013 * x * (f * f) * (f * f), -1.0, 1.0);
        o1 = Saturate(x + 0.3 * i1 + (1.0 - f) * o1);
        i1 = x;
        o2 = Saturate(o1 + 0.3 * i2 + (1.0 - f) * o2);
        i2 = o1;
        o3 = Saturate(o2 + 0.3 * i3 + (1.0 - f) * o3);
        i3 = o2;
        o4 = Saturate(o3 + 0.3 * i4 + (1.0 - f) * o4);
        i4 = o3;
        return o4;
    }
}
