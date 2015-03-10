/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

/**
 * Clock
 */

var Clock = React.createClass({

  startClock: function() {
    //console.log('START!');
    this.interval = setInterval(this.updateClock, 1000);
  },

  stopClock: function() {
    //console.log('STOP!');
    clearInterval(this.interval);
  },

  componentWillUpdate: function(nextProps) {
    if(this.props.gameHasStarted === false && nextProps.gameHasStarted) {
      this.startClock();
    } else if(this.props.gameHasStarted && nextProps.gameHasStarted === false) {
      this.stopClock();
    }
  },

  updateClock: function() {
    var newClock = this.props.clock;
    newClock = newClock.split(':');
    var minutes = newClock[0];
    var seconds = newClock[1];

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

    newClock = minutes.toString() + ':' + seconds.toString();

    this.props.updateClock({
      clock: newClock
    });
  },

  render: function() {
    return (
      <div className="clock">{this.props.clock}</div>
    );
  }

});


/**
 * Difficutly Radio List
 */

var DifficultyList = React.createClass({

  onRestartButton: function() {
    var radioValue;
    // Iterate through refs for checked / clicked radio.
    for(var key in this.refs) {
      if(this.refs[key].getDOMNode().checked) {
        radioValue = this.refs[key].getDOMNode().value;
      }
    }

    this.props.onRestartButton({
      difficulty: radioValue
    });
  },

  render: function() {
    return (
      <div>

        <button type="button" 
                className="btn btn-primary" 
                id="restartButton"
                onClick={this.onRestartButton}>
                Restart
        </button>

        <div className="rules text-left">
          <div className="radio radio-primary">
            <label>
              <input type="radio" 
                     name="rules" 
                     value="modest"
                     ref="modest"
                     defaultChecked>
                     Modest
              </input>
              <span className="circle"></span>
              <span className="check"></span>
            </label>
          </div>
          <div className="radio radio-primary">
            <label>
              <input type="radio" 
                     name="rules" 
                     value="savvy"
                     ref="savvy">
                     Savvy
              </input>
              <span className="circle"></span>
              <span className="check"></span>
            </label>
          </div>
          <div className="radio radio-primary">
            <label>
              <input type="radio" 
                     name="rules" 
                     value="pro"
                     ref="pro">
                     Pro
              </input>
              <span className="circle"></span>
              <span className="check"></span>
            </label>
          </div>
        </div>

      </div>
    );
  }

});

/**
 * Flags
 */

var Flags = React.createClass({

  render: function() {
    return (
      <div className="flag-wrapper">
        <div className="flags aqua">{this.props.flags} 
          <span className="darkgray">Flags</span>
        </div>
        <small className="darkgray">(Right click to plant flags)</small>
      </div>
    );
  }

});

module.exports = {
  Clock: Clock,
  DifficultyList: DifficultyList,
  Flags: Flags
};