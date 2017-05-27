var app = angular.module('midiApp', []);

app.controller('midiCtrl', function($scope) {

  $scope.noteHandlers = window.noteHandlers;
  $scope.activeNoteHandlers = {};

  //Defaults
  $scope.inputSelect = '0';
  $scope.outputSelect = '0';


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

      output.send([event.data[0], note, event.data[2]], event.timestamp);

    }
  };

});
