// src/components/Collections.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { MovieCard } from '@/components/movie-card';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default function Collections() {
  const { currentUser } = useContext(AuthContext);
  const [collectionMovieIds, setCollectionMovieIds] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (!currentUser) {
    return <p className="text-center p-4">Please log in to view your collections.</p>;
  }

  if (loading) {
    return <div className="text-center p-4">Loading your collection...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Collection</h2>
      {movies.length === 0 ? (
        <p>You have no movies in your collection.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => {}}
              isInCollectionView={true}
            />
          ))}
        </div>
        
      )}
    </div>
  );
}