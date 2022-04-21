import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
