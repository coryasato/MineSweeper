/** @jsx React.DOM */
var React = require('react');

var ScoreBoard = React.createClass({

  handleInput: function(e) {
    e.preventDefault();
    if(e.which === 13) {
      this.props.setPlayer(e.target.value);
    }
  },

  render: function() {
    var scores = this.props.scoreboard.map(function(score, index) {
      return <li className="score" key={index}>
                <span>{score.name}</span>
                <span>{score.time}</span>
             </li>;
    });

    var playerNameInput = <input type="text" 
                                 placeholder="Enter Your Name" 
                                 ref="userInput"
                                 onKeyUp={this.handleInput}/>;
    var playerNameSalute = <h4 className="text-center">
                               Howdy {this.props.player}!
                           </h4>;

    return (
      <div className="col-xs-2 scoreboard jumbotron">

        <h3>Claim To Fame</h3>

        {this.props.player !== 'Butters' ? playerNameSalute : playerNameInput}

        <ul>{scores}</ul>

      </div>
    );
  }

});

module.exports = ScoreBoard;