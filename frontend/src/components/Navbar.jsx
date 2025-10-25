import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

export default function Navbar() {
  return (
    // UPDATED CSS: Deeper background, larger shadow, fixed position for consistency
    <nav className="sticky top-0 z-50 bg-neutral-900 text-white p-4 flex justify-between items-center shadow-2xl border-b border-neutral-700">
      
      {/* Logo/Title - Linked to Home */}
      <Link to="/" className="flex items-center space-x-2 cursor-pointer transition duration-200 hover:opacity-80">
        {/* Placeholder for a simple logo icon (e.g., a football) */}
        <span className="text-3xl" role="img" aria-label="football">⚽</span>
        {/* UPDATED CSS: Highlighted title text */}
        <h1 className="text-3xl font-extrabold text-yellow-400 tracking-wider">
          Two-Football
        </h1>
      </Link>

      {/* Navigation Links */}
      <ul className="flex space-x-6">
        {/* Home Link - Linked to Home */}
        <li>
          <Link 
            to="/" 
            className="text-lg font-semibold hover:text-yellow-400 transition border-b-2 border-transparent hover:border-yellow-400 py-1"
          >
            Home
          </Link>
        </li>
        
        {/* Other Links (using placeholders since the actual routes weren't provided) */}
        <li>
          {/* Assuming you'll add proper routes later, using '#' as a temporary link */}
          <a 
            href="/leagues" 
            className="text-lg font-semibold hover:text-yellow-400 transition border-b-2 border-transparent hover:border-yellow-400 py-1"
          >
            Leagues
          </a>
        </li>
        <li>
          <a 
            href="/players" 
            className="text-lg font-semibold hover:text-yellow-400 transition border-b-2 border-transparent hover:border-yellow-400 py-1"
          >
            Players
          </a>
        </li>
        <li>
          <a 
            href="/news" 
            className="text-lg font-semibold hover:text-yellow-400 transition border-b-2 border-transparent hover:border-yellow-400 py-1"
          >
            News
          </a>
        </li>
      </ul>
    </nav>
  );
}