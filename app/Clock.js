var Clock = function() {
  this.time = '00:00';
  this.hasStarted = false;
  this.timer = null;
};

Clock.prototype.updateClock = function() {
  var clock = this.time.split(':');
  var minutes = clock[0];
  var seconds = clock[1];

  seconds = parseInt(seconds, 10) + 1;

  if(parseInt(seconds, 10) === 60) {
    seconds = '00';
    minutes = parseInt(minutes, 10) + 1;
  }

  if(parseInt(seconds, 10) <= 9) {
    seconds = '0' + parseInt(seconds, 10);
  }

  if(parseInt(minutes, 10) <= 9) {
    minutes = '0' + parseInt(minutes, 10);
  }

  this.time = minutes.toString() + ':' + seconds.toString();
};

Clock.prototype.start = function() {
  clearInterval(this.timer);
  this.hasStarted = true;

  this.timer = setInterval(function() {
    this.updateClock();
  }.bind(this), 1000);
};

Clock.prototype.stop = function() {
  clearInterval(this.timer);
};

module.exports = Clock;