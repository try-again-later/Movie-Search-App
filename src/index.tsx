import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './i18n';

import App from '@components/App';

import './scss/main.scss';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
