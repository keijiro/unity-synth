#pragma strict

@script RequireComponent(AudioSource)

private var osc = Oscillator();
private var env = Envelope();
private var lpf = LowPassFilter(env);
private var amp = Amplifier(env);

private var seq = Sequencer(124, [
    30, 30, 42, 30,
    30, 29, 30, 29,
    30, 30, 42, 30,
    30, 42, 29, 30
]);

private var isRunning = false;

function Awake() {
    audio.clip = AudioClip.Create("Oscillator", 0xfffffff, 1, SynthConfig.kSampleRate, false, true, OnAudioRead);
    audio.Play();
}

function OnGUI() {
    var sw = Screen.width;
    var sh = Screen.height;

    if (GUI.Button(Rect(0.25 * sw, 0.4 * sh, 0.25 * sw, 0.2 * sh), "PLAY")) {
        seq.Reset();
        isRunning = true;
    }

    if (GUI.Button(Rect(0.5 * sw, 0.4 * sh, 0.25 * sw, 0.2 * sh), "STOP")) {
        isRunning = false;
    }

    lpf.cutoff = GUI.HorizontalSlider(Rect(0.1 * sw, 0.1 * sh, 0.8 * sw, 0.1 * sh), lpf.cutoff, 0.0, 1.0);
    lpf.resonance = GUI.HorizontalSlider(Rect(0.1 * sw, 0.2 * sh, 0.8 * sw, 0.1 * sh), lpf.resonance, 0.0, 4.0);
    lpf.envMod = GUI.HorizontalSlider(Rect(0.1 * sw, 0.3 * sh, 0.8 * sw, 0.1 * sh), lpf.envMod, 0.0, 1.0);
}

function OnAudioRead(data : float[]) {
    for (var i = 0; i < data.Length; i++) {
        if (isRunning && seq.Run()) {
            osc.SetNote(seq.currentNote);
            env.Bang();
        }
        data[i] = amp.Run(lpf.Run(osc.Run()));
        env.Update();
    }
}
