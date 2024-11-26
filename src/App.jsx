// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { MovieModal } from './components/movie-modal';
import Home from './app/Home';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          // <PrivateRoute>
            <Home />
          // </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;