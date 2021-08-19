let currentPlayer = 'X';
let board = [[null, null, null], [null, null, null], [null, null, null]];
let win = false;

// player info
const currentSession = {
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
const squares = document.getElementsByClassName('square');
const resetGameButton = document.getElementById('newGame');
const updateNamesButton = document.getElementById('addNames');
const gameStatus = document.getElementById('gameStatus');
const playerOneNameInput = document.getElementById('p1Input');
const playerTwoNameInput = document.getElementById('p2Input');
const player1Header = document.getElementById('p1Title');
const player2Header = document.getElementById('p2Title');
const player1Score = document.getElementById('p1Score');
const player2Score = document.getElementById('p2Score');
const testButton = document.getElementById('testButton');


// setting default HTML values
player1Header.innerText = currentSession.X.name + '\'s Score';
player2Header.innerText = currentSession.O.name + '\'s Score';
player1Score.innerText = currentSession.X.score;
player2Score.innerText = currentSession.O.score;
gameStatus.innerText = currentSession[currentPlayer].name + ' goes first';

// EVENT HANDLERS
const resetGame = (event) => {
  for (let square of squares) {
    square.innerText = '';
  }
  win = false;
  board = [[null, null, null], [null, null, null], [null, null, null]];
  gameStatus.innerText = `${currentSession[currentPlayer].name} goes first`;
}

const updateNames = (event) => {
  currentSession.X.name = playerOneNameInput.value || currentSession.X.name;
  currentSession.O.name = playerTwoNameInput.value || currentSession.O.name;
  playerOneNameInput.value = '';
  playerTwoNameInput.value = '';
  player1Header.innerText = currentSession.X.name + '\'s Score';
  player2Header.innerText = currentSession.O.name + '\'s Score';
  gameStatus.innerText = currentSession[currentPlayer].name + ' goes first';
}

// places a piece on the board - does not work if win === true (game is over)
const playPiece = (event) => {
  if (!win) {
    let position = event.target.id;
    if (event.target.innerText === '') {
      event.target.innerText = currentPlayer;
      board[position[0]][position[1]] = currentPlayer;
      currentPlayer === 'X' ? currentPlayer = 'O' : currentPlayer = 'X';
    }
    winDetector(event.target.innerText, position[0], position[1]);
    if (!win) {
      rotateBoard(event.target.innerText, position[0], position[1]);
    }
  } else {
    gameStatus.innerText = `The game has already ended!`;
  }
}

// const rotateAnimate = () => {
//  end board state is saved in board var
//  css gets attached
//  board spins 90 degrees
//  gravity animation drags pieces downward
//  css removed
//  new board is rendered
// }

// THESE FUNCTIONS ROTATE THE BOARD CCW AFTER EACH PLAY, AND PULL ALL THE PIECES TO THE BOTTOM
// const rotateBoard = (arg1, arg2, arg3) => {
//   var rotatedBoard = [];
//   for (var i = 0; i < board[0].length; i++) {
//     var newRow = [];
//     for (var k = 0; k < board.length; k++) {
//       newRow.push(board[k][i]);
//     }
//     rotatedBoard.push(newRow);
//   }
//   board = rotatedBoard.reverse();
//   gravity();
//   gravity();
//   renderBoard();
//   winDetector(arg1, arg2, arg3);
// }

const gravity = () => {
  for (let i = 0; i < board.length - 1; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] !== null && board[i + 1][j] === null) {
        board[i + 1][j] = board[i][j];
        board[i][j] = null;
      }
    }
  }
}

const renderBoard = () => {
  for (let square of squares) {
    let boardPosition = square.id;
    square.innerText = board[boardPosition[0]][boardPosition[1]];
  }
}

const winDetector = (piece, row, column) => {
  if (checkRows(piece, row) || checkColumns(piece, column) || checkDiagonals(piece)) {
    gameStatus.innerText = `${currentSession[piece].name} wins!`;
    win = true;
    currentSession[piece].score += 1;
    player1Score.innerText = currentSession.X.score;
    player2Score.innerText = currentSession.O.score;
    currentPlayer = piece;
  } else if (tieChecker()) {
    gameStatus.innerText = `Tie!`;
  } else {
    gameStatus.innerText = `${currentSession[currentPlayer].name} makes the next move`;
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