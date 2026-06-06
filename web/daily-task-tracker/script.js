const STORAGE_KEY = "daily-task-tracker-v1";

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const formMessage = document.getElementById("form-message");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const todayLabel = document.getElementById("today-label");
const completionCount = document.getElementById("completion-count");
const focusScore = document.getElementById("focus-score");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const clearCompletedButton = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter-btn");
const taskTemplate = document.getElementById("task-template");

let activeFilter = "all";
let tasks = loadTasks();

setTodayLabel();
renderTasks();

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (!title) {
    setFormMessage("Please enter a task before adding it.");
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: createTaskId(),
    title,
    priority,
    completed: false,
    createdAt: new Date().toISOString(),
  });

  persistTasks();
  renderTasks();
  taskForm.reset();
  prioritySelect.value = "medium";
  setFormMessage("Task added. Keep the momentum going.");
  taskInput.focus();
});

clearCompletedButton.addEventListener("click", () => {
  const before = tasks.length;
  tasks = tasks.filter((task) => !task.completed);

  if (tasks.length === before) {
    setFormMessage("No completed tasks to clear yet.");
    return;
  }

  persistTasks();
  renderTasks();
  setFormMessage("Completed tasks cleared.");
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    renderTasks();
  });
});

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  filteredTasks.forEach((task) => {
    const taskNode = taskTemplate.content.firstElementChild.cloneNode(true);
    const toggle = taskNode.querySelector(".task-toggle");
    const title = taskNode.querySelector(".task-title");
    const meta = taskNode.querySelector(".task-meta");
    const badge = taskNode.querySelector(".priority-badge");
    const editButton = taskNode.querySelector(".edit-btn");
    const deleteButton = taskNode.querySelector(".delete-btn");

    toggle.checked = task.completed;
    title.textContent = task.title;
    meta.textContent = formatMeta(task);
    badge.textContent = task.priority;
    badge.classList.add(task.priority);

    if (task.completed) {
      taskNode.classList.add("completed");
    }

    toggle.addEventListener("change", () => toggleTask(task.id));
    editButton.addEventListener("click", () => editTask(task.id));
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    taskList.appendChild(taskNode);
  });

  updateSummary();
  emptyState.classList.toggle("hidden", filteredTasks.length > 0);
}

function getFilteredTasks() {
  switch (activeFilter) {
    case "pending":
      return tasks.filter((task) => !task.completed);
    case "completed":
      return tasks.filter((task) => task.completed);
    case "high":
      return tasks.filter((task) => task.priority === "high");
    default:
      return tasks;
  }
}

function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );

  persistTasks();
  renderTasks();
}

function editTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  const nextTitle = window.prompt("Update your task", task.title);

  if (nextTitle === null) {
    return;
  }

  const cleanedTitle = nextTitle.trim();

  if (!cleanedTitle) {
    setFormMessage("Task title cannot be empty.");
    return;
  }

  const nextPriority = window.prompt(
    "Set priority: high, medium, or low",
    task.priority
  );

  if (nextPriority === null) {
    return;
  }

  const cleanedPriority = nextPriority.trim().toLowerCase();

  if (!["high", "medium", "low"].includes(cleanedPriority)) {
    setFormMessage("Priority must be high, medium, or low.");
    return;
  }

  tasks = tasks.map((item) =>
    item.id === taskId
      ? { ...item, title: cleanedTitle, priority: cleanedPriority }
      : item
  );

  persistTasks();
  renderTasks();
  setFormMessage("Task updated.");
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  persistTasks();
  renderTasks();
  setFormMessage("Task removed.");
}

function updateSummary() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  completionCount.textContent = `${completed} / ${total}`;
  focusScore.textContent = `${percent}%`;
  progressText.textContent = `${percent}% complete`;
  progressFill.style.width = `${percent}%`;
}

function setTodayLabel() {
  todayLabel.textContent = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function formatMeta(task) {
  const created = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(task.createdAt));

  return `${capitalize(task.priority)} priority - added at ${created}`;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function setFormMessage(message) {
  formMessage.textContent = message;
}

function persistTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTaskId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidTask);
  } catch {
    return [];
  }
}

function isValidTask(task) {
  return (
    task &&
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.priority === "string" &&
    typeof task.completed === "boolean" &&
    typeof task.createdAt === "string"
  );
}
