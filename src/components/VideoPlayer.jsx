import React, { useState, useRef, useEffect } from 'react';
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  ChevronLeft,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const VideoPlayer = ({ src, movieName = "Movie Title" }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    let timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleTimeUpdate = () => {
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    setCurrentTime(videoRef.current.currentTime);
  };

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newValue) => {
    const time = (newValue[0] / 100) * duration;
    videoRef.current.currentTime = time;
    setProgress(newValue[0]);
  };

  const handleVolumeChange = (newValue) => {
    const newVolume = newValue[0] / 100;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleSpeedChange = (speed) => {
    videoRef.current.playbackRate = speed;
    setPlaybackRate(speed);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const skip = (amount) => {
    videoRef.current.currentTime += amount;
  };

  return (
    (<div
      className="relative w-full max-w-4xl mx-auto bg-black"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}>
      <video ref={videoRef} src={src} className="w-full" onClick={togglePlay} />
      {showControls && (
        <>
          <div
            className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black to-transparent">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={() => console.log('Back button clicked')}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h2 className="text-white text-xl font-bold ml-4 flex-grow text-center">{movieName}</h2>
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full" />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Button size="icon" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button size="icon" onClick={() => skip(-10)}>
                  <SkipBack className="h-6 w-6" />
                </Button>
                <Button size="icon" onClick={() => skip(10)}>
                  <SkipForward className="h-6 w-6" />
                </Button>
                <Button size="icon" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-24" />
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={playbackRate.toString()}
                  onValueChange={(value) => handleSpeedChange(parseFloat(value))}>
                  <SelectTrigger className="w-[80px] bg-transparent text-white border-white">
                    <SelectValue placeholder="Speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="icon" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>)
  );
};

export default VideoPlayer;

