/** @jsx React.DOM */
var React = require('react');
var Clock = require('./DashboardUI').Clock;
var DifficultyList = require('./DashboardUI').DifficultyList;
var Flags = require('./DashboardUI').Flags;

var Dashboard = React.createClass({

  render: function() {
    return (
      <div className="text-center">
        <Clock clock={this.props.clock} 
               updateClock={this.props.updateClock} 
               gameHasStarted={this.props.gameHasStarted} />

        <DifficultyList onRestartButton={this.props.onRestartButton} />

        <Flags flags={this.props.flags} />
      </div>
    );
  }

});

module.exports = Dashboard;