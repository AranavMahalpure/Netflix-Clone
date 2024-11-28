import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MovieCard } from "@/components/movie-card";
import { MovieModal } from "@/components/movie-modal";

import { auth } from "@/firebase"; // Import the auth object
import { onAuthStateChanged, signOut } from "firebase/auth";


import axios from 'axios';
import { AuthContext } from "@/context/AuthContext";
import { Layout } from "@/components/Layout/Layout";

import api from '@/lib/axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';



export default function Home() {
  const { currentUser } = useContext(AuthContext);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState({
    trending: [],
    topRated: [],
    upcoming: [],
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let trendingRes = { data: { results: [] } };
        let topRatedRes = { data: { results: [] } };
        let upcomingRes = { data: { results: [] } };

        try {
          trendingRes = await api.get(`/trending/movie/week?api_key=${API_KEY}`);
        } catch (error) {
          console.error('Error fetching trending movies:', error);
        }

        try {
          topRatedRes = await api.get(`/movie/top_rated?api_key=${API_KEY}`);
        } catch (error) {
          console.error('Error fetching top rated movies:', error);
        }

        try {
          upcomingRes = await api.get(`/movie/upcoming?api_key=${API_KEY}`);
        } catch (error) {
          console.error('Error fetching upcoming movies:', error);
        }

        setCategories({
          trending: trendingRes.data.results,
          topRated: topRatedRes.data.results,
          upcoming: upcomingRes.data.results,
        });
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      {!currentUser && (
        <section className="relative min-h-[600px] flex items-center justify-center text-center px-4">
          <div className="absolute inset-0">
            <img
              src="/login_background.png"
              alt="Background"
              className="object-cover brightness-50 w-full h-full"
            />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold">
              Unlimited movies, TV shows and more
            </h1>
            <p className="text-lg md:text-xl">Watch anywhere. Cancel anytime.</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Email address"
                className="bg-black/60 border-gray-600"
              />
              <Link
                to="/signup"
                className="text-white hover:text-gray-300 transition"
              >
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-8">
        {Object.entries(categories).map(([category, movies]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 capitalize">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={handleMovieClick}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}
