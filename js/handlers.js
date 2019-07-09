

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var crazy = Array(12).join(' ').split('').map(function() {
  return randInt(-24, 24);
})

var gMajor = [
  0, // c
  0, // c#
  0, // d
  1, // d#
  0, // e
  1, // f
  0, // f#
  0, // g
  1, // g#
  0, // a
  1, // a#
  0 // b
];


var notes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

var toneRow = shuffle(notes).map(function(e, i) {
  return e - i;
});

var Cycler = function() {
  var OFFSETS = [0, 1, 0, 1, 0, 0, -1, 0, 1, 0, 1, 0];

  counter = 0;

  return function(note) {
    // note += OFFSETS[note % 12 + Math.floor(counter / 10) % 12];
    note += OFFSETS[note % 12 + Math.floor(Date.now() / 1000 / 1) * 3 % 12];
    counter++;
    return note;
  }
}

app.factory('handlers', function() {
  return {
    'Upside Down': function(pitch) {
      return 129 - pitch;
    },

    'Delay': function(pitch, event, output, play) {
      setTimeout(function() {
        play(event.data[1]);
      }, 400);
    },

    'G Major': function(pitch) {
      return gMajor[pitch % 12] + pitch;
    },

    'Crazy': function(pitch) {
      return crazy[pitch % 12] + pitch;
    },

    'Tone Row': function(pitch) {
      return toneRow[pitch % 12] + pitch;
    },

    'Random': function() {
      return randInt(21, 109);
    },
    'Cycle': Cycler(),
    'Transpose': function(note) {
      return note + Math.floor(Date.now() / 1000 / 4) * 3 % 12;
    },
    'Whole Tone': function(note) {
      return note * 2;
    }

  }
});
