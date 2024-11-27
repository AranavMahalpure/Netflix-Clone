// src/components/Layout/Footer.jsx
import { Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
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
  );
}