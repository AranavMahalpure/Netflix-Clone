// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAU2csl-yj--uAZvY2Il4pH2TbO-EUpyTY",
  authDomain: "netflix-clone-project-fed97.firebaseapp.com",
  projectId: "netflix-clone-project-fed97",
  storageBucket: "netflix-clone-project-fed97.firebasestorage.app",
  messagingSenderId: "979719255465",
  appId: "1:979719255465:web:826e5718ca141e2ab800b8"
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