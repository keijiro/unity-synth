#pragma strict

private var kSampleRate = 44100;
private var kBpm = 124;

private var clip : AudioClip;
private var level : float;

class Sequencer {
	var notes : int[];
	var samplesPerStep : int;
	var position : int;
	
	function Sequencer(aSampleRate : int, aBpm : int, initNotes : int[]) {
		notes = initNotes;
		samplesPerStep = aSampleRate * 60 / (aBpm * 4);
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

private var seq : Sequencer;

function Awake() {
	seq = Sequencer(kSampleRate, kBpm, [
		60, 60, 60, -1,
		62, 62, 62, -1,
		64, 64, 64, -1,
		65, 65, 65, -1,
		67, 67, 67, -1,
		69, 69, 69, -1,
		71, 71, 71, -1,
		72, 72, 72, -1
	]);
	
	clip = AudioClip.Create("Oscillator", kSampleRate * 60 * 60, 1, kSampleRate, false, true, OnAudioRead, OnAudioSetPosition);
	audio.clip = clip;
}

function OnGUI() {
	var sw = Screen.width;
	var sh = Screen.height;
	
	if (GUI.Button(Rect(0.25 * sw, 0.4 * sh, 0.25 * sw, 0.2 * sh), "PLAY")) {
		audio.Play();
	}
	
	if (GUI.Button(Rect(0.5 * sw, 0.4 * sh, 0.25 * sw, 0.2 * sh), "STOP")) {
		audio.Stop();
	}
}

function GetNoteFreq(note : int) {
	var interval = note - 69;
	return 440.0 * Mathf.Pow(2, interval / 12.0);
}

function OnAudioRead(data : float[]) {
	for (var count = 0; count < data.Length; count++) {
		var note = seq.Read();
		if (note >= 0) {
			level += 1.0 * GetNoteFreq(note) / kSampleRate;
			if (level > 1.0) level -= 2.0;
			data[count] = level;
		} else {
			data[count] = 0;
		}
	}
}

function OnAudioSetPosition(newPosition:int) {
	seq.position = newPosition;
}
