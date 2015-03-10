/** @jsx React.DOM */

var React     = require('react');
var _         = require('lodash');
var Board     = require('../Board');
var BoardView = require('./BoardView');
var Dashboard = require('./Dashboard');
var ScoreBoard = require('./ScoreBoard');
var Firebase  = require('firebase');

var SETTINGS = {
  'modest': {
    'tiles': 81,
    'bombs': 10,
    'flags': 10,
    'name': 'modest'
  },
  'savvy': {
    'tiles': 256,
    'bombs': 40,
    'flags': 40,
    'name': 'savvy'
  },
  'pro': {
    'tiles': 484,
    'bombs': 99,
    'flags': 99,
    'name': 'pro'
  }
};

module.exports = React.createClass({

  fetchScoreBoard: function() {
    var ref = new Firebase('https://mindsweeper.firebaseio.com/scoreboard/' + this.state.settings.name);
    ref.on('value', function(snap) {
      var players = [];
      var sorted;

      snap.forEach(function(itemSnap) {
        players.key = itemSnap.key();
        itemSnap.val().forEach(function(player) {
          players.push({name: player.name, time: player.time});
        });
      });

      sorted = _.sortBy(players, function(player) {
        return player.time;
      });
      sorted.key = players.key;

      this.setState({
        scoreboard: sorted
      });

    }.bind(this));
  },

  componentDidMount: function() {
    this.fetchScoreBoard();
  },

  componentWillMount: function() {
    var settings = SETTINGS.modest;
    var board = new Board(settings);
    var flags = board.flags;
    var gameOver = board.gameOver;

    this.setState({
      settings: settings,
      board: board,
      clock: '00:00',
      flags: flags,
      gameOver: gameOver,
      gameHasStarted: false,
      scoreboard: [],
      player: 'Butters'
    });
  },

  onTileClick: function(tile) {
    var board = this.state.board;
    var gameOver = this.state.gameOver;
    var gameStatus;

    // Prevents further action on visited, flagged tile and gameOver.
    if(tile.visited || tile.hasFlag || gameOver) {
      return false;
    }

    if(tile.isEmpty || tile.nearbyBombs) {
      // Recursively exposes tiles if they meet criteria.
      board.flipTiles(tile.rowNum, tile.colNum);
      gameStatus = true;

      if(board.clickedTiles === 0) {
        //alert('Congrats ' + this.state.player + '! Time:' + this.state.clock);
        gameOver = true;
        gameStatus = false;
        this.updateScoreBoard();
      }

    } else if(tile.bomb) {
      board.showAllBombs();
      gameStatus = false;
      gameOver = true;
    }
    
    this.setState({
      board: board,
      gameHasStarted: gameStatus,
      gameOver: gameOver
    });
  },

  onRightClick: function(tile) {
    var board = this.state.board;
    var flags = this.state.flags;
    var settings = this.state.settings;

    // Prevent flagging tiles that have been flipped.
    if(tile.visited || this.state.gameOver) {
      return false;
    }

    if(flags > 0 && tile.hasFlag) {
      flags -= 1;
      board.addOrRemoveFlag(tile.rowNum, tile.colNum, tile.hasFlag);
    } else if(flags <= settings.flags && tile.hasFlag === false) {
      flags += 1;
      board.addOrRemoveFlag(tile.rowNum, tile.colNum, tile.hasFlag);
    } else {
      return;
    }

    this.setState({
      board: board,
      flags: flags
    });
  },

  onRestartButtonClick: function(difficulty) {
    var difficulty = difficulty.difficulty;
    var settings = SETTINGS[difficulty];
    var newBoard = new Board(settings);
    var flags = newBoard.flags;

    this.setState({
      settings: settings,
      board: newBoard,
      clock: '00:00',
      flags: flags,
      gameHasStarted: false,
      gameOver: false
    });
    
    setTimeout(function() {
      this.fetchScoreBoard();
    }.bind(this), 100);
  },

  updateClock: function(newClock) {
    this.setState({
      clock: newClock.clock
    });
  },

  updateScoreBoard: function() {
    if(this.state.player !== 'Butters') {
      var scoreboard = _.uniq(this.state.scoreboard);
      var key = this.state.scoreboard.key;
      var ref = new Firebase('https://mindsweeper.firebaseio.com/scoreboard/' + this.state.settings.name).child(key);
      var newTime = this.state.clock.split(':').join('');
      var slowestTime = scoreboard[scoreboard.length-1].time.split(':').join('');
      
      if(scoreboard.length < 10) {
        scoreboard.push({name: this.state.player, time: this.state.clock});
      } else if(newTime < slowestTime) {
        scoreboard.pop();
        scoreboard.push({name: this.state.player, time: this.state.clock});
      } else {
        return;
      }

      ref.set(scoreboard);
    }
  },

  setPlayerName: function(playerName) {
    var player = this.state.player;

    this.setState({
      player: playerName
    });
  },

  render: function() {
    return (
      <div className="container main-container">
        <div className="row">
          <div className="col-md-4">

            <Dashboard onRestartButton={this.onRestartButtonClick}
                       clock={this.state.clock}
                       flags={this.state.flags}
                       updateClock={this.updateClock} 
                       gameHasStarted={this.state.gameHasStarted} />

            <ScoreBoard scoreboard={this.state.scoreboard} 
                        player={this.state.player} 
                        setPlayer={this.setPlayerName} />

          </div>
        
          <div className="col-md-8">

            <BoardView settings={this.state.settings} 
                       board={this.state.board.board} 
                       gameOver={this.state.gameOver}
                       onTileClick={this.onTileClick} 
                       onRightClick={this.onRightClick} />

          </div>

        </div>
      </div>
    );
  }

});
