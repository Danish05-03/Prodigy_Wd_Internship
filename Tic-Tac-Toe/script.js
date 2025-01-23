const cells = document.querySelectorAll('.cell');
const message = document.querySelector('.message');
const restartButton = document.querySelector('.restart');
const boardElement = document.querySelector('.board');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = false;
let isAiMode = false;
let difficulty = 'Easy';

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWin() {
  for (const [index, combination] of winningCombinations.entries()) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      drawSlashLine(index);
      return true;
    }
  }
  return false;
}

function checkDraw() {
  return board.every(cell => cell !== '');
}

function drawSlashLine(index) {
  boardElement.classList.add('winner');
  if (index < 3) boardElement.classList.add(`horizontal-${index}`);
  else if (index < 6) boardElement.classList.add(`vertical-${index - 3}`);
  else if (index === 6) boardElement.classList.add('diagonal-0');
  else if (index === 7) boardElement.classList.add('diagonal-1');
}

function handleClick(e) {
  const cell = e.target;
  const index = cell.getAttribute('data-index');

  if (!board[index] && isGameActive) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin()) {
      message.textContent = `Player ${currentPlayer} wins! 🎉`;
      document.body.classList.add('winner'); // Enhance webpage
      isGameActive = false;
    } else if (checkDraw()) {
      message.textContent = "It's a draw! 🤝";
      isGameActive = false;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      message.textContent = `Player ${currentPlayer}'s turn`;

      if (isAiMode && currentPlayer === 'O') {
        setTimeout(aiMove, 500);
      }
    }
  }
}

function restartGame() {
  currentPlayer = 'X';
  board = ['', '', '', '', '', '', '', '', ''];
  isGameActive = true;
  message.textContent = "Player X's turn";
  cells.forEach(cell => (cell.textContent = ''));
  boardElement.className = 'board';
  document.body.classList.remove('winner');
}

function startPlayerMode() {
  isAiMode = false;
  restartGame();
}

function startAiMode(selectedDifficulty) {
  isAiMode = true;
  difficulty = selectedDifficulty;
  restartGame();
}

function aiMove() {
  let move;

  if (difficulty === 'Easy') {
    move = getRandomMove();
  } else if (difficulty === 'Medium') {
    move = getBlockingMove() || getRandomMove();
  } else if (difficulty === 'Hard') {
    move = getBestMove();
  }

  if (move !== undefined) {
    board[move] = 'O';
    const aiCell = document.querySelector(`.cell[data-index="${move}"]`);
    aiCell.textContent = 'O';

    if (checkWin()) {
      message.textContent = 'AI wins! 🤖';
      isGameActive = false;
    } else if (checkDraw()) {
      message.textContent = "It's a draw! 🤝";
      isGameActive = false;
    } else {
      currentPlayer = 'X';
      message.textContent = "Player X's turn";
    }
  }
}

function getRandomMove() {
  const emptyCells = board
    .map((cell, index) => (cell === '' ? index : null))
    .filter(index => index !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getBlockingMove() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] === 'X' && board[b] === 'X' && !board[c]) return c;
    if (board[b] === 'X' && board[c] === 'X' && !board[a]) return a;
    if (board[a] === 'X' && board[c] === 'X' && !board[b]) return b;
  }
  return null;
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      let score = minimax(board, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, isMaximizing) {
  if (checkWin()) return isMaximizing ? -10 : 10;
  if (checkDraw()) return 0;

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let i = 0; i < newBoard.length; i++) {
    if (newBoard[i] === '') {
      newBoard[i] = isMaximizing ? 'O' : 'X';
      let score = minimax(newBoard, !isMaximizing);
      newBoard[i] = '';
      bestScore = isMaximizing
        ? Math.max(score, bestScore)
        : Math.min(score, bestScore);
    }
  }
  return bestScore;
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);
