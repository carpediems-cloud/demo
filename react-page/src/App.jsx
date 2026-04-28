import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleAddTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, task.trim()]);
    setTask("");
  };

  return (
    <div className="app-shell">
      <header>
        <h1>React Functional Page</h1>
        <p>Fully functional page with state, events, and a small task list.</p>
      </header>

      <section className="panel">
        <h2>Counter</h2>
        <div className="counter-row">
          <button onClick={() => setCount((c) => c - 1)}>-</button>
          <span>{count}</span>
          <button onClick={() => setCount((c) => c + 1)}>+</button>
        </div>
      </section>

      <section className="panel">
        <h2>Task List</h2>
        <div className="task-input-row">
          <input
            value={task}
            onChange={(event) => setTask(event.target.value)}
            placeholder="Add a new task"
          />
          <button onClick={handleAddTask}>Add</button>
        </div>
        <ul className="task-list">
          {tasks.length === 0 ? (
            <li className="empty-state">No tasks yet.</li>
          ) : (
            tasks.map((item, index) => <li key={index}>{item}</li>)
          )}
        </ul>
      </section>
    </div>
  );
}

export default App;
