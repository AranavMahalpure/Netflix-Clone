// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from '@/components/Signup';
import Login from '@/components/Login';
import PrivateRoute from '@/components/PrivateRoute';
import { MovieModal } from '@/components/movie-modal';
import Home from '@/app/Home';
import Collections from '@/app/Collections';
import { Toaster } from "@/components/ui/toaster";
import VideoPlayer from './components/VideoPlayer';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/video" element={
          <VideoPlayer
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            movieName="Big Buck Bunny"
          />}
        />
        <Route
          path="/collections"
          element={
            <PrivateRoute>
              <Collections />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;