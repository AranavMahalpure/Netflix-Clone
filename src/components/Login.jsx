// src/components/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle errors here
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
          <h1 className="text-3xl font-bold text-white">Sign In</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
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
            Sign In
          </Button>
        </form>
        <div className="text-gray-400 text-center">
          <p>
            New to Netflix?{' '}
            <a onClick={() => {navigate('/signup')}} className="text-white hover:underline">
              Sign up now
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;