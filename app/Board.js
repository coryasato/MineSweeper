var _ = require('lodash');

/**
 * Models
 */

var TileModel = function(tileNumber) {
  this.tileNumber = tileNumber;
  this.isEmpty = null;
  this.bomb = false;
  this.nearbyBombs = null;
  this.showBomb = false;
  this.visited = false;
  this.hasFlag = false;
};

var BoardModel = function(settings) {
  this.board = this.createBoard(settings);
  this.bombs = settings.bombs;
  this.flags = settings.flags;
  this.tiles = settings.tiles;
  this.clickedTiles = null;
  this.gameOver = false;
};

BoardModel.prototype.createBoard = function(settings) {
  return setBombNumber(randomizeBombs(createMatrix(settings.tiles), settings.bombs));
};

BoardModel.prototype.flipTiles = function(row, col) {
  var top = row - 1,
      bottom = row + 1,
      right = col + 1,
      left = col - 1;

  if(this.board[row][col].bomb) {
    return;
  } else if(this.board[row][col].nearbyBombs && this.board[row][col].hasFlag === false) {
    this.board[row][col].visited = true;
    // Count every tile thats flipped.
    this.clickCounter();
    return;
  } else if(this.board[row][col].isEmpty && this.board[row][col].hasFlag === false){
    
    this.board[row][col].visited = true;
    // Count every tile thats flipped.
    this.clickCounter();

    // Top
    if(row > 0 && this.board[top][col].visited === false) {
      this.flipTiles(row - 1, col, this.board);
    }
    // Bottom
    if(row < this.board.length-1 && this.board[bottom][col].visited === false) {
      this.flipTiles(row + 1, col);
    }
    // Right
    if(col < this.board.length-1 && this.board[row][right].visited === false) {
      this.flipTiles(row, col + 1);
    }
    // Left
    if(col > 0 && this.board[row][left].visited === false) {
      this.flipTiles(row, col - 1);
    }
  }
};

BoardModel.prototype.clickCounter = function() {
  var count = this.clickedTiles || (this.tiles - this.bombs);
  this.clickedTiles = count -= 1;
};

BoardModel.prototype.showAllBombs = function() {
  _.each(this.board, function(row) {
    _.each(row, function(tile) {
      if(tile.bomb) {
        tile.showBomb = true;
      }
    });
  });

  this.gameOver = true;
};

BoardModel.prototype.addOrRemoveFlag = function(row, col, flag) {
  var tile = this.board[row][col];
  tile.hasFlag = flag;
};

/**
 * Functions to create and setup game board.
 */

// Creates N*N Board with ascending numbered tiles.
function createMatrix(tiles) {
  var sqrtOfTiles = Math.sqrt(tiles);
  var i, j, matrix = [], count = 1;
  for(i = 0; i < sqrtOfTiles; i++) {
    matrix[i] = [];
    for(j = 0; j < sqrtOfTiles; j++) {
      matrix[i][j] = new TileModel(count++);
    }
  }
  return matrix;
}

function randomizeBombs(matrix, bombCount) {
  var randomNumber;
  var len = matrix.length;
  while(bombCount > 0) {
    randomNumber = Math.floor(Math.random() * (len*len) + 1);
    for(var i = 0; i < len; i++) {
      for(var j = 0; j < len; j++) {
        if(matrix[i][j].tileNumber === randomNumber && matrix[i][j].bomb === false) {
          matrix[i][j].bomb = true;
          bombCount--;
        }
      }
    }
  }
  return matrix;
}
// Sets how many bombs are near each tile or empty if there are none.
function setBombNumber(matrix) {
  matrix.forEach(function(row, i) {
    row.forEach(function(tile, j) {
      perimeterSweep(matrix, tile, i , j);
    });
  });
  return matrix;
}
// Iterative sweep around each tile.
function perimeterSweep(matrix, tile, i, j) {
  var bombCount = 0;
  var row, col;

  // Top Row
  for(row = i - 1; row < i; row++) {
    for(col = j - 1; col <= j + 1; col++) {
      if(row >= 0 && row < matrix.length && col >= 0 && col < matrix.length) {
        if(matrix[row][col].bomb) {
          bombCount++;
        }
      }
    }
  }

  // Bottom Row
  for(row = i + 1; row > i; row--) {
    for(col = j - 1; col <= j + 1; col++) {
      if(row >= 0 && row < matrix.length && col >= 0 && col < matrix.length) {
        if(matrix[row][col].bomb) {
          bombCount++;
        }
      }
    }
  }

  // Left
  if((j - 1 >= 0) && matrix[i][j - 1].bomb) {
    bombCount++;
  }

  // Right
  if((j + 1 < matrix.length) && matrix[i][j + 1].bomb) {
    bombCount++;
  }

  // Sets isEmpty to true if there are no bombs nearby.
  if(tile.bomb === false) {
    return bombCount > 0 ? tile.nearbyBombs = bombCount : tile.isEmpty = true;
  }
}

module.exports = BoardModel;