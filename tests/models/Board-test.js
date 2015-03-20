var expect = require('chai').expect;
var _      = require('lodash');

describe('Board', function() {
  var Board = require('../../app/models/Board');
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
  var testBoard, setting;

  var tileOperator = function(board, callback) {
    _.each(testBoard, function(tileRow) {
      _.each(tileRow, function(tile) {
        callback(tile);
      });
    });
  };

  beforeEach(function() {
    setting = SETTINGS.modest;
  });

  // Clean up our testBoard after each test.
  afterEach(function() {
    testBoard = null;
  });

  it('should create a board of NxN tiles', function() {
    var tileCount = 0;
    testBoard = new Board(setting).board;

    tileOperator(testBoard, function(tile) {
      if(tile) {
        tileCount++;
      }
    });

    expect(tileCount).to.equal(setting.tiles);
  });

  it('should create different size boards per setting', function() {
    setting = SETTINGS.savvy;
    testBoard = new Board(setting);

    expect(setting.tiles).to.equal(256);
    expect(testBoard.tiles).to.equal(setting.tiles);

    setting = SETTINGS.pro;
    testBoard = new Board(setting);

    expect(setting.tiles).to.equal(484);
    expect(testBoard.tiles).to.equal(setting.tiles);
  });
  
  describe('clickCounter', function() {
    it('should start and decrement clickedTiles property', function() {
      testBoard = new Board(setting);
      // Subtracting bombs from flippable 'legal' tiles.
      // clickCounter does this subtraction to set an initial 
      // clickedTiles property on current Board.
      var legalTiles = testBoard.tiles - testBoard.bombs;
      
      expect(legalTiles).to.equal(71);
      expect(testBoard.clickedTiles).to.be.null;

      testBoard.clickCounter();

      expect(testBoard.clickedTiles).to.equal(70);

      testBoard.clickCounter();
      testBoard.clickCounter();

      expect(testBoard.clickedTiles).to.equal(68);
    });
  });

  describe('showAllBombs', function() {
    it('should set all bomb tiles properties showBomb to true', function() {
      testBoard = new Board(setting);
      var isBombsShown = false;

      tileOperator(testBoard, function(tile) {
        if(tile.showBomb === true) {
          isBombsShown = true;
        }
      });

      expect(isBombsShown).to.be.false;

      testBoard.showAllBombs();

      tileOperator(testBoard, function(tile) {
        if(tile.showBomb === false) {
          isBombsShown = false;
          return; // Break if we find a falsey.
        } else {
          isBombsShown = true;
        }
      });

      expect(isBombsShown).to.be.true;
    });

    it('should set gameOver property to true', function() {
      testBoard = new Board(setting);
      expect(testBoard.gameOver).to.be.false;
      testBoard.showAllBombs();
      expect(testBoard.gameOver).to.be.true;
    });
  });

  describe('addOrRemoveFlag', function() {
    beforeEach(function() {
      var tileHasFlag;
      testBoard = new Board(setting);
    });

    afterEach(function() {
      testBoard = null;
    });

    it('should add and set hasFlag to true on specific tile', function() {
      tileHasFlag = testBoard.board[5][5].hasFlag;
      expect(tileHasFlag).to.be.false;

      testBoard.addOrRemoveFlag(5, 5, true);
      tileHasFlag = testBoard.board[5][5].hasFlag;
      expect(tileHasFlag).to.be.true;
    });

    it('should remove and set hasFlag to false on specific tile', function() {
      testBoard.addOrRemoveFlag(3, 3, true);
      tileHasFlag = testBoard.board[3][3].hasFlag;
      expect(tileHasFlag).to.be.true;

      testBoard.addOrRemoveFlag(3, 3, false);
      tileHasFlag = testBoard.board[3][3].hasFlag;
      expect(tileHasFlag).to.be.false;
    });
  });

});

