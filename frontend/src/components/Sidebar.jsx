import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const leagues = [
    { id: 39, name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png" },
    { id: 140, name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png" },
    { id: 135, name: "Serie A", logo: "https://media.api-sports.io/football/leagues/135.png" },
    { id: 78, name: "Bundesliga", logo: "https://media.api-sports.io/football/leagues/78.png" },
    { id: 61, name: "Ligue 1", logo: "https://media.api-sports.io/football/leagues/61.png" },
    { id: 2, name: "UEFA Champions League", logo: "https://media.api-sports.io/football/leagues/2.png" },
  ];

  return (

    <aside className="w-72 bg-neutral-800 text-white p-6 rounded-2xl shadow-xl border border-neutral-700">
 
      <h2 className="text-xl font-bold mb-4 border-b border-gold-500 pb-3 text-gold-400">
        Top Leagues
      </h2>
      <ul className="space-y-2">
        {leagues.map((league) => (
          <Link
            key={league.id}
            to={`/league/${league.id}`}
            
            className="flex items-center gap-4 hover:bg-neutral-700 p-3 rounded-lg cursor-pointer transition duration-200 group"
          >
            <img src={league.logo} alt={league.name} className="w-7 h-7 object-contain" />
            <span className="font-medium group-hover:text-gray-100 text-gray-300 transition">
                {league.name}
            </span>
          </Link>
        ))}
      </ul>
    </aside>
  );
}