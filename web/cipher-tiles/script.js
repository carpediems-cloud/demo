const symbols = ["A", "B", "C", "D"];
const board = document.querySelector("#board");
const targetGrid = document.querySelector("#targetGrid");
const movesEl = document.querySelector("#moves");
const timerEl = document.querySelector("#timer");
const messageEl = document.querySelector("#message");
const newGameButton = document.querySelector("#newGame");

let target = [];
let current = [];
let moves = 0;
let timeLeft = 45;
let timerId = null;
let locked = false;

function randomValue() {
  return Math.floor(Math.random() * symbols.length);
}

function makePattern() {
  return Array.from({ length: 16 }, randomValue);
}

function renderTarget() {
  targetGrid.innerHTML = "";
  target.forEach((value) => {
    const cell = document.createElement("div");
    cell.className = "mini-cell";
    cell.dataset.value = value;
    targetGrid.append(cell);
  });
}

function renderBoard() {
  board.innerHTML = "";
  current.forEach((value, index) => {
    const tile = document.createElement("button");
    tile.className = "tile";
    tile.type = "button";
    tile.dataset.value = value;
    tile.textContent = symbols[value];
    tile.setAttribute("aria-label", `Tile ${index + 1}`);
    tile.addEventListener("click", () => cycleTile(index));
    board.append(tile);
  });
}

function updateStats() {
  movesEl.textContent = moves;
  timerEl.textContent = timeLeft;
}

function isSolved() {
  return current.every((value, index) => value === target[index]);
}

function cycleTile(index) {
  if (locked) {
    return;
  }

  current[index] = (current[index] + 1) % symbols.length;
  moves += 1;
  renderBoard();
  updateStats();

  if (isSolved()) {
    locked = true;
    clearInterval(timerId);
    messageEl.textContent = `Solved in ${moves} moves. Nice hands.`;
  }
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft -= 1;
    updateStats();

    if (timeLeft <= 0) {
      locked = true;
      clearInterval(timerId);
      messageEl.textContent = "Time is up. Roll a new code.";
    }
  }, 1000);
}

function newGame() {
  target = makePattern();
  current = makePattern();
  moves = 0;
  timeLeft = 45;
  locked = false;

  if (isSolved()) {
    current[0] = (current[0] + 1) % symbols.length;
  }

  renderTarget();
  renderBoard();
  updateStats();
  messageEl.textContent = "Tap a tile to cycle its symbol.";
  startTimer();
}

newGameButton.addEventListener("click", newGame);
newGame();
