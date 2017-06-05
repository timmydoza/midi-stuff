function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var map2 = Array(12).join(' ').split('').map(function() {
  return randInt(-24, 24);
})

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

    return map2[pitch % 12] + pitch;
  }

};
