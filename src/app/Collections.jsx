// src/components/Collections.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { db, auth } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { MovieCard } from '@/components/movie-card';
import { MovieModal } from "@/components/movie-modal";
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { signOut } from "firebase/auth";
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default function Collections() {
  const { currentUser } = useContext(AuthContext);
  const [collectionMovieIds, setCollectionMovieIds] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch movie IDs from Firestore
  useEffect(() => {
    if (currentUser) {
      const userDoc = doc(db, 'users', currentUser.uid);
      const unsubscribe = onSnapshot(userDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setCollectionMovieIds(docSnapshot.data().collections || []);
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  // Fetch movie details from TMDB API
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const moviePromises = collectionMovieIds.map(id =>
          axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`)
        );
        const responses = await Promise.all(moviePromises);
        const movieData = responses.map(response => response.data);
        setMovies(movieData);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };

    if (collectionMovieIds.length > 0) {
      fetchMovies();
    } else {
      setMovies([]);
      setLoading(false);
    }
  }, [collectionMovieIds]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  if (!currentUser) {
    return <p className="text-center p-4">Please log in to view your collections.</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Netflix"
            width={120}
            height={34}
            className="w-28"
          />
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-white gap-2">
            <Globe className="w-4 h-4" />
            English
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => signOut(auth)}
          >
            Logout
          </Button>
        </div>
      </header>

      <main>
        <section className="px-4 py-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Your Collection</h2>
          {loading ? (
            <div className="text-center p-4">Loading your collection...</div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : movies.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-xl mb-4">Your collection is empty</p>
              <Link to="/">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Browse Movies
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={handleMovieClick}
                  isInCollectionView={true}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="px-4 py-8 border-t border-gray-600">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <a href="#" className="text-gray-400 hover:underline block">FAQ</a>
            <a href="#" className="text-gray-400 hover:underline block">Investor Relations</a>
            <a href="#" className="text-gray-400 hover:underline block">Privacy</a>
            <a href="#" className="text-gray-400 hover:underline block">Speed Test</a>
          </div>
          <div className="space-y-4">
            <a href="#" className="text-gray-400 hover:underline block">Help Centre</a>
            <a href="#" className="text-gray-400 hover:underline block">Jobs</a>
            <a href="#" className="text-gray-400 hover:underline block">Cookie Preferences</a>
            <a href="#" className="text-gray-400 hover:underline block">Legal Notices</a>
          </div>
          <div className="space-y-4">
            <a href="#" className="text-gray-400 hover:underline block">Account</a>
            <a href="#" className="text-gray-400 hover:underline block">Ways to Watch</a>
            <a href="#" className="text-gray-400 hover:underline block">Corporate Information</a>
            <a href="#" className="text-gray-400 hover:underline block">Only on Netflix</a>
          </div>
          <div className="space-y-4">
            <a href="#" className="text-gray-400 hover:underline block">Media Centre</a>
            <a href="#" className="text-gray-400 hover:underline block">Terms of Use</a>
            <a href="#" className="text-gray-400 hover:underline block">Contact Us</a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <Button variant="ghost" size="sm" className="text-gray-400 gap-2">
            <Globe className="w-4 h-4" />
            English
          </Button>
          <p className="mt-4">Netflix India</p>
        </div>
      </footer>

      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}