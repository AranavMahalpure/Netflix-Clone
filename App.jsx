import React from 'react';
import VideoPlayer from './components/VideoPlayer';

const App = () => {
  return (
    (<div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <VideoPlayer
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        movieName="Big Buck Bunny" />
    </div>)
  );
};

export default App;

