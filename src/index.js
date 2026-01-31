import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';   // ✅ this line is inside the file, not the terminal

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);