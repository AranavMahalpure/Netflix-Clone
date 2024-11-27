// src/components/Collections.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { MovieCard } from './movie-card';

export default function Collections() {
  const { currentUser } = useContext(AuthContext);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const userDoc = doc(db, 'users', currentUser.uid);
      const unsubscribe = onSnapshot(userDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setCollections(docSnapshot.data().collections || []);
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <p>Please log in to view your collections.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Collection</h2>
      {collections.length === 0 ? (
        <p>You have no movies in your collection.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {collections.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}