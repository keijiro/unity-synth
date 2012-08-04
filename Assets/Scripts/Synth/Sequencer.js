#pragma strict

class Sequencer {
    var notes : int[];
    var samplesPerStep : int;
    var position : int;

    function Sequencer(aBpm : int, initNotes : int[]) {
        notes = initNotes;
        samplesPerStep = SynthConfig.kSampleRate * 60 / (aBpm * 4);
    }

    function Read() {
        var note = notes[position / samplesPerStep];
        position++;
        if (position >= notes.Length * samplesPerStep) {
            position -= notes.Length * samplesPerStep;
        }
        return note;
    }

    function Reset() {
        position = 0;
    }
}
