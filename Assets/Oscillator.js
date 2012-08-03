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

class LowPassFilter {
	var x1 = 0.0;
	var x2 = 0.0;
	var y1 = 0.0;
	var y2 = 0.0;

	var a0 = 0.0;
	var a1 = 0.0;
	var a2 = 0.0;

	var b1 = 0.0;
	var b2 = 0.0;

	var cutoff = 0.0;

	var kSampleRate = 44100.0;
	
	function Reset(f0 : float) {
		var p = Mathf.Sqrt(2.0);
		var fp = f0 / kSampleRate;
		var w0 = Mathf.Tan(Mathf.PI * fp);
		var k1 = p * w0;
		var k2 = w0 * w0;
		a0 = k2 / (1.0 + k1 + k2);
		a1 = 2.0 * a0;
		a2 = a0;
		b1 = 2.0 * a0 * (1.0 / k2 - 1.0);
		b2 = 1.0 - (a0 + a1 + a2 + b1);
		Debug.Log(a0);
	}
	
	function Update(x : float) {
		var y = a0 * x + a1 * x1 + a2 * x2 + b1 * y1 + b2 * y2;
		x2 = x1;
		x1 = x;
		y2 = y1;
		y1 = y;
		return y;
	}
}

class VCFilter {
	var y1 = 0.0;
	var y2 = 0.0;
	var y3 = 0.0;
	var y4 = 0.0;
	var oldx = 0.0;
	var oldy1 = 0.0;
	var oldy2 = 0.0;
	var oldy3 = 0.0;
	var cutoff = 0.3;
	var resonance = 0.5;
	
	var kSampleRate = 44100.0;
	var kE = 2.71828183;
	
	function Update(x : float) {
		var f = 2.0 * cutoff / kSampleRate;
		var k = 3.6 * f - 1.6 * f * f - 1.0;
		var p = (k + 1.0) * 0.5;
		var scale = Mathf.Pow(kE, (1.0 - p) * 1.386249);
		var r = resonance * scale;
		
		var out = x - r * y4;
		
		y1 = out * p + oldx * p - k * y1;
		y2 = y1 * p + oldy1 * p - k * y2;
		y3 = y2 * p + oldy2 * p - k * y3;
		y4 = y3 * p + oldy3 * p - k * y4;
		y4 = y4 - Mathf.Pow(y4, 3.0) / 6.0;
		oldx = out;
		oldy1 = y1;
		oldy2 = y2;
		oldy3 = y3;
		
  		return out;		
	}
}

private var seq : Sequencer;
private var filter : LowPassFilter;

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
	
	filter = LowPassFilter();
	
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
	
	filter.cutoff = GUI.HorizontalSlider(Rect(0.1 * sw, 0.1 * sh, 0.8 * sw, 0.1 * sh), filter.cutoff, -10000.0, 10000.0);
//	filter.resonance = GUI.HorizontalSlider(Rect(0.1 * sw, 0.2 * sh, 0.8 * sw, 0.1 * sh), filter.resonance, -10.0, 10.0);
	
	filter.Reset(filter.cutoff);
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
			data[count] = Mathf.Clamp(filter.Update(0.75 * level), -0.8, 0.8);
		} else {
			data[count] = 0;
		}
	}
}

function OnAudioSetPosition(newPosition:int) {
	seq.position = newPosition;
}
