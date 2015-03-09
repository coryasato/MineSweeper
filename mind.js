var App = (function() {

  var rules = {
    'modest': {
      'tiles': 81,
      'mines': 10,
      'flags': 10
    },
    'savvy': {
      'tiles': 256,
      'mines': 40,
      'flags': 40
    },
    'pro': {
      'tiles': 480,
      'mines': 99,
      'flags': 99
    }
  };

  var expLvl = rules[getExpLevel()];

  function getExpLevel() {
    var radio = document.querySelectorAll('input:checked');
    return radio[0].value;
  }

  /**
   * Models
   */

  var TileModel = function(tileNumber) {
    this.tileNumber = tileNumber;
    this.isEmpty = null;
    this.bomb = null;
    this.nearbyBombs = null;
    this.visited = false;
    this.hasFlag = false;
  };

  var BoardModel = function(rules) {

    // Creates NxN Matrix of Tiles dependant on game rules.
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

    function randomizeBombs(matrix, mineCount) {
      var randomNumber;
      var len = matrix.length;
      while(mineCount > 0) {
        randomNumber = Math.floor(Math.random() * (len*len) + 1);
        for(var i = 0; i < len; i++) {
          for(var j = 0; j < len; j++) {
            if(matrix[i][j].tileNumber === randomNumber && matrix[i][j].bomb === null) {
              matrix[i][j].bomb = 'bomb';
              mineCount--;
            }
          }
        }
      }
      return matrix;
    }

    function setBombNumber(matrix) {
      matrix.forEach(function(row, i) {
        row.forEach(function(tile, j) {
          perimeterSweep(matrix, tile, i , j);
        });
      });
      return matrix;
    }

    function perimeterSweep(matrix, tile, i, j) {
      var bombCount = 0;
      var row, col;

      // Top Row
      for(row = i - 1; row < i; row++) {
        for(col = j - 1; col <= j + 1; col++) {
          if(row >= 0 && row < matrix.length && col >= 0 && col < matrix.length) {
            if(matrix[row][col].bomb === 'bomb') {
              bombCount++;
            }
          }
        }
      }

      // Bottom Row
      for(row = i + 1; row > i; row--) {
        for(col = j - 1; col <= j + 1; col++) {
          if(row >= 0 && row < matrix.length && col >= 0 && col < matrix.length) {
            if(matrix[row][col].bomb === 'bomb') {
              bombCount++;
            }
          }
        }
      }

      // Left
      if((j - 1 >= 0) && matrix[i][j - 1].bomb === 'bomb') {
        bombCount++;
      }

      // Right
      if((j + 1 < matrix.length) && matrix[i][j + 1].bomb === 'bomb') {
        bombCount++;
      }

      // Sets isEmpty to true if there are no bombs nearby.
      if(tile.bomb === null) {
        return bombCount > 0 ? tile.nearbyBombs = bombCount : tile.isEmpty = true;
      }
    }

    // First creates a Matrix of Tiles, then randomizes bombs, then sets bomb
    // number or isEmpty to true.
    return {
      createBoard : setBombNumber(
                    randomizeBombs(
                    createMatrix(rules.tiles), rules.mines))
    };
  };

  /**
   * Views
   */

  var TileView = function(tile) {
    var div = document.createElement('div');
    div.className = 'tile animated flipInX';
    div.setAttribute('tileNumber', tile.tileNumber);

    if(tile.bomb === 'bomb') {
      div.classList.add('bomb');
    }

    if(tile.isEmpty === true) {
      div.classList.add('emptyTile');
    }

    if(tile.nearbyBombs) {
      div.classList.add('nearbyBombs');
    }

    if(tile.visited) {
      div.innerHTML = tile.nearbyBombs;
    }
    return div;
  };

  // Event listeners.
  var gameBoardClick;
  var plantOrRemoveFlag;

  var BoardView = function(matrix) {
    var gameContainer = document.getElementById('gameContainer');
    var gameBoard = document.createElement('div');
    gameBoard.className = 'gameBoard jumbotron';
    var rowWrapper, tile;

    matrix.forEach(function(row) {
      rowWrapper = document.createElement('div');
      rowWrapper.className = 'rowWrapper';
      gameBoard.appendChild(rowWrapper);

      row.forEach(function(tileModel) {
        tile = TileView(tileModel);
        rowWrapper.appendChild(tile);
      });
    });
    // Left Click
    gameBoardClick = function(e) {
      e.preventDefault();
      e.stopPropagation();

      if(Clock.hasStarted === false) {
        Clock.start();
      }
      // Prevents tiles to be clicked twice.  Prevents flagged tiles to be left clicked.
      if(e.target.classList.contains('tileFlipped') || e.target.classList.contains('hasFlag')) {
        return false;
      }

      checkTile(e.target, matrix);
    };

    // Right Click
    function plantOrRemoveFlag(e) {
      e.preventDefault();
      e.stopPropagation();

      triggerFlag(e, matrix);
    }

    gameBoard.addEventListener('click', gameBoardClick, false);
    gameBoard.addEventListener('contextmenu', plantOrRemoveFlag, false);

    return {
      render : function() {
        gameContainer.appendChild(gameBoard);
      }
    };
  };

  function checkTile(target, matrix) {
    var classList = target.classList;
    var tileNum = target.getAttribute('tilenumber');
    var rootTile, rowNum, colNum, bombTiles;

    if(classList.contains('emptyTile') || classList.contains('nearbyBombs')) {
      matrix.forEach(function(row, i) {
        row.forEach(function(tile, j) {
          if(tile.tileNumber === parseInt(tileNum, 10)) {
            rootTile = tile;
            rowNum = i;
            colNum = j;
          }
        });
      });

      replaceTile(rootTile, target);
      flipTiles(matrix, rowNum, colNum);
    } else if(classList.contains('bomb')) {
      bombTiles = document.querySelectorAll('.bomb');
      for(var i = 0; i < bombTiles.length; i++) {
        bombTiles[i].classList.add('show-bomb');
      }
      Clock.stop();
      document.querySelector('.gameBoard').removeEventListener('click', gameBoardClick);
    }
  }

  function flipTiles(matrix, row, col) {
    var top = row - 1,
        bottom = row + 1,
        right = col + 1,
        left = col - 1;

    if(matrix[row][col].bomb === 'bomb') {
      return;
    } else if(matrix[row][col].nearbyBombs && matrix[row][col].hasFlag === false) {
      createNewTile(matrix[row][col]);
      // Count every tile thats flipped.
      countClick();
      return;
    } else if(matrix[row][col].isEmpty && matrix[row][col].hasFlag === false){
      
      createNewTile(matrix[row][col]);
      // Count every tile thats flipped.
      countClick();

      // Top
      if(row > 0 && matrix[top][col].visited === false) {
        flipTiles(matrix, row - 1, col);
      }
      // Bottom
      if(row < matrix.length-1 && matrix[bottom][col].visited === false) {
        flipTiles(matrix, row + 1, col);
      }
      // Right
      if(col < matrix.length-1 && matrix[row][right].visited === false) {
        flipTiles(matrix, row, col + 1);
      }
      // Left
      if(col > 0 && matrix[row][left].visited === false) {
        flipTiles(matrix, row, col - 1);
      }
    }
  }

  function createNewTile(tile) {
    var tileNumber;
    tile.visited = true;
    tileNumber = tile.tileNumber;
    replaceTile(tile, document.querySelector('[tilenumber='+'"'+ tileNumber  +'"'+ ']'));
  }

  function replaceTile(tile, target) {
    var newTile = TileView(tile);
    var parentNode = target.parentNode;
    newTile.classList.add('tileFlipped');
    parentNode.replaceChild(newTile, target);
  }

  function triggerFlag(target, matrix) {
    var classList = target.srcElement.classList;
    var tileNum = target.srcElement.getAttribute('tilenumber');

    if(!classList.contains('hasFlag')) {
      if(Flags.updateFlags('add')) {
        classList.add('hasFlag');
        Flags.render();
        target.srcElement.removeEventListener('click', gameBoardClick, false);
      }
    } else {
      if(Flags.updateFlags('remove')) {
        classList.remove('hasFlag');
        Flags.render();
      }
    }
    // Update property to stop recursive fills in flipTiles.
    matrix.forEach(function(row, i) {
      row.forEach(function(tile, j) {
        if(tile.tileNumber === parseInt(tileNum, 10)) {
          tile.hasFlag = !tile.hasFlag;
        }
      });
    });
  }

  /**
   * Flags
   */
   var Flags = {

    flagAmount: expLvl.flags,

    updateFlags: function(action) {
      if(action === 'add' && this.flagAmount > 0) {
        this.flagAmount--;
        return true;
      } else if(action === 'remove' && this.flagAmount < expLvl.flags) {
        this.flagAmount++;
        return true;
      } else {
        return false;
      }
    }, 

    render: function() {
      var flags = document.getElementById('flags');
      flags.innerHTML = this.flagAmount + ' Flags Available';
    }

   };

  /**
   * Clock
   */
  var Clock = {
    
    clock: '00:00',

    timer: null,

    hasStarted: false,

    updateClock: function(clock) {
      clock = clock.split(':');
      var minutes = clock[0];
      var seconds = clock[1];

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

      this.clock = minutes.toString() + ':' + seconds.toString();
    },

    start: function() {
      this.stop();
      this.hasStarted = true;
      this.render();
      this.timer = setInterval(function() {
        this.updateClock(this.clock);
        this.render();
        return;
      }.bind(this), 1000);
    },

    stop: function() {
      clearInterval(this.timer);
      this.hasStarted = false;
      this.timer = null;
    },

    render: function() {
      var div = document.getElementById('clock');
      div.innerHTML = this.clock;
    }

  };

  // Listens when a tile is flipped in flipTile().
  function countClick() {
    Game.countClick();
  }

  var Game = {
    totalTiles: expLvl.tiles - expLvl.mines,

    tilesSoFar: 0,

    countClick: function() {
      this.tilesSoFar++;

      if(this.tilesSoFar === this.totalTiles) {
        console.log(this.tilesSoFar + ' Woot!');
        Clock.stop();
        alert('Jelly and Icecream!  Your time is ' + Clock.clock);
        document.querySelector('.gameBoard').removeEventListener('click', gameBoardClick);

      }
    },

    restartGame: function() {
      var gameContainer = document.getElementById('gameContainer');
      gameContainer.innerHTML = '';
      Clock.clock = '00:00';
      Clock.stop();
      Game.init();
    },

    init: function() {
      expLvl = rules[getExpLevel()];
      this.totalTiles = expLvl.tiles - expLvl.mines;
      this.tilesSoFar = 0;
      Flags.flagAmount = expLvl.flags;
      var BM = BoardModel(expLvl).createBoard;
      var restartButton = document.getElementById('restartButton');
      restartButton.addEventListener('click', this.restartGame, false);

      BoardView(BM).render();
      Clock.render();
      Flags.render();
    }
  };

  Game.init();

} ());





