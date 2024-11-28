// src/components/Signup.jsx
import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      await updateProfile(user, { displayName: name });
      navigate('/');
    } catch (error) {
      let errorMessage = 'An error occurred during signup';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        default:
          console.error('Signup error:', error);
      }

      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: errorMessage,
        className: "bg-red-600 text-white border-0",
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black bg-opacity-75">
      <div className="absolute inset-0">
        <img
          src="./login_background.png"
          alt="Background"
          className="w-full h-full object-cover opacity-60"
        />
      </div>
      <div className="z-10 w-full max-w-md p-8 space-y-8 bg-black bg-opacity-75 rounded-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">Sign Up</h1>
        </div>
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="sr-only">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded"
          >
            Sign Up
          </Button>
        </form>
        <div className="text-gray-400 text-center">
          <p>
            Already have an account?{' '}
            <a onClick={() => {navigate('/login')}} className="text-white hover:underline">
              Sign in now
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;