import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [codeSnippet, setCodeSnippet] = useState('');

  // Add or update a task
  const addOrUpdateTask = () => {
    if (input.trim() === '') return;

    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = input;
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      setTasks([...tasks, input]);
    }
    setInput('');
  };

  // Delete a task
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Edit a task
  const editTask = (index) => {
    setInput(tasks[index]);
    setEditIndex(index);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Developer To‑Do App</h1>

      {/* Task Input */}
      <div>
        <input
          type="text"
          placeholder="Enter a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: '8px', width: '250px', marginRight: '10px' }}
        />
        <button onClick={addOrUpdateTask} style={{ padding: '8px 12px' }}>
          {editIndex !== null ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      {/* Task List */}
      <ul style={{ marginTop: '20px' }}>
        {tasks.map((task, index) => (
          <li key={index} style={{ marginBottom: '8px' }}>
            {task}{' '}
            <button
              onClick={() => editTask(index)}
              style={{ marginLeft: '10px', padding: '4px 8px' }}
            >
              Edit
            </button>
            <button
              onClick={() => deleteTask(index)}
              style={{ marginLeft: '5px', padding: '4px 8px', color: 'red' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Code Snippet Input */}
      <div style={{ marginTop: '30px' }}>
        <h2>Code Snippet</h2>
        <textarea
          placeholder="Paste your code here..."
          value={codeSnippet}
          onChange={(e) => setCodeSnippet(e.target.value)}
          rows={6}
          cols={50}
          style={{ padding: '10px', fontFamily: 'monospace' }}
        />
      </div>

      {/* Syntax Highlighted Code */}
      {codeSnippet && (
        <div style={{ marginTop: '20px' }}>
          <h3>Preview:</h3>
          <SyntaxHighlighter language="javascript" style={oneDark}>
            {codeSnippet}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}

export default App;