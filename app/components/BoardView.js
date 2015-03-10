/** @jsx React.DOM */
var React = require('react');
var TileRow = require('./TileRow');

var BoardView = React.createClass({

  render: function() {
    var gameBoard = this.props.board.map(function(row, index) {
      return <TileRow key={index} 
                      row={row}
                      rowNum={index}
                      onTileClick={this.props.onTileClick} 
                      onRightClick={this.props.onRightClick} />;
    }.bind(this));

    return (
      <div className="">
        <div className="center-block gameBoard">
          {gameBoard}
        </div>
      </div>
    );
  }

});

module.exports = BoardView;