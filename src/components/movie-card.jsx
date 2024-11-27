// src/components/movie-card.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from './ui/Button';

export function MovieCard({ movie, onClick }) {



  return (
    <div
      className="relative group cursor-pointer"
      onClick={() => onClick(movie)}
      role="button"
      tabIndex={0}
    >
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
        width={300}
        height={400}
        className="rounded-md transition-transform group-hover:scale-105"
        style={{ objectFit: 'cover' }}
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-white">{movie.title}</p>
        
      </div>
    </div>
  );
}
