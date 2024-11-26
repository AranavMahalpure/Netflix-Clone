import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export function MovieModal({ movie, isOpen, onClose }) {
  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <div 
          className="relative min-h-[80vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40">
            <DialogHeader className="p-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-white hover:text-white/80"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </Button>
            </DialogHeader>
            <div className="p-6 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-600 flex items-center justify-center text-xs font-bold">N</div>
                    <span className="text-sm font-medium">FILM</span>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
                    Watch Now
                  </Button>
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

