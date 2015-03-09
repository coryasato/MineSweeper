/** @jsx React.DOM */
var React = require('react/addons');
var cx = React.addons.classSet;

var TileView = React.createClass({

  onTileClick: function() {
    this.props.onTileClick({
      key: this.props.key,
      bomb: this.props.bomb,
      isEmpty: this.props.isEmpty,
      nearbyBombs: this.props.nearbyBombs,
      tileNumber: this.props.tileNumber,
      visited: this.props.visited,
      hasFlag: this.props.hasFlag,
      rowNum: this.props.rowNum,
      colNum: this.props.colNum,
      showBomb: this.props.showBomb
    });
  },

  onRightClick: function(e) {
    e.preventDefault();

    var hasFlag = !this.props.hasFlag;

    this.props.onRightClick({
      rowNum: this.props.rowNum,
      colNum: this.props.colNum,
      visited: this.props.visited,
      hasFlag: hasFlag
    });

  },

  render: function() {

    var classList = cx({
      'tile': true,
      'animated': true,
      'flipInX': true,
      'bomb': this.props.bomb,
      'emptyTile': this.props.isEmpty,
      'nearbyBombs': this.props.nearbyBombs,
      'visited': this.props.visited,
      'show-bomb': this.props.showBomb,
      'hasFlag': this.props.hasFlag
    });

    return (
      <div className={classList} 
           data-tile-number={this.props.tileNumber}
           onClick={this.onTileClick}
           onContextMenu={this.onRightClick}>
           {this.props.visited ? this.props.nearbyBombs : ''}
      </div>
    );
  }

});

module.exports = TileView;