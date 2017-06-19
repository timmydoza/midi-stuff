
var Keyboard = function (output) {

  var noteInstances = {};

  var OFFSET = 21;

  function Key(keyNote) {
    var currentNote = keyNote;
    var exports = {};

    function showNote(pitch) {
      document.getElementById('key-' + pitch).classList.add('key--active');
    }

    function hideNote(pitch) {
      document.getElementById('key-' + pitch).classList.remove('key--active');
    }

    exports.play = function(payload, timestamp) {
      currentNote = payload[1];
      noteInstances[currentNote] = noteInstances[currentNote] || 0;
      noteInstances[currentNote]++;
      output.send(payload, timestamp);
      showNote(currentNote);
    };

    exports.stop = function(payload, timestamp) {
      noteInstances[currentNote]--;

      if (noteInstances[currentNote] === 0) {
        output.send([payload[0], currentNote, payload[2]], timestamp);
        hideNote(currentNote);
      }
    };

    exports.isOn = function() {
      return instances > 0;
    }

    return exports;
  }

  var _Keyboard = {};

  for (let i = 0; i < 88; i++) {

    var key = i + OFFSET;
    _Keyboard[key] = new Key(key);

  }

  return _Keyboard;

}
