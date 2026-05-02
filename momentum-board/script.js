const STORAGE_KEY = "momentum-board-state";

const state = loadState();
const elements = {
  form: document.querySelector("#taskForm"),
  title: document.querySelector("#taskTitle"),
  category: document.querySelector("#taskCategory"),
  effort: document.querySelector("#taskEffort"),
  list: document.querySelector("#taskList"),
  empty: document.querySelector("#emptyState"),
  doneCount: document.querySelector("#doneCount"),
  activeCount: document.querySelector("#activeCount"),
  focusCount: document.querySelector("#focusCount"),
  streakCount: document.querySelector("#streakCount"),
  currentTime: document.querySelector("#currentTime"),
  currentDate: document.querySelector("#currentDate"),
  timerDisplay: document.querySelector("#timerDisplay"),
  timerMode: document.querySelector("#timerMode"),
  startTimer: document.querySelector("#startTimer"),
  resetTimer: document.querySelector("#resetTimer"),
  shortTimer: document.querySelector("#shortTimer"),
  longTimer: document.querySelector("#longTimer"),
  canvas: document.querySelector("#pulseCanvas"),
  template: document.querySelector("#taskTemplate"),
  filters: document.querySelectorAll("[data-filter]")
};

let filter = "all";
let timerLength = 25 * 60;
let remaining = timerLength;
let timerId = null;
let lastTick = 0;

elements.form.addEventListener("submit", addTask);
elements.list.addEventListener("click", handleTaskAction);
elements.startTimer.addEventListener("click", toggleTimer);
elements.resetTimer.addEventListener("click", resetTimer);
elements.shortTimer.addEventListener("click", () => setTimerLength(15));
elements.longTimer.addEventListener("click", () => setTimerLength(45));
elements.filters.forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    elements.filters.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

setInterval(updateClock, 1000);
requestAnimationFrame(drawPulse);
updateClock();
render();

function loadState() {
  const fallback = {
    tasks: [
      createTask("Sketch one useful idea", "Build", 25),
      createTask("Review yesterday's notes", "Study", 15)
    ],
    focusMinutes: 0,
    completedDates: []
  };

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createTask(title, category, effort) {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    category,
    effort: Number(effort),
    done: false,
    createdAt: new Date().toISOString()
  };
}

function addTask(event) {
  event.preventDefault();

  const task = createTask(elements.title.value, elements.category.value, elements.effort.value);
  if (!task.title) return;

  state.tasks.unshift(task);
  elements.form.reset();
  elements.effort.value = 25;
  saveState();
  render();
}

function handleTaskAction(event) {
  const item = event.target.closest(".task");
  if (!item) return;

  const task = state.tasks.find((entry) => entry.id === item.dataset.id);
  if (!task) return;

  if (event.target.closest(".delete")) {
    state.tasks = state.tasks.filter((entry) => entry.id !== task.id);
  }

  if (event.target.closest(".check")) {
    task.done = !task.done;
    if (task.done) markCompletedToday();
  }

  saveState();
  render();
}

function markCompletedToday() {
  const today = new Date().toISOString().slice(0, 10);
  if (!state.completedDates.includes(today)) {
    state.completedDates.push(today);
  }
}

function render() {
  const visibleTasks = state.tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "done") return task.done;
    return true;
  });

  elements.list.replaceChildren(...visibleTasks.map(renderTask));
  elements.empty.hidden = visibleTasks.length > 0;

  const done = state.tasks.filter((task) => task.done).length;
  elements.doneCount.textContent = done;
  elements.activeCount.textContent = state.tasks.length - done;
  elements.focusCount.textContent = state.focusMinutes;
  elements.streakCount.textContent = getStreak();
}

function renderTask(task) {
  const node = elements.template.content.firstElementChild.cloneNode(true);
  node.dataset.id = task.id;
  node.classList.toggle("done", task.done);
  node.querySelector("strong").textContent = task.title;
  node.querySelector("span").textContent = task.category;
  node.querySelector("small").textContent = `${task.effort} min`;
  return node;
}

function getStreak() {
  const completed = new Set(state.completedDates);
  let streak = 0;
  const day = new Date();

  while (completed.has(day.toISOString().slice(0, 10))) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }

  return streak;
}

function updateClock() {
  const now = new Date();
  elements.currentTime.textContent = new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit"
  }).format(now);
  elements.currentDate.textContent = new Intl.DateTimeFormat([], {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(now);
}

function toggleTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    elements.startTimer.textContent = "▶";
    elements.timerMode.textContent = "Paused";
    return;
  }

  lastTick = Date.now();
  timerId = setInterval(tickTimer, 250);
  elements.startTimer.textContent = "Ⅱ";
  elements.timerMode.textContent = "Focusing";
}

function tickTimer() {
  const now = Date.now();
  const elapsed = Math.floor((now - lastTick) / 1000);
  if (elapsed < 1) return;

  lastTick = now;
  remaining = Math.max(0, remaining - elapsed);
  updateTimerDisplay();

  if (remaining === 0) {
    clearInterval(timerId);
    timerId = null;
    state.focusMinutes += Math.round(timerLength / 60);
    markCompletedToday();
    saveState();
    render();
    resetTimer();
  }
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  remaining = timerLength;
  elements.startTimer.textContent = "▶";
  elements.timerMode.textContent = "Ready";
  updateTimerDisplay();
}

function setTimerLength(minutes) {
  timerLength = minutes * 60;
  resetTimer();
}

function updateTimerDisplay() {
  const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");
  elements.timerDisplay.textContent = `${minutes}:${seconds}`;
}

function drawPulse(time) {
  const canvas = elements.canvas;
  const context = canvas.getContext("2d");
  const size = canvas.width;
  const center = size / 2;
  const progress = 1 - remaining / timerLength;
  const wave = Math.sin(time / 700) * 5;

  context.clearRect(0, 0, size, size);
  context.lineWidth = 18;
  context.strokeStyle = "#eadfcd";
  context.beginPath();
  context.arc(center, center, 132 + wave, 0, Math.PI * 2);
  context.stroke();

  context.strokeStyle = timerId ? "#247b5b" : "#2f6c9f";
  context.lineCap = "round";
  context.beginPath();
  context.arc(center, center, 132 + wave, -Math.PI / 2, Math.PI * 2 * progress - Math.PI / 2);
  context.stroke();

  context.fillStyle = "#d85d4a";
  for (let index = 0; index < 8; index += 1) {
    const angle = (Math.PI * 2 * index) / 8 + time / 4000;
    const radius = 156 + Math.sin(time / 600 + index) * 7;
    context.beginPath();
    context.arc(center + Math.cos(angle) * radius, center + Math.sin(angle) * radius, 4, 0, Math.PI * 2);
    context.fill();
  }

  requestAnimationFrame(drawPulse);
}
