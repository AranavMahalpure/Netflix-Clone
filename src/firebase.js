// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBecO2BIY20MfD-z2GkZiiSmVMsqHap-NE",
  authDomain: "netflix-clone-8b74d.firebaseapp.com",
  projectId: "netflix-clone-8b74d",
  storageBucket: "netflix-clone-8b74d.firebasestorage.app",
  messagingSenderId: "274003168857",
  appId: "1:274003168857:web:6553832afa23a0cb3e6b48",
  measurementId: "G-JXKKMZZKZ3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Adds a movie ID to the user's collection in Firestore.
 * @param {string} userId - The ID of the current user.
 * @param {number} movieId - The ID of the movie to add.
 */
export const addToCollection = async (userId, movieId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        collections: arrayUnion(movieId),
      },
      { merge: true }
    );
    console.log(`Successfully added movie ID ${movieId} to user ${userId}'s collection.`);
  } catch (error) {
    console.error('Error adding movie to collection:', error);
    throw error;
  }
};

export const removeFromCollection = async (userId, movieId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      { collections: arrayRemove(movieId) },
      { merge: true }
    );
    console.log(`Successfully removed movie ID ${movieId} from user ${userId}'s collection.`);
  } catch (error) {
    console.error('Error removing movie from collection:', error);
    throw error;
  }
};