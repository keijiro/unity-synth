#pragma strict

function Start () {
    yield;
    
//    SynthConfig.kSampleRate = AudioSettings.outputSampleRate;
    AudioSettings.outputSampleRate = SynthConfig.kSampleRate;

    yield;

    Application.LoadLevel(1);
}
