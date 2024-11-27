import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { addToCollection, removeFromCollection } from '../firebase';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { AuthContext } from '@/context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import VideoPlayer from './VideoPlayer';

const HIGH_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const LOW_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200';

export function MovieModal({ movie, isOpen, onClose }) {
  const { currentUser } = useContext(AuthContext);
  const [isInCollection, setIsInCollection] = useState(false);
  const [highQualityLoaded, setHighQualityLoaded] = useState(false);
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showVideo, setShowVideo] = useState(false);
  const [videoLinks, setVideoLinks] = useState([]);
  const [selectedVideoLink, setSelectedVideoLink] = useState('');
  const [loadingVideo, setLoadingVideo] = useState(true);

  const handleClose = () => {
    console.log("closing vid")
    handleBackToDetails()
    onClose()
  }

  useEffect(() => {
    if (movie && currentUser) {
      // Check if the movie is already in the user's collection
      const checkIfInCollection = async () => {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const collections = userData.collections || [];
            setIsInCollection(collections.includes(movie.id));
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to check collection status",
          });
        }
      };
      checkIfInCollection();
    } else {
      setIsInCollection(false);
    }
  }, [movie, currentUser, toast]);

  useEffect(() => {
    if (movie) {
      const img = new Image();
      img.src = `${HIGH_IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`;
      img.onload = () => setHighQualityLoaded(true);
    }
    return () => setHighQualityLoaded(false);
  }, [movie]);

  useEffect(() => {
    if (isOpen && searchParams.get('watch') === 'true') {
      setShowVideo(true);
    } else {
      setShowVideo(false);
    }
  }, [isOpen, searchParams]);

  useEffect(() => {
    const fetchVideoLinks = async () => {
      try {
        const videoLinksCollection = collection(db, 'video_links');
        const videoLinksSnapshot = await getDocs(videoLinksCollection);
        const links = videoLinksSnapshot.docs.map(doc => doc.data().link);
        setVideoLinks(links);
      } catch (error) {
        console.error('Error fetching video links:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load video links",
        });
      }
    };

    fetchVideoLinks();
  }, []);

  useEffect(() => {
    if (movie && videoLinks.length > 0) {
      const videoIndex = movie.id % videoLinks.length;
      setSelectedVideoLink(videoLinks[videoIndex]);
      setLoadingVideo(false);
    }
  }, [movie, videoLinks]);

  if (!movie) return null;

  const backgroundImage = highQualityLoaded
    ? `url(${HIGH_IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path})`
    : `url(${LOW_IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path})`;

  const handleToggleCollection = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to manage your collection",
      });
      return;
    }

    try {
      if (isInCollection) {
        await removeFromCollection(currentUser.uid, movie.id);
        setIsInCollection(false);
        toast({
          title: "Success",
          description: `${movie.title} has been removed from your collection`,
          className: "bg-red-600 text-white border-0",
        });
      } else {
        await addToCollection(currentUser.uid, movie.id);
        setIsInCollection(true);
        toast({
          title: "Success",
          description: `${movie.title} has been added to your collection`,
          className: "bg-red-600 text-white border-0",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update your collection. Please try again.",
      });
    }
  };

  const handleWatchClick = () => {
    setSearchParams({ watch: 'true' });
    setShowVideo(true);
  };

  const handleBackToDetails = () => {
    setSearchParams({});
    setShowVideo(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        {showVideo ? (
          loadingVideo ? (
            <div className="flex items-center justify-center min-h-[80vh] bg-black">
              <div className="text-white">Loading video...</div>
            </div>
          ) : (
            <VideoPlayer
              src={selectedVideoLink}
              movieName={movie.title}
              onBack={handleBackToDetails}
            />
          )
        ) : (
          <div
            className="relative min-h-[80vh] bg-cover bg-center transition-all duration-300 ease-in-out"
            style={{ backgroundImage }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40">
              <DialogHeader className="p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 text-white hover:text-white/80"
                  onClick={handleClose}
                >
                  <X className="w-6 h-6" />
                </Button>
              </DialogHeader>
              <div className="p-6 text-white h-full flex flex-col justify-between">
                <div>
                  {/* Movie Information */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-600 flex items-center justify-center text-xs font-bold">N</div>
                      <span className="text-sm font-medium">FILM</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={handleToggleCollection}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                      >
                        {isInCollection ? 'Remove from Collection' : 'Add to Collection'}
                      </Button>
                      <Button
                        onClick={handleWatchClick}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                      >
                        Watch Now
                      </Button>
                    </div>
                  </div>
                  <div className="bg-black bg-opacity-50 p-4 rounded">
                    <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
                    <div className="flex items-center gap-3 text-sm mb-4">
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                      <span>{movie.adult ? '18+' : 'PG'}</span>
                      <span>{movie.media_type}</span>
                      <span>{movie.original_language.toUpperCase()}</span>
                    </div>
                    <p className="text-lg mb-6">{movie.overview}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-300">Original Title</p>
                        <p>{movie.original_title}</p>
                      </div>
                      <div>
                        <p className="text-gray-300">Popularity</p>
                        <p>{movie.popularity.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-300">Vote Average</p>
                        <p>{movie.vote_average.toFixed(1)} / 10</p>
                      </div>
                      <div>
                        <p className="text-gray-300">Vote Count</p>
                        <p>{movie.vote_count.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Additional content if needed */}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
