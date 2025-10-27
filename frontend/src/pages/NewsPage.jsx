import React from "react";
import NewsDisplay from "../components/NewsDisplay";
import {getLeagueNewsById} from "../api/newsApi"


const TOP_LEAGUES = [
    { id: 39, name: "Premier League" },   
    { id: 140, name: "La Liga" },          
    { id: 78, name: "Bundesliga" },       
    { id: 61, name: "Ligue 1" },          
    { id: 135, name: "Serie A" },         
];

export default function NewsPage() {
    return (
        <div className="max-w-6xl mx-auto p-6 text-white bg-neutral-900 min-h-screen space-y-12">
            <h1 className="text-4xl font-extrabold text-center text-yellow-400 border-b border-neutral-700 pb-4">
                Global Football News 🌍
            </h1>

            <p className="text-center text-gray-400">
                Latest stories from the top European leagues.
            </p>

            <div className="space-y-16">
                {TOP_LEAGUES.map((league) => (
                    <NewsDisplay
                        key={league.id}
                        title={`${league.name} News`}
                        fetchFunction={getLeagueNewsById} 
                        fetchParam={league.id}
                    />
                ))}
            </div>
        </div>
    );
}