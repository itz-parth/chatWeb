// ============================================================================
// Main entry point for the React application
// Renders the root component with authentication context and strict mode
// ============================================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './components/AuthContext.jsx';

// Initialize React root and render the application
createRoot(document.getElementById('root')).render(
  // StrictMode helps identify potential issues during development
  <StrictMode>
    {/* AuthProvider wraps the app to provide authentication context */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
