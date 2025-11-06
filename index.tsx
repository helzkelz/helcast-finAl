import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('🚀 Helcast App Starting...');
console.log('🌐 Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'SSR');

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('🎯 Root element found, rendering app...');
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ App rendered successfully!');
} else {
  console.error('❌ Root element not found!');
}
