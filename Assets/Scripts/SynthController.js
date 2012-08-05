#pragma strict

@script RequireComponent(AudioSource)

var skin : GUISkin;

var clips : AudioClip[];

private var osc = Oscillator();
private var env = Envelope();
private var lpf = LowPassFilter(env);
private var amp = Amplifier(env);

private var sampler = Sampler();

private var seq = Sequencer(124, [
    30, 30, 42, 30,
    30, 29, 30, 29,
    30, 30, 42, 30,
    30, 42, 29, 30
],[
    true, true, true, true,
    true, true, false, true,
    true, false, false, true,
    true, true, false, true
]);

private var isRunning = false;

function Awake() {
    Application.targetFrameRate = 30;
    
    if (AudioSettings.outputSampleRate != SynthConfig.kSampleRate) {
        AudioSettings.outputSampleRate = SynthConfig.kSampleRate;
    }
    
    sampler.Load(clips[0]);

    audio.clip = AudioClip.Create("Oscillator", 0xfffffff, 1, SynthConfig.kSampleRate, false, true, OnAudioRead);
    audio.Play();
}

function OnGUI() {
    var sw = Screen.width;
    var sh = Screen.height;
    
    GUI.skin = skin;
    
    GUILayout.BeginArea(Rect(0.05 * sw, 0.05 * sh, 0.9 * sw, 0.9 * sh));
    GUILayout.BeginVertical();

    GUILayout.BeginHorizontal();
    GUILayout.Label("Note/Trig");
    for (var i = 0; i < 16; i++) {
        GUILayout.BeginVertical();
        var note = seq.notes[i];
        var trigger = seq.triggers[i];
        var noteInput = GUILayout.TextField(note.ToString(), 3);
        seq.triggers[i] = GUILayout.Toggle(trigger, "");
        if (System.Int32.TryParse(noteInput, note)) {
            seq.notes[i] = note;
        }
        GUILayout.EndVertical();
    }
    GUILayout.EndHorizontal();
    
    GUILayout.BeginHorizontal();
    GUILayout.Label("Cutoff", GUILayout.Width(0.2 * sw));
    lpf.cutoff = GUILayout.HorizontalSlider(lpf.cutoff, 0.0, 1.0);
    GUILayout.EndHorizontal();
    
    GUILayout.BeginHorizontal();
    GUILayout.Label("Resonance", GUILayout.Width(0.2 * sw));
    lpf.resonance = GUILayout.HorizontalSlider(lpf.resonance, 0.0, 1.0);
    GUILayout.EndHorizontal();

    GUILayout.BeginHorizontal();
    GUILayout.Label("EnvMod", GUILayout.Width(0.2 * sw));
    lpf.envMod = GUILayout.HorizontalSlider(lpf.envMod, 0.0, 1.0);
    GUILayout.EndHorizontal();

    GUILayout.BeginHorizontal();
    GUILayout.Label("Decay", GUILayout.Width(0.2 * sw));
    env.release = GUILayout.HorizontalSlider(env.release, 0.0, 0.4); 
    GUILayout.EndHorizontal();

    GUILayout.BeginHorizontal();
    if (GUILayout.Button("PLAY")) {
        seq.Reset();
        isRunning = true;
    }
    
    if (GUILayout.Button("STOP")) {
        isRunning = false;
    }
    GUILayout.EndHorizontal();
    
    GUILayout.EndVertical();
    GUILayout.EndArea();
}

function OnAudioFilterRead(data : float[], channels : int) {
    // Asserts channels == 2
    for (var i = 0; i < data.Length; i += 2) {
        if (isRunning && seq.Run()) {
            osc.SetNote(seq.currentNote);
            if (seq.currentTrigger) {
                env.Bang();
                sampler.Bang();
            }
        }
        data[i] = data[i + 1] = amp.Run(lpf.Run(osc.Run())) + sampler.Run();
        env.Update();
    }
}

function OnAudioRead(data : float[]) {
}
