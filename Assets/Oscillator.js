#pragma strict

private var kSampleRate = 44100;

private var clip : AudioClip;
private var level : float;
private var note : int;
private var keyOn : boolean;

function Awake() {
	clip = AudioClip.Create("Oscillator", kSampleRate, 1, kSampleRate, false, true, OnAudioRead);
	audio.clip = clip;
	audio.Play();
}

function TestDoReMi() {
	for (var aNote in [60, 62, 64, 65, 67, 69, 71, 72]) {
		keyOn = true;
		note = aNote;
		yield WaitForSeconds(0.5);
		
		keyOn = false;
		yield WaitForSeconds(0.25);
	}
}

function OnGUI() {
	var sw = Screen.width;
	var sh = Screen.height;
	if (GUI.Button(Rect(0.25 * sw, 0.4 * sh, 0.5 * sw, 0.2 * sh), "Play Do, Re, Mi!")) {
		StartCoroutine(TestDoReMi());
	}
}

function GetNoteFreq() {
	var interval = note - 69;
	return 440.0 * Mathf.Pow(2, interval / 12.0);
}

function OnAudioRead(data : float[]) {
	for (var count = 0; count < data.Length; count++) {
		if (keyOn) {
			level += 1.0 * GetNoteFreq() / kSampleRate;
			if (level > 1.0) level -= 2.0;
			data[count] = level;
		} else {
			data[count] = 0;
		}
	}
}
