import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import App from './App';
import './index.css';   // ✅ this line is inside the file, not the terminal
=======
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
>>>>>>> edacba113a5cf127c70e9f542872fe42389b3525

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
<<<<<<< HEAD
);
=======
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
>>>>>>> edacba113a5cf127c70e9f542872fe42389b3525
