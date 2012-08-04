#pragma strict

@script RequireComponent(AudioSource)

private var osc = Oscillator();
private var lpf = LowPassFilter();
private var amp = Amplifier();

private var seq = Sequencer(124, [
    30, 30, 42, 30,
    30, 29, 30, 29,
    30, 30, 42, 30,
    30, 42, 29, 30
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
        if (seq.Run()) {
            osc.SetNote(seq.currentNote);
            amp.Bang();
        }
        data[i] = amp.Run(lpf.Filter(osc.Run()));
    }
}

function OnAudioSetPosition(newPosition:int) {
    seq.ResetPosition(newPosition);
}
