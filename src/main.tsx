import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { SettingsProvider } from './context/SettingsContext';
import { initializeDatabase } from './lib/supabase-init';
import App from './App.tsx';
import './index.css';

// Initialize database tables
initializeDatabase().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </HelmetProvider>
  </StrictMode>
);