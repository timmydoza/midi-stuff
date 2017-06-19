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

var map2 = Array(12).join(' ').split('').map(function() {
  return randInt(-24, 24);
})

var notes = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

var map3 = shuffle(notes).map(function(e, i) {
  return e - i;
});

var noteHandlers = {

  'Upside Down': function(pitch) {
    return 129 - pitch;
  },

  'Delay': function(pitch, event, output, play) {
    setTimeout(function() {
      play(event.data[1]);
    }, 400);
  },

  'Map': function(pitch) {

    var map = [
      , // c
      1, // c#
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

    return map3[pitch % 12] + pitch;
  },

  'Random': function() {
    return randInt(21, 109);
  }

};
