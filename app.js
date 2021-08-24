let board = [[null, null, null], [null, null, null], [null, null, null]];

const session = {
  currentPlayer: 'X',
  plays: 0,
  win: false,
  X: {
    name: 'X',
    score: 0
  },
  O: {
    name: 'O',
    score: 0
  }
}

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

const resetGame = (event) => {
  squaresEach(square => square.innerText = '');
  session.win = false;
  board = [[null, null, null], [null, null, null], [null, null, null]];
  session.plays = 0;
  gameStatus.innerText = `${session[session.currentPlayer].name} goes first`;
}

const squaresEach = (callback) => {
  for (const square of squares) {
    callback(square);
  }
}

const updateNames = (event) => {
  session.X.name = playerOneNameInput.value || session.X.name;
  session.O.name = playerTwoNameInput.value || session.O.name;
  playerOneNameInput.value = '';
  playerTwoNameInput.value = '';
  player1Header.innerText = session.X.name + '\'s Score';
  player2Header.innerText = session.O.name + '\'s Score';
  gameStatus.innerText = session[session.currentPlayer].name + ' goes first';
}

const playPiece = (event) => {
  if (!session.win && session.plays !== 9) {
    let position = event.target.id;
    if (event.target.innerText === '') {
      event.target.innerText = session.currentPlayer;
      board[position[0]][position[1]] = session.currentPlayer;
      session.currentPlayer === 'X' ? session.currentPlayer = 'O' : session.currentPlayer = 'X';
      session.plays++;
    }
    winDetector(event.target.innerText, position[0], position[1]);
  } else {
    gameStatus.innerText = `The game has already ended!`;
  }
}

const winDetector = (piece, row, column) => {
  if (checkRow(piece, row) || checkColumn(piece, column) || checkDiagonals(piece)) {
    gameStatus.innerText = `${session[piece].name} wins!`;
    session.win = true;
    session[piece].score += 1;
    player1Score.innerText = session.X.score;
    player2Score.innerText = session.O.score;
    session.currentPlayer = piece;
  } else if (session.plays === 9) {
    gameStatus.innerText = `Tie!`;
  } else {
    gameStatus.innerText = `${session[session.currentPlayer].name} makes the next move`;
  }
}

const checkRow = (piece, row) => {
  return (board[row][0] === piece && board[row][1] === piece && board[row][2] === piece);
}

const checkColumn = (piece, column) => {
  return (board[0][column] === piece && board[1][column] === piece && board[2][column] === piece);
}

const checkDiagonals = (piece) => {
  return (board[0][0] === piece && board[1][1] === piece && board[2][2] === piece) ||
    (board[0][2] === piece && board[1][1] === piece && board[2][0] === piece);
}

resetGameButton.addEventListener('click', resetGame);
updateNamesButton.addEventListener('click', updateNames);
squaresEach(square => square.addEventListener("click", playPiece));
