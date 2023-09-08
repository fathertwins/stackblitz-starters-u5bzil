import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
//import App from './App1';
//import App from './App_my';
//import App from './App_disp';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
