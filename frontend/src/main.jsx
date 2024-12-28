import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Include if you have any global CSS
import App from './App';
// In src/index.js or src/App.js

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
