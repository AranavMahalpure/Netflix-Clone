// src/components/Layout/Header.jsx
import { useContext } from "react";
import { Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "@/context/AuthContext";

export function Header() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Netflix"
            width={120}
            height={34}
            className="w-28"
          />
        </Link>
        {currentUser && (
          <Link 
            to="/collections" 
            className="text-white hover:text-gray-300 transition"
          >
            Your Collections
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="text-white gap-2">
          <Globe className="w-4 h-4" />
          English
        </Button>
        {currentUser ? (
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
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}