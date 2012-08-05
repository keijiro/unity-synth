#pragma strict

class MatrixSequencer {
    var triggers : boolean[,];

    private var position = -1;
    
    private var delta = 0.0;
    private var counter = 1.0;
    
    function MatrixSequencer(aBpm : int, channels : int, length : int) {
        triggers = new boolean[channels, length];
        delta = 4.0 * aBpm / (SynthConfig.kSampleRate * 60); 
    }
    
    function SetTrack(channel : int, track : boolean[]) {
        for (var i = 0; i < track.Length ; i++) {
            triggers[channel, i] = track[i];
        }
    }

    function Reset() {
        position = -1;
        counter = 1.0;
    }

    function Run() {
        var bang = (counter >= 1.0);
        
        if (bang) {
            if (++position == triggers.GetLength(1)) position = 0;
            counter -= 1.0;
        }
        
        counter += delta;
        
        return bang;
    }
    
    function GetCurrent(channel : int) {
        return triggers[channel, position];
    }
}
