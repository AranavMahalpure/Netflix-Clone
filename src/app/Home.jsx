import { useContext, useEffect, useState } from "react";
import { ChevronRight, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MovieCard } from "@/components/movie-card";
import { MovieModal } from "@/components/movie-modal";

import { auth } from "@/firebase"; // Import the auth object
import { onAuthStateChanged, signOut  } from "firebase/auth";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState({
    trending: [],
    topRated: [],
    upcoming: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is logged in
        setUser(currentUser);
      } else {
        // User is logged out
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingRes, topRatedRes, upcomingRes] = await Promise.all([
          axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`),
        ]);

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
    <div className="min-h-screen bg-black text-white">
      <header className="px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img
            src="/placeholder.svg"
            alt="Netflix"
            width={120}
            height={34}
            className="w-28"
          />
        </a>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-white gap-2">
            <Globe className="w-4 h-4" />
            English
          </Button>
          {user ? (
            <Button
              variant="secondary"
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => signOut(auth)}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {navigate("/login")}}
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      <main>
      {user  ?  (<></>) : (
        <section className="relative min-h-[600px] flex items-center justify-center text-center px-4">
          <div className="absolute inset-0">
            <img
              src="/placeholder.svg?height=600&width=1200"
              alt="Background"
              className="object-cover brightness-50 w-full h-full"
            />
          </div>
          <div className="relative max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold">
              Unlimited movies, TV shows and more
            </h1>
            <p className="text-lg md:text-xl">Starts at ₹149. Cancel at any time.</p>
            <p className="text-lg">
              Ready to watch? Enter your email to create or restart your membership.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Email address"
                className="bg-black/60 border-gray-600"
              />
              <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                Get Started
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

      ) }

        <section className="px-4 py-8">
          {Object.keys(categories).map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 capitalize">
                {category === 'topRated' ? 'Top Rated' : category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories[category].map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="px-4 py-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="cancel">
              <AccordionTrigger className="bg-zinc-800 px-4 py-4 rounded-md hover:bg-zinc-700">
                How do I cancel?
              </AccordionTrigger>
              <AccordionContent className="bg-zinc-800 mt-px px-4 py-4">
                Netflix is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="watch">
              <AccordionTrigger className="bg-zinc-800 px-4 py-4 rounded-md hover:bg-zinc-700">
                What can I watch on Netflix?
              </AccordionTrigger>
              <AccordionContent className="bg-zinc-800 mt-px px-4 py-4">
                Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="kids">
              <AccordionTrigger className="bg-zinc-800 px-4 py-4 rounded-md hover:bg-zinc-700">
                Is Netflix good for kids?
              </AccordionTrigger>
              <AccordionContent className="bg-zinc-800 mt-px px-4 py-4">
                The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and films in their own space.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
