const playground = document.getElementById("playground");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const scoreValue = document.getElementById("scoreValue");
const starsValue = document.getElementById("starsValue");
const timeValue = document.getElementById("timeValue");
const targetBadge = document.getElementById("targetBadge");
const missionTitle = document.getElementById("missionTitle");
const missionText = document.getElementById("missionText");
const streakValue = document.getElementById("streakValue");
const statusValue = document.getElementById("statusValue");

const palette = {
  pink: "#ff6fb5",
  yellow: "#ffd84d",
  blue: "#5d8bff",
  mint: "#58d6a3"
};

const faces = ["😀", "😄", "😊", "🤩", "🥳"];

const state = {
  items: [],
  score: 0,
  stars: 0,
  timeLeft: 30,
  running: false,
  timerId: null,
  moveId: null,
  bestStreak: 0,
  currentStreak: 0,
  target: null,
  balloonId: 0
};

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function updateScoreboard() {
  scoreValue.textContent = state.score.toString();
  starsValue.textContent = state.stars.toString();
  timeValue.textContent = `${state.timeLeft}s`;
  streakValue.textContent = state.bestStreak.toString();
}

function setStatus(text) {
  statusValue.textContent = text;
}

function setMission(statusText) {
  targetBadge.className = "target-badge pink";
  targetBadge.textContent = "Pop Fast";
  missionTitle.textContent = "Pop every balloon you can";
  missionText.textContent = statusText;
}

function createBalloonElement(item) {
  const element = document.createElement("button");
  element.type = "button";
  element.className = `balloon ${item.color}`;
  element.dataset.id = item.id;
  element.style.left = `${item.x}px`;
  element.style.top = `${item.y}px`;
  element.innerHTML = `<div class="balloon-body"><div class="balloon-face">${item.face}</div></div><div class="balloon-string"></div>`;

  element.addEventListener("click", () => handleShapeClick(item.id));
  playground.appendChild(element);
  item.el = element;
}

function clearShapes() {
  state.items.forEach((item) => item.el && item.el.remove());
  state.items = [];
}

function addBalloon() {
  state.balloonId += 1;
  const balloon = {
    id: `balloon-${state.balloonId}`,
    color: randomItem(Object.keys(palette)),
    face: randomItem(faces),
    x: random(16, Math.max(20, playground.clientWidth - 100)),
    y: playground.clientHeight + random(10, 120),
    vx: random(-0.35, 0.35),
    vy: random(1.1, 2.2)
  };

  state.items.push(balloon);
  createBalloonElement(balloon);
}

function spawnShapes() {
  clearShapes();
  for (let i = 0; i < 10; i += 1) {
    addBalloon();
  }
  setMission("Click the balloons before they float away to earn points and stars.");
}

function showBurst(x, y, text) {
  const burst = document.createElement("div");
  burst.className = "pop-burst";
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  burst.textContent = text;
  playground.appendChild(burst);
  setTimeout(() => burst.remove(), 700);
}

function handleShapeClick(id) {
  if (!state.running) {
    return;
  }

  const item = state.items.find((entry) => entry.id === id);
  if (!item) {
    return;
  }

  const burstX = item.x + 26;
  const burstY = item.y + 18;
  state.score += 10;
  state.currentStreak += 1;
  state.bestStreak = Math.max(state.bestStreak, state.currentStreak);

  if (state.currentStreak % 5 === 0) {
    state.stars += 1;
    showBurst(burstX, burstY, "Star +1");
  } else {
    showBurst(burstX, burstY, "Pop!");
  }

  item.el.remove();
  state.items = state.items.filter((entry) => entry.id !== id);
  addBalloon();
  setStatus("Pop pop pop!");
  updateScoreboard();
}

function moveShapes() {
  const escaped = [];

  state.items.forEach((item) => {
    item.x += item.vx;
    item.y -= item.vy;
    const limitX = playground.clientWidth - 90;

    if (item.x <= 0 || item.x >= limitX) {
      item.vx *= -1;
    }

    if (item.y < -140) {
      escaped.push(item.id);
    }

    item.x = Math.max(0, Math.min(limitX, item.x));
    item.el.style.left = `${item.x}px`;
    item.el.style.top = `${item.y}px`;
  });

  if (escaped.length > 0) {
    escaped.forEach((id) => {
      const item = state.items.find((entry) => entry.id === id);
      if (item && item.el) {
        item.el.remove();
      }
    });
    state.items = state.items.filter((item) => !escaped.includes(item.id));
    state.currentStreak = 0;
    state.score = Math.max(0, state.score - escaped.length * 3);
    for (let i = 0; i < escaped.length; i += 1) {
      addBalloon();
    }
    setStatus("A balloon got away");
    updateScoreboard();
  }

  if (state.running) {
    state.moveId = requestAnimationFrame(moveShapes);
  }
}

function stopGame(message) {
  state.running = false;
  clearInterval(state.timerId);
  cancelAnimationFrame(state.moveId);
  state.timerId = null;
  state.moveId = null;
  missionTitle.textContent = "Round finished";
  missionText.textContent = message;
  setStatus("Round over");
}

function startGame() {
  if (state.running) {
    return;
  }

  state.score = 0;
  state.stars = 0;
  state.timeLeft = 30;
  state.currentStreak = 0;
  state.running = true;
  updateScoreboard();
  spawnShapes();
  setStatus("Game started");
  setMission("Click the balloons before they float away to earn points and stars.");

  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateScoreboard();

    if (state.timeLeft <= 0) {
      stopGame(`You scored ${state.score} points and collected ${state.stars} stars. Press New Round to play again.`);
    }
  }, 1000);

  moveShapes();
}

function resetGame() {
  state.running = false;
  clearInterval(state.timerId);
  cancelAnimationFrame(state.moveId);
  state.timerId = null;
  state.moveId = null;
  state.score = 0;
  state.stars = 0;
  state.timeLeft = 30;
  state.currentStreak = 0;
  clearShapes();
  updateScoreboard();
  targetBadge.className = "target-badge pink";
  targetBadge.textContent = "Pop Fast";
  missionTitle.textContent = "Tap start to begin";
  missionText.textContent = "Click the balloons before they float away to earn points and stars.";
  setStatus("Ready to play");
}

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

window.addEventListener("resize", () => {
  state.items.forEach((item) => {
    item.x = Math.min(item.x, Math.max(0, playground.clientWidth - 100));
    item.y = Math.min(item.y, Math.max(0, playground.clientHeight - 100));
    item.el.style.left = `${item.x}px`;
    item.el.style.top = `${item.y}px`;
  });
});

updateScoreboard();
