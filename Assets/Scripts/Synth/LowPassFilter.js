#pragma strict

// Moog-type LPF
// http://www.musicdsp.org/showArchiveComment.php?ArchiveID=26

class LowPassFilter {
    var i1 = 0.0;
    var i2 = 0.0;
    var i3 = 0.0;
    var i4 = 0.0;
    
    var o1 = 0.0;
    var o2 = 0.0;
    var o3 = 0.0;
    var o4 = 0.0;
    
    var cutoff = 1.0;
    var resonance = 0.0;
    
    function Filter(x : float) {
        var f = cutoff * 1.16;
        var fb = resonance * (1.0 - 0.15 * f * f);
        x -= o4 * fb;
        x *= 0.35013 * (f * f) * (f * f);
        o1 = x + 0.3 * i1 + (1.0 - f) * o1;
        i1 = x;
        o2 = o1 + 0.3 * i2 + (1.0 - f) * o2;
        i2 = o1;
        o3 = o2 + 0.3 * i3 + (1.0 - f) * o3;
        i3 = o2;
        o4 = o3 + 0.3 * i4 + (1.0 - f) * o4;
        i4 = o3;
        return o4;
    }
}
