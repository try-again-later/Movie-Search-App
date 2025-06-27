import { createRoot } from 'react-dom/client';
import './i18n';

import App from '@components/App';

import './scss/main.scss';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
