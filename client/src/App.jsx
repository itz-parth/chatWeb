import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import HomePage from './components/HomePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';


const App = () => {
  return(
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage/>
          </ProtectedRoute>
        }/>
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </Router>
  )
};

export default App;
