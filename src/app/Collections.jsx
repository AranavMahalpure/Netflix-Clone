// src/components/Collections.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { MovieCard } from '@/components/movie-card';
import { MovieModal } from "@/components/movie-modal";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout/Layout";
import { Link } from 'react-router-dom';
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
    <Layout>
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

      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}