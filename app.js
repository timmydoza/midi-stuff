var app = angular.module('midiApp', []);

app.controller('midiCtrl', function($scope) {

  $scope.noteHandlers = window.noteHandlers;
  $scope.activeNoteHandlers = {};

  //Defaults
  $scope.inputSelect = '1';
  $scope.outputSelect = '1';

  var keyboard = function() {
    var OFFSET = 21;
    var keys= [];
    var KEYNAMES = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];
    var whiteIndex = 0;
    var blackIndex = 0;

    function isBlack(keyIndex) {
      return [1, 4, 6, 9, 11].indexOf(keyIndex %12) !== -1;
    }

    for (var i = 0; i < 88; i++) {
      var isBlackNote = isBlack(i);

      keys.push({
        octave: Math.floor(i / 12),
        key: i + OFFSET,
        color: isBlack(i) ? 'black' : 'white',
        note: KEYNAMES[i % 12],
        whiteIndex: whiteIndex,
        blackIndex: blackIndex
      });

      isBlackNote ? blackIndex++ : whiteIndex++;
    }

    return keys;
  };

  $scope.keys = keyboard();
  $scope.activeNotes = {};

  var initTime;
  var recording = [];


  navigator.requestMIDIAccess().then(function(midiAccess) {
    window.midiAccess = midiAccess;

    var {
      inputs: [...inputArray],
      outputs: [...outputArray]
    } = midiAccess;

    $scope.inputs = inputArray;
    $scope.outputs = outputArray;

    $scope.init();
    $scope.$apply();

  }, console.error);


  $scope.init = function() {

    initTime = Date.now();

    var input = $scope.inputs[$scope.inputSelect][1];
    var output = $scope.outputs[$scope.outputSelect][1];

    input.onmidimessage = function(event) {

      var note = Object.keys($scope.activeNoteHandlers).reduce(function(prev, curr) {

        if ($scope.activeNoteHandlers[curr]) {

          return $scope.noteHandlers[curr](prev, event, output, function(note) {
            output.send([event.data[0], note, event.data[2]], event.timestamp);
          }) || prev;

        } else {
          return prev;
        }

      }, event.data[1]);

      $scope.activeNotes[note] = event.data[0] === 144;

      var payload = [event.data[0], note, event.data[2]];

      if (event.data[0] === 176) {
        output.send(event.data, event.timestamp);
      } else {
        output.send(payload, event.timeStamp);
      }



      recording.push({
        send: function (startOffset) {
          setTimeout(function() {
            output.send(payload, event.timeStamp + startOffset);
          });

          setTimeout(function() {
            $scope.activeNotes[note] = event.data[0] === 144;
            $scope.$apply();
          }, event.timeStamp)
        },
        timeStamp: event.timeStamp
      });

      $scope.$apply();

    }
  };

  $scope.play = function() {
    console.log(recording.length);

    var currentTime = Date.now();

    recording.forEach(function(note) {
      note.send(currentTime - initTime);
    });

    recording = [];
  };

});
