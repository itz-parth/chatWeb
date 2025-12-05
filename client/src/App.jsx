// ============================================================================
// Main App Component - Router Setup
// Defines all application routes and protects the home page
// ============================================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

/**
 * App Component
 * - Sets up the main routing structure
 * - Protected routes require authentication
 * - Public routes are accessible to everyone
 */
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home page route - protected, only accessible if user is authenticated */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Login page route - public, accessible to everyone */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
