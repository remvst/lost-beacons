var context = new AudioContext();

var Voice = (function(context) {
    function Voice(frequency){
      this.frequency = frequency;
      this.oscillators = [];
    };

    Voice.prototype.start = function() {
      /* VCO */
      var vco = context.createOscillator();
      vco.type = 'sawtooth';
      vco.frequency.value = this.frequency;

      /* VCA */
      this.vca = context.createGain();
      this.vca.gain.value = 0.3;

      /* connections */
      vco.connect(this.vca);
      this.vca.connect(context.destination);

      vco.start(0);

      /* Keep track of the oscillators used */
      this.oscillators.push(vco);
    };

    Voice.prototype.stop = function() {
      this.oscillators.forEach(function(oscillator, _) {
        oscillator.stop();
      });
    };

    Voice.prototype.stopSmooth = function(duration) {
      interp(this.vca.gain, 'value', 0.3, 0, duration);
    };

    return Voice;
  })(context);

function getFrequency(note) {
    var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
        octave;

    if (note.length === 3) {
        octave = note.charAt(2);
    } else {
        octave = note.charAt(1);
    }

    var keyNumber = notes.indexOf(note.slice(0, -1));

    if (keyNumber < 3) {
        keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1;
    } else {
        keyNumber = keyNumber + ((octave - 1) * 12) + 1;
    }

    // Return frequency of note
    return 440 * Math.pow(2, (keyNumber- 49) / 12);
}

function yolo() {
    function generateSequence(octave) {
        const res = [];

        for (let i = 0 ; i < 7 ; i++) {
            res.push(['A' + octave, 1]);
            res.push([0, 1]);
        }

        // res.push(['B' + (octave + 1), 1]);
        // res.push([0, 1]);
        res.push(['B' + (octave + 0), 1]);
        res.push(['B' + (octave + 1), 1]);
        res.push(['B' + (octave + 0), 1]);
        res.push([0, 1]);

        return res;
    }

    playSequence(generateSequence(1).concat(generateSequence(2)));
    return;


    playSequence( [
        ['A1', 1],
        [0, 1],
        ['A1', 1],
        [0, 1],
        ['A1', 1],
        [0, 1],
        ['A1', 1],
        [0, 1],
        ['A1', 1],
        [0, 1],
        // ['C3', 1],
        // ['C4', 1],
        // ['C3', 1],
        // [0, 1],

            ['A1', 1],
            [0, 1],
            ['A1', 1],
            [0, 1],
            ['A1', 1],
            [0, 1],
            ['A1', 1],
            [0, 1],
            ['A1', 1],
            [0, 1],
            // ['C2', 1],
            // ['C3', 1],
            // ['C2', 1],
            // [0, 1],


            ['C2', 1],
            [0, 1],
            ['C2', 1],
            ['C3', 1],
            ['C2', 1],
            [0, 1],
            ['A1', 1],
            [0, 1],
            ['A1', 1],
            [0, 1],
            ['A1', 1],
            [0, 1],
            ['A1', 1],
            [0, 1],
            ['A1', 1],
            [0, 1],

                    ['C3', 1],
                    [0, 1],
                    ['C3', 1],
                    ['C4', 1],
                    ['C3', 1],
                    [0, 1],
    ]);
}

function playSequence(sequence) {
    let seqI = 0;
    const tempo = 250;

    function nextNote() {
        const item = sequence[seqI % sequence.length];
        const duration = tempo * item[1];

        if (item[0]) {
            const frequency = getFrequency(item[0]);
            const note = new Voice(frequency);

            note.start();

            delayed(() => note.stopSmooth(tempo / 2 / 1000), duration);
        }

        delayed(nextNote, duration);

        seqI++;
    }

    nextNote();
}
