#pragma strict

class Sequencer {
    private var notes : int[];
    private var position = -1;
    
    private var delta = 0.0;
    private var counter = 1.0;
    
    var currentNote = -1;
    
    function Sequencer(aBpm : int, initNotes : int[]) {
        notes = initNotes;
        delta = 4.0 * aBpm / (SynthConfig.kSampleRate * 60); 
    }

    function Reset() {
        position = -1;
        counter = 1.0;
        currentNote = -1;
    }

    function Run() {
        var bang = (counter >= 1.0);
        
        if (bang) {
            if (++position == notes.Length) position = 0;
            var note = notes[position];
            if (note >= 0) {
                currentNote = note;
            } else {
                bang = false;
            }
            counter -= 1.0;
        }
        
        counter += delta;
        
        return bang;
    }
}
