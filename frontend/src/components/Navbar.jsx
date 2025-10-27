import React from "react";
import { Link } from "react-router-dom"; 

export default function Navbar() {
  return (
   
    <nav className="sticky top-0 z-50 bg-neutral-900 text-white p-4 flex justify-between items-center shadow-2xl border-b border-neutral-700">
     
      <Link to="/" className="flex items-center space-x-2 cursor-pointer transition duration-200 hover:opacity-80">
       
        <span className="text-3xl" role="img" aria-label="football">⚽</span>
        
        <h1 className="text-3xl font-extrabold text-yellow-400 tracking-wider">
          Two-Football
        </h1>
      </Link>

     
      <ul className="flex space-x-6">
        <li>
          <Link 
            to="/" 
            className="text-lg font-semibold hover:text-yellow-400 transition border-b-2 border-transparent hover:border-yellow-400 py-1"
          >
            Home
          </Link>
        </li>
        
       
        <li>
          <Link 
            to="/news" 
            className="text-lg font-semibold hover:text-yellow-400 transition border-b-2 border-transparent hover:border-yellow-400 py-1"
          >
            News
          </Link>
        </li>
      </ul>
    </nav>
  );
}