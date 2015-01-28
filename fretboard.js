var app = angular.module('fretboard', []);

app.controller('FretboardCtrl', function($scope){
	$scope.frets = [-1,0,1,2,3,4,5,6,7,8,9,10,11,12];
	$scope.lowest_fret = 0;
	$scope.highest_fret = 12;
	$scope.roman_numerals = ["0","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI", "XXII", "XXIII", "XXIV"];
	$scope.tuning = ['E','A','D','G','B','E'];
	$scope.setDefaults = function() {
		$scope.settings = {
			labels: {
				note: {
					show: true,
					size: 12,
					color: "white",
					font: "Arial, Helvetica, sans-serif"
				}
			},
			radius: 11,
			padding: {
				top: 60,
				right: 20,
				bottom: 60,
				left: 20
			},
			spacing: {
				fret: 64,
				string: 28
			},
			colors: {
				string: "#777",
				fret: "#555",
				nut: "#999"
			}
		};
	};
	//init the default settings
	$scope.setDefaults();
	$scope.default_colors = ["#708090", "#b0e0e6", "#4682b4", "#8fbc8f"];
	$scope.inputTuning = "E-A-D-G-B-E";
	$scope.tunings = [
		{ instrument: "Guitar", tunings: [
			{ name: "Standard", notes: "E-A-D-G-B-E" },
			{ name: "Drop-D", notes: "D-A-D-G-B-E" },
			{ name: "Double-Drop-D", notes: "D-A-D-G-B-D" },
			{ name: "DADGAD", notes: "D-A-D-G-A-D" },
			{ name: "Open-D", notes: "D-A-D-F#-A-D" },
			{ name: "Open-G", notes: "D-G-D-G-B-D" }
		]},
		{ instrument: "Bass", tunings: [
			{ name: "Standard", notes: "E-A-D-G" },
			{ name: "Drop-D", notes: "D-A-D-G" },
			{ name: "5-String Std", notes: "B-E-A-D-G"}
		]},
		{ instrument: "Ukulele", tunings: [
			{ name: "Soprano", notes: "G-C-E-A" },
			{ name: "Tenor", notes: "G-C-E-A" },
			{ name: "Baritone", notes: "D-G-B-E" },
			{ name: "Open-D", notes: "A-D-F#-B" }
		]}
	];
	$scope.patterns = [
		{
			input: "",
			color: $scope.default_colors[0],
			opacity: 1,
			notes: []
		}
	];
	$scope.placeNotes = function(index) {
		var notes = parseInput($scope.patterns[index].input);
		//start at frets[1] since there is a dummy fret
		$scope.patterns[index].notes = findGroupPositions(notes, [$scope.frets[1],$scope.frets[$scope.frets.length - 1]], $scope.tuning);
	};
	$scope.updateFrets = function() {
		var fret_array = [];
		for (var f = $scope.lowest_fret - 1; f <= $scope.highest_fret; f++) {
			fret_array.push(f);
		}
		$scope.frets = fret_array;
		$scope.updateTuning();
	};
	$scope.updateTuning = function() {
		var tuning = $scope.inputTuning.split('-');
		$scope.tuning = tuning;
		for(var p = 0; p < $scope.patterns.length; p++) {
			$scope.placeNotes(p);
		}
	};
	$scope.addInput = function() {
		var color_index = $scope.patterns.length % $scope.default_colors.length;
		$scope.patterns.push({
			input: "",
			color: $scope.default_colors[color_index],
			opacity: 1,
			notes: []
		});
	};
	$scope.removeInput = function(index) {
		$scope.patterns.splice(index, 1);
	};
	$scope.getNoteX = function(fret) {
		return $scope.settings.padding.left + ((fret - $scope.frets[0]) * $scope.settings.spacing.fret) - (0.5 * $scope.settings.spacing.fret);
	};
	$scope.getNoteY = function(string) {
		return $scope.settings.padding.top + ((string - 1) * $scope.settings.spacing.string);
	};
	$scope.examples = [
		{
			title: "G-major Box",
			description: "G major scale in third position, highlighting the tonic triad",
			load: function() {
				$scope.setDefaults();
				$scope.patterns = [
					{
						input: "\"G major\"",
						color: "#333333",
						opacity: 0.2,
						notes: []
					},
					{
						input: "[G]",
						color: "#333333",
						opacity: 0.7,
						notes: []
					}
				];
				$scope.lowest_fret = 3;
				$scope.highest_fret = 7;
				$scope.inputTuning = "E-A-D-G-B-E";
				$scope.updateFrets();
			}
		},
		{
			title: "Common Tones on Bass",
			description: "F major scale in yellow, G major scale in blue, common tones turn green",
			load: function() {
				$scope.setDefaults();
				$scope.patterns = [
					{
						input: "\"G major\"",
						color: "#0096ff",
						opacity: 0.5,
						notes: []
					},
					{
						input: "\"F major\"",
						color: "#fffb00",
						opacity: 0.5,
						notes: []
					}
				];
				$scope.lowest_fret = 1;
				$scope.highest_fret = 12;
				$scope.settings.spacing.string = 36;
				$scope.settings.radius = 14;
				$scope.inputTuning = "E-A-D-G";
				$scope.updateFrets();
			}
		},
		{
			title: "Minor Uke Shapes",
			description: "Minor chord shapes on the Tenor Ukulele neck, highlighting the root note",
			load: function() {
				$scope.setDefaults();
				$scope.patterns = [
					{
						input: "[Am]",
						color: "#555555",
						opacity: 0.8,
						notes: []
					},
					{
						input: "A",
						color: "#ff9300",
						opacity: 1,
						notes: []
					}
				];
				$scope.lowest_fret = 0;
				$scope.highest_fret = 9;
				$scope.settings.labels.note.show = false;
				$scope.inputTuning = "G-C-E-A";
				$scope.updateFrets();
			}
		}
	];
});

function parseInput(input) {
	var items = input.split(',');
	var notes = [];
	for (var i = 0; i < items.length; i++) {
		//remove leading and following whitespace
		items[i] = items[i].replace(/^\s*/, "");
		items[i] = items[i].replace(/\s*$/, "");
		//if it's just a note, add it to the array
		if (items[i].match(/^[A-G](?:b|#|x)*$/)) {
			notes.push(items[i]);
		}
		//if it's a scale, get its notes and add them each to the array
		else if (items[i].match(/\".*\"/)) {
			//remove the quotes when creating the scale object
			var scale = new Motive.Scale(items[i].replace(/\"/g, ""));
			for (var m = 0; m < scale.note_members.length; m++) {
				notes.push(scale.note_members[m].pitch_name);
			}
		}
		//if it's a chord, get its notes and add them each to the array
		else if (items[i].match(/\[.*\]/)) {
			//remove the brackets when creating the chord object
			var chord = new Motive.Chord(items[i].replace(/\[/, "").replace(/\]/, ""));
			for (var r = 0; r < chord.note_members.length; r++) {
				notes.push(chord.note_members[r].pitch_name);
			}
		}
		//non-matching input will be ignored
	}
	//return the array of notes
	return notes;
}
