#pragma strict

@script RequireComponent(AudioSource)

var bpm = 124.0;
var skin : GUISkin;
var drumClips : AudioClip[];

private var isRunning = false;

private var osc = Oscillator();
private var env = Envelope();
private var lpf = LowPassFilter(env);
private var amp = Amplifier(env);
private var seq : Sequencer;

private var drums : Sampler[];
private var drumSeq : MatrixSequencer;

function Start() {
    lpf.cutoff = 0.2;
    lpf.envMod = 0.2;
    
    seq = Sequencer(bpm, [
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
    
    drums = new Sampler[drumClips.Length];
    for (var i = 0; i < drumClips.Length; i++) {
        drums[i] = Sampler(drumClips[i]);
    }
    
    drumSeq = MatrixSequencer(bpm, drumClips.Length, 16);
    drumSeq.SetTrack(0, [
        true, false, false, false,
        true, false, false, false,
        true, false, false, false,
        true, false, false, false
    ]);
    
    audio.clip = AudioClip.Create("(null)", 0xfffffff, 1, SynthConfig.kSampleRate, false, true, function(data:float[]){});
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
    GUILayout.Label("Drums");
    GUILayout.BeginVertical();
    for (var row = drumSeq.triggers.GetLength(0) - 1; row >= 0 ; row--) {
        GUILayout.BeginHorizontal();
        for (var col = 0; col < drumSeq.triggers.GetLength(1); col++) {
            drumSeq.triggers[row, col] = GUILayout.Toggle(drumSeq.triggers[row, col], "");
        }
        GUILayout.EndHorizontal();
    }
    GUILayout.EndVertical();
    GUILayout.EndHorizontal();
    
    GUILayout.BeginHorizontal();
    GUILayout.Label("Cutoff", GUILayout.Width(0.2 * sw));
    lpf.cutoff = GUILayout.HorizontalSlider(lpf.cutoff, 0.0, 1.0);
    GUILayout.EndHorizontal();
    
    GUILayout.BeginHorizontal();
    GUILayout.Label("Resonance", GUILayout.Width(0.2 * sw));
    lpf.resonance = GUILayout.HorizontalSlider(lpf.resonance, 0.0, 1.0);
    GUILayout.EndHorizontal();

    amp.level = 1.0 + lpf.resonance * 1.6;

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
        drumSeq.Reset();
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
            }
        }
        if (isRunning && drumSeq.Run()) {
            for (var tr = 0; tr < drumSeq.triggers.GetLength(0); tr++) {
                if (drumSeq.GetCurrent(tr)) drums[tr].Bang();
            }
        }

        var x = amp.Run(lpf.Run(osc.Run()));
        for (var sampler in drums) x += sampler.Run();
        data[i] = data[i + 1] = x;
        env.Update();
    }
}
