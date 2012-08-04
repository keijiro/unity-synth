#pragma strict

@script RequireComponent(AudioSource)

private var osc = Oscillator();
private var lpf = LowPassFilter();

private var seq = Sequencer(124, [
    60, 60, 60, -1,
    62, 62, 62, -1,
    64, 64, 64, -1,
    65, 65, 65, -1,
    67, 67, 67, -1,
    69, 69, 69, -1,
    71, 71, 71, -1,
    72, 72, 72, -1
]);

function Awake() {
    audio.clip = AudioClip.Create("Oscillator", 0xfffffff, 1, SynthConfig.kSampleRate, false, true, OnAudioRead, OnAudioSetPosition);
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

    lpf.cutoff = GUI.HorizontalSlider(Rect(0.1 * sw, 0.1 * sh, 0.8 * sw, 0.1 * sh), lpf.cutoff, 0.0, 1.0);
    lpf.resonance = GUI.HorizontalSlider(Rect(0.1 * sw, 0.2 * sh, 0.8 * sw, 0.1 * sh), lpf.resonance, 0.0, 4.0);
}

function OnAudioRead(data : float[]) {
    for (var i = 0; i < data.Length; i++) {
        var note = seq.Read();
        if (note >= 0) {
            osc.SetNote(note);
            data[i] = 0.5 * lpf.Filter(osc.Run()) + 0.5;
        } else {
            data[i] = 0;
        }
    }
}

function OnAudioSetPosition(newPosition:int) {
    seq.position = newPosition;
}
