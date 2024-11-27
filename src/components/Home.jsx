// src/components/Home.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const API_KEY = '680486fc06c2b310a339d274468aa685';
      const response = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
      );
      setMovies(response.data.results);
    };
    fetchMovies();
  }, []);

  return (
    <div className="movies-container">
      {movies.map((movie) => (
        <div key={movie.id} className="movie">
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
          />
          <div>{movie.title}</div>
        </div>
      ))}
    </div>
  );
}

export default Home;