#pragma strict

class Amplifier {
    private var env : Envelope;
    
    var level = 1.0;
    
    function Amplifier(anEnv : Envelope) {
        env = anEnv;
    }
    
    function Run(input : float) {
        return input * level * env.current;
    }
}
