var presets = require('./presets.json');

function Fretboard(info) {
  info = info || {};
  var strings = info.strings || presets[info.preset] || presets.guitar;


}

module.exports = function(info) {
  return new Fretboard(info);
};

Fretboard.prototype.fret = function(number, strings) {

};
Fretboard.prototype.string = function(number, frets) {

};
