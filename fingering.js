function noteToNumber(note) {
	var steps = [
		{ name: 'C', value: 0 },
		{ name: 'D', value: 2 },
		{ name: 'E', value: 4 },
		{ name: 'F', value: 5 },
		{ name: 'G', value: 7 },
		{ name: 'A', value: 9 },
		{ name: 'B', value: 11 }
	];
	var operators = [
		{ name: '#', value: 1 },
		{ name: 'b', value: -1 },
		{ name: 'x', value: 2 }
	];
	var parts = note.split("");

	var running_total = 0;
	for (var p = 0; p < parts.length; p++) {
		if (parts[p].match(/[A-G]/)) {
			for (var s = 0; s < steps.length; s++) {
				if (parts[p] === steps[s].name) {
					running_total += steps[s].value;
					break;
				}
			}
		} else {
			for (var o = 0; o < operators.length; o++) {
				if (parts[p] === operators[o].name) {
					running_total += operators[o].value;
					break;
				}
			}
		}
	}
	var output = (running_total + 12) % 12;
	return output;
}

function findNotePositions(note, fret_range, tuning) {
	if (!note || !note.match(/^[A-G]/)) { return []; }
	fret_range = fret_range || [0,24];
	tuning = tuning || ['E','A','D','G','B','E'];
	var note_value = noteToNumber(note);
	var positions = [];
	for (var s = 0; s < tuning.length; s++) {
		var string_value = noteToNumber(tuning[s]);
		for (var f = fret_range[0]; f <= fret_range[1]; f++) {
			if ((string_value + f) % 12 === note_value) {
				positions.push({
					string: tuning.length - s,
					fret: f
				});
			}
		}
	}
	return positions;
}

function findGroupPositions(note_array, fret_range, tuning, by_note) {
	fret_range = fret_range || [0,24];
	tuning = tuning || ['E','A','D','G','B','E'];
	var output = [];
	if (by_note) {
		for (var n = 0; n < note_array.length; n++) {
			var note_positions = findNotePositions(note_array[n], fret_range, tuning);
			output.push({
				note: note_array[n],
				positions: note_positions
			});
		}
	} else {
		for (var n = 0; n < note_array.length; n++) {
			var note_positions = findNotePositions(note_array[n], fret_range, tuning);
			for (var p = 0; p < note_positions.length; p++) {
				output.push({
					note: note_array[n],
					fret: note_positions[p].fret,
					string: note_positions[p].string
				});
			}
		}
	}
	return output;
}

//sorts array by ascending fret, notes on the same fret are sorted by descending string number
//in other words: low -> high fret, and each fret low-pitch -> high-pitch string
function sortByFret(a, b) {
	return ((a.fret < b.fret) ? -1 : ((a.fret > b.fret) ? 1 : ((a.string > b.string) ? -1 : (a.string < b.string) ? 1 : 0)));
}

function testPattern(pattern) {
	var fingers = [1,2,3,4];
	pattern = pattern.sort(sortByFret);
	var remaining = [];
	for (var p = 0; p < pattern.length; p++) {
		remaining.push(pattern[p]);
	}
	//place first finger on lowest fret
	var lowest_fret = pattern[0].fret;
	for (var n = 0; n < pattern.length; n++) {
		if (pattern[n].fret === lowest_fret) {
			pattern[n].finger = 1;
			remaining.splice(0,1);
		}
	}
	fingers.splice(0,1);
	for (var r = 0; r < remaining.length; r++) {
		if (fingers[0]) {
			remaining[r].finger = fingers[0];
			fingers.splice(0,1);
		} else {
			return false;
		}
	}
	return true;
}