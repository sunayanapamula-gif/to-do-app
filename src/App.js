import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [input, setInput] = useState('');
  const [snippet, setSnippet] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const addTask = () => {
    if (input.trim() === '') return;
    setTasks([...tasks, { text: input, completed: false, snippet, category, priority, dueDate }]);
    setInput('');
    setSnippet('');
    setDueDate('');
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDrop = (index) => {
    const newTasks = [...tasks];
    const draggedTask = newTasks[dragIndex];
    newTasks.splice(dragIndex, 1);
    newTasks.splice(index, 0, draggedTask);
    setTasks(newTasks);
    setDragIndex(null);
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'All') return true;
      if (filter === 'Work' || filter === 'Personal' || filter === 'Code') {
        return task.category === filter;
      }
      if (filter === 'Today') {
        const today = new Date();
        const due = new Date(task.dueDate);
        return (
          due.getDate() === today.getDate() &&
          due.getMonth() === today.getMonth() &&
          due.getFullYear() === today.getFullYear()
        );
      }
      if (filter === 'ThisWeek') {
        const today = new Date();
        const due = new Date(task.dueDate);
        const diff = (due - today) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
      }
      return true;
    })
    .filter((task) =>
      task.text.toLowerCase().includes(search.toLowerCase()) ||
      (task.snippet && task.snippet.toLowerCase().includes(search.toLowerCase()))
    );

  // Progress bar calculation
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Decide color class
  let progressClass = "low";
  if (progress > 70) {
    progressClass = "high";
  } else if (progress > 30) {
    progressClass = "medium";
  }

  const downloadMarkdown = () => {
    let mdContent = `# Developer To-Do List\n\n`;
    tasks.forEach((task) => {
      mdContent += `- [${task.completed ? 'x' : ' '}] **${task.text}** (${task.category}, ${task.priority}${task.dueDate ? `, due ${task.dueDate}` : ''})\n`;
      if (task.snippet) {
        mdContent += `\n\`\`\`javascript\n${task.snippet}\n\`\`\`\n\n`;
      }
    });

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`app ${theme}`}>
      <h1>Developer To‑Do App</h1>
      <button className="theme-toggle" onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>

      <div className="progress-container">
        <div className={`progress-bar ${progressClass}`} style={{ width: `${progress}%` }}>
          <span className="progress-label">{Math.round(progress)}%</span>
        </div>
      </div>
      <p>{completedCount} of {totalCount} tasks completed</p>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Code">Code</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <textarea
        placeholder="Optional: Add code snippet..."
        value={snippet}
        onChange={(e) => setSnippet(e.target.value)}
      />

      <div className="filter-section">
        <button onClick={() => setFilter('All')}>All</button>
        <button onClick={() => setFilter('Work')}>Work</button>
        <button onClick={() => setFilter('Personal')}>Personal</button>
        <button onClick={() => setFilter('Code')}>Code</button>
        <button onClick={() => setFilter('Today')}>Due Today</button>
        <button onClick={() => setFilter('ThisWeek')}>Due This Week</button>
      </div>

      <input
        className="search-bar"
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button className="clear-btn" onClick={clearCompleted}>
        Clear Completed Tasks
      </button>

      <button className="download-btn" onClick={downloadMarkdown}>
        Download Tasks as Markdown
      </button>

      <ul>
        {filteredTasks.map((task, index) => (
          <li
            key={index}
            className={task.completed ? 'completed' : ''}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
          >
            <strong>[{task.category}]</strong> <em>({task.priority})</em>{' '}
            {task.dueDate && <span className="due-date">Due: {task.dueDate}</span>}{' '}
            <span onClick={() => toggleTask(index)}>{task.text}</span>
            <button onClick={() => deleteTask(index)}>Delete</button>
            {task.snippet && (
              <SyntaxHighlighter language="javascript" style={oneDark}>
                {task.snippet}
              </SyntaxHighlighter>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;