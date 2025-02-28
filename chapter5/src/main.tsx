import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = "https://gdenisenko.github.io/demo-repo/chapter5/tonconnect-manifest.json";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>
);