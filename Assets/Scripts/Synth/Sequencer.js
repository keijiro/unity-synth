#pragma strict

class Sequencer {
    private var notes : int[];
    private var triggers : boolean[];
    private var position = -1;
    
    private var delta = 0.0;
    private var counter = 1.0;
    
    var currentNote = -1;
    var currentTrigger = false;
    
    function Sequencer(aBpm : int, initNotes : int[], initTriggers : boolean[]) {
        notes = initNotes;
        triggers = initTriggers;
        delta = 4.0 * aBpm / (SynthConfig.kSampleRate * 60); 
    }

    function Reset() {
        position = -1;
        counter = 1.0;
        currentNote = -1;
        currentTrigger = false;
    }

    function Run() {
        var bang = (counter >= 1.0);
        
        if (bang) {
            if (++position == notes.Length) position = 0;
            currentNote = notes[position];
            currentTrigger = triggers[position];
            counter -= 1.0;
        }
        
        counter += delta;
        
        return bang;
    }
}
