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
      0, // c
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

    return map[pitch % 12] + pitch;
  }

};
