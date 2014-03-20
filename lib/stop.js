var Stop = function(string, fret, label) {
  this.string = string;
  this.fret = fret;
  this.label = label || '';
  return this;
};

module.exports = Stop;
