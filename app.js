let currentPlayer = 'X';
let board = [[null, null, null], [null, null, null], [null, null, null]];
let win = false;

// player info
let currentSession = {
  X: {
    name: 'X',
    score: 0
  },
  O: {
    name: 'O',
    score: 0
  }
}

// DOM elements
let squares = document.getElementsByClassName('square');
let resetGameButton = document.getElementById('newGame');
let updateNamesButton = document.getElementById('addNames');
let gameStatus = document.getElementById('gameStatus');
let playerOneNameInput = document.getElementById('p1Input');
let playerTwoNameInput = document.getElementById('p2Input');
let player1Header = document.getElementById('p1Title');
let player2Header = document.getElementById('p2Title');
let player1Score = document.getElementById('p1Score');
let player2Score = document.getElementById('p2Score');
let testButton = document.getElementById('testButton');


// setting default HTML values
player1Header.innerHTML = currentSession.X.name + '\'s Score';
player2Header.innerHTML = currentSession.O.name + '\'s Score';
player1Score.innerHTML = currentSession.X.score;
player2Score.innerHTML = currentSession.O.score;
gameStatus.innerHTML = currentSession[currentPlayer].name + ' goes first';

// EVENT HANDLERS
// reset game board
const resetGame = (event) => {
  for (let square of squares) {
    square.innerHTML = '';
  }
  win = false;
  board = [[null, null, null], [null, null, null], [null, null, null]];
  gameStatus.innerHTML = `${currentSession[currentPlayer].name} goes first`;
}

// update names
const updateNames = (event) => {
  currentSession.X.name = playerOneNameInput.value;
  currentSession.O.name = playerTwoNameInput.value;
  playerOneNameInput.value = '';
  playerTwoNameInput.value = '';
  player1Header.innerHTML = currentSession.X.name + '\'s Score';
  player2Header.innerHTML = currentSession.O.name + '\'s Score';
  gameStatus.innerHTML = currentSession[currentPlayer].name + ' goes first';
}

// places a piece on the board - does not work if win === true (game is over)
const playPiece = (event) => {
  if (!win) {
    let position = event.target.id;
    if (event.target.innerHTML === '') {
      event.target.innerHTML = currentPlayer;
      board[position[0]][position[1]] = currentPlayer;
      currentPlayer === 'X' ? currentPlayer = 'O' : currentPlayer = 'X';
    }
    winDetector(event.target.innerHTML, position[0], position[1]);
    if (!win) {
      rotateBoard(event.target.innerHTML, position[0], position[1]);
    }
  } else {
    gameStatus.innerHTML = `The game has already ended!`;
  }
}

// const rotateAnimate = () => {
//   // end board state is saved in board var
//   // css gets attached
//   // board spins 90 degrees
//   // gravity animation drags pieces downward
//   // css removed
//   // new board is rendered
// }


const rotateBoard = (arg1, arg2, arg3) => {
  var rotatedBoard = [];
  for (var i = 0; i < board[0].length; i++) {
    var newRow = [];
    for (var k = 0; k < board.length; k++) {
      newRow.push(board[k][i]);
    }
    rotatedBoard.push(newRow);
  }
  board = rotatedBoard.reverse();
  gravity();
  gravity();
  renderBoard();
  winDetector(arg1, arg2, arg3);
}

const gravity = () => {
  for (let i = 0; i < board.length - 1; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] !== null) {
        if (board[i + 1][j] === null) {
          board[i + 1][j] = board[i][j];
          board[i][j] = null;
        }
      }
    }
  }
}

const renderBoard = () => {
  for (let square of squares) {
    let boardPosition = square.id;
    square.innerHTML = board[boardPosition[0]][boardPosition[1]];
  }
}

const winDetector = (piece, row, column) => {
  if (checkRows(piece, row) || checkColumns(piece, column) || checkDiagonals(piece)) {
    gameStatus.innerHTML = `${currentSession[piece].name} wins!`;
    win = true;
    currentSession[piece].score += 1;
    player1Score.innerHTML = currentSession.X.score;
    player2Score.innerHTML = currentSession.O.score;
    currentPlayer = piece;
  } else if (tieChecker()) {
    gameStatus.innerHTML = `Tie!`;
  } else {
    gameStatus.innerHTML = `${currentSession[currentPlayer].name} makes the next move`;
  }
}

const tieChecker = () => {
  return !win && board.reduce((rowIsNull, row) => {
    return rowIsNull && row.reduce((pieceIsNull, piece) => {
      return pieceIsNull && piece !== null;
    }, true);
  }, true);
}

const checkRows = (piece, row) => {
  for (let i = 0; i < board[row].length; i++) {
    if (board[row][i] !== piece) {
      return false;
    }
  }
  return true;
}

const checkColumns = (piece, column) => {
  for (let i = 0; i < board.length; i++) {
    if (board[i][column] !== piece) {
      return false;
    }
  }
  return true;
}

const checkDiagonals = (piece) => {
  return (board[0][0] === piece && board[1][1] === piece && board[2][2] === piece) ||
    (board[0][2] === piece && board[1][1] === piece && board[2][0] === piece);
}

// attaching event handlers
resetGameButton.addEventListener('click', resetGame);
updateNamesButton.addEventListener('click', updateNames);
for (let square of squares) {
  square.addEventListener("click", playPiece);
}