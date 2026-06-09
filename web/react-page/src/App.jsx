import { useState, useEffect } from "react";

function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Counter State
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("counter");
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  // Tasks State
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Explore the demo folder", completed: true },
      { id: 2, text: "Build a modern React dashboard", completed: false },
      { id: 3, text: "Commit and push to GitHub", completed: false }
    ];
  });

  // Task Inputs
  const [taskInput, setTaskInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync Theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync Counter to LocalStorage
  useEffect(() => {
    localStorage.setItem("counter", count.toString());
  }, [count]);

  // Sync Tasks to LocalStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Task Actions
  const handleAddTask = (e) => {
    if (e) e.preventDefault();
    if (!taskInput.trim()) return;
    const newTask = {
      id: Date.now(),
      text: taskInput.trim(),
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setTaskInput("");
  };

  const handleToggleTask = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const startEditing = (id, text) => {
    setEditingTaskId(id);
    setEditingText(text);
  };

  const handleSaveEdit = (id) => {
    if (!editingText.trim()) return;
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, text: editingText.trim() } : t))
    );
    setEditingTaskId(null);
    setEditingText("");
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const handleClearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Filter & Search Logic
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "active") return !t.completed && matchesSearch;
    if (filter === "completed") return t.completed && matchesSearch;
    return matchesSearch;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Determine Counter Theme Color class
  const getCounterColorClass = () => {
    if (count > 0) return "counter-val positive";
    if (count < 0) return "counter-val negative";
    return "counter-val neutral";
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-info">
          <h1>Interactive Dashboard</h1>
          <p className="subtitle">A practice playground with persistent React states and responsive layout</p>
        </div>
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === "light" ? (
            <span className="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              Dark Mode
            </span>
          ) : (
            <span className="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              Light Mode
            </span>
          )}
        </button>
      </header>

      <main className="dashboard-grid">
        {/* COUNTER MODULE */}
        <section className="panel counter-panel" id="counter-section">
          <div className="panel-header">
            <h2>Counter Widget</h2>
            <p>State syncs to localStorage</p>
          </div>
          <div className="counter-container">
            <div className={getCounterColorClass()}>{count}</div>
            <div className="counter-controls">
              <button className="btn btn-secondary" onClick={() => setCount((c) => c - 1)}>-</button>
              <button className="btn btn-danger" onClick={() => setCount(0)}>Reset</button>
              <button className="btn btn-secondary" onClick={() => setCount((c) => c + 1)}>+</button>
            </div>
          </div>
        </section>

        {/* TASK MANAGER MODULE */}
        <section className="panel tasks-panel" id="tasks-section">
          <div className="panel-header">
            <h2>Task Tracker</h2>
            <p>Filter, search, add, edit, and clear items</p>
          </div>

          {/* Stats Bar */}
          <div className="tasks-progress-bar-container">
            <div className="progress-label">
              <span>Progress</span>
              <span>{completedCount} of {totalCount} completed ({completionPercentage}%)</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>

          {/* Task form */}
          <form className="task-input-row" onSubmit={handleAddTask}>
            <input
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="What needs to be done?"
              maxLength={120}
              className="form-input"
            />
            <button type="submit" className="btn btn-primary">Add Task</button>
          </form>

          {/* Filter and search actions */}
          <div className="tasks-action-bar">
            <div className="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="search-input"
              />
            </div>
            <div className="filter-tabs">
              <button type="button" className={`tab-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
              <button type="button" className={`tab-btn ${filter === "active" ? "active" : ""}`} onClick={() => setFilter("active")}>Active</button>
              <button type="button" className={`tab-btn ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>Completed</button>
            </div>
          </div>

          {/* Task List */}
          <ul className="task-list">
            {filteredTasks.length === 0 ? (
              <li className="empty-state">
                {searchQuery ? "No matching tasks found." : "No tasks in this category."}
              </li>
            ) : (
              filteredTasks.map((t) => (
                <li key={t.id} className={`task-item ${t.completed ? "completed" : ""}`}>
                  {editingTaskId === t.id ? (
                    <div className="task-edit-row">
                      <input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="form-input edit-input"
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button type="button" className="btn btn-success btn-sm" onClick={() => handleSaveEdit(t.id)}>Save</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="task-view-row">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => handleToggleTask(t.id)}
                        />
                        <span className="checkmark"></span>
                        <span className="task-text">{t.text}</span>
                      </label>
                      <div className="task-actions">
                        <button
                          type="button"
                          className="action-btn edit-btn"
                          onClick={() => startEditing(t.id, t.text)}
                          title="Edit Task"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <button
                          type="button"
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteTask(t.id)}
                          title="Delete Task"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>

          {/* Footer of Task Tracker */}
          {completedCount > 0 && (
            <div className="panel-footer">
              <button type="button" className="btn-text btn-danger-text" onClick={handleClearCompleted}>
                Clear Completed
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
