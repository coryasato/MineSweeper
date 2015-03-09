/** @jsx React.DOM */
var React = require('react');
var TileView = require('./TileView');

var TileRow = React.createClass({
  render: function() {
    var row = this.props.row.map(function(tile, index) {
      return <TileView key={tile.tileNumber}
                       bomb={tile.bomb}
                       isEmpty={tile.isEmpty}
                       nearbyBombs={tile.nearbyBombs}
                       showBomb={tile.showBomb}
                       tileNumber={tile.tileNumber}
                       visited={tile.visited}
                       hasFlag={tile.hasFlag}
                       rowNum={this.props.rowNum}
                       colNum={index}
                       onTileClick={this.props.onTileClick}
                       onRightClick={this.props.onRightClick}
                       exposeBombs={tile.exposeBombs} />;
    }.bind(this));

    return (
      <div className="rowWrapper">{ row }</div>
    );
  }
});

module.exports = TileRow;