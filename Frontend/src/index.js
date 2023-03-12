import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { init as initApm } from '@elastic/apm-rum'

const apm = initApm({

  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'Arequipet Front',
  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'https://apm.vasitos.software',

  // Set service version (required for sourcemap feature)
  serviceVersion: '1.0.0'

})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
