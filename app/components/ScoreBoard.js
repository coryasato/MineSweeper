/** @jsx React.DOM */
var React = require('react');

var ScoreBoard = React.createClass({

  handleInput: function(e) {
    e.preventDefault();
    if(e.which === 13 && e.target.value.length >= 2 && e.target.value.length <= 10 && !this.noXSS(e.target.value)) {
      this.props.setPlayer(e.target.value);
    } else {
      return false;
    }
  },

  noXSS: function(string) {
    if(string[0] === '<' && string.substring(string.length-2) === '>;') {
      return true;
    } else {
      return false;
    }
  },

  render: function() {
    var scores = this.props.scoreboard.map(function(score, index) {
      return <li className="score" key={index}>
                <span>{index+1} )</span>
                <span className="left-spacer">Player: 
                  <span className="aqua">{score.name}</span>
                </span>
                <span className="left-spacer">Time:
                  <span className="aqua">{score.time}</span>
                </span>
             </li>;
    });

    var playerNameInput = <input className="center-block"
                                 type="text" 
                                 placeholder="Enter name of 2-10 Chars" 
                                 ref="userInput"
                                 onKeyUp={this.handleInput} 
                                 maxLength='10'
                                 minLength='2' />;
    var playerNameSalute = <h4 className="text-center">
                               Howdy, {this.props.player}!
                           </h4>;

    return (
      <div className="scoreboard">

        <h2 className="text-center"><u>Claim To Fame</u></h2>

        {this.props.player !== 'Butters' ? playerNameSalute : playerNameInput}

        <ul className="scores">{scores}</ul>

      </div>
    );
  }

});

module.exports = ScoreBoard;