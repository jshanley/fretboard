var presets = require('./presets.json');

function Fretboard(stops, settings) {
  settings = settings || {};
  var preset = presets[settings.preset] || presets['guitar'];

  this.stops = stops;

}

module.exports = function(stops, settings) {
  return new Fretboard(stops, settings);
};
