import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPlayerDetails, getPlayerTransfers, getPlayerTrophies } from "../api/footballApi";


import { getPlayerNewsByName, getTeamNewsByName } from "../api/newsApi";
import NewsDisplay from "../components/NewsDisplay";

export default function PlayerPage() {
  const { id } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [trophies, setTrophies] = useState([]);
  const [loading, setLoading] = useState(true);
  const CURRENT_SEASON = 2023; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [details, playerTransfers, playerTrophies] = await Promise.all([
          getPlayerDetails(id, CURRENT_SEASON),
          getPlayerTransfers(id),
          getPlayerTrophies(id),
        ]);

        setPlayerData(details);
        setTransfers(playerTransfers);
        
        setTrophies(playerTrophies || []); 
      } catch (error) {
        console.error("Error fetching player data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center p-6 text-white">Loading player...</p>;
  if (!playerData || !playerData.player) return <p className="text-center p-6 text-white">Player not found</p>;

  const { player, statistics } = playerData;
  const seasonStats = statistics[0]; 

  
  const clubHistory = new Map();


  if (seasonStats) {
      clubHistory.set(seasonStats.team.id, {
          id: seasonStats.team.id,
          name: seasonStats.team.name,
          logo: seasonStats.team.logo,
          years: [seasonStats.league.season],
      });
  }


  transfers.forEach((transfer) => {
    const year = new Date(transfer.date).getFullYear();

    if (transfer.teams.out.id && !clubHistory.has(transfer.teams.out.id)) {
        clubHistory.set(transfer.teams.out.id, {
            id: transfer.teams.out.id,
            name: transfer.teams.out.name,
            logo: transfer.teams.out.logo,
            years: [],
        });
    }
    if (transfer.teams.out.id) {
        const club = clubHistory.get(transfer.teams.out.id);
        if (club && !club.years.includes(year)) club.years.push(year);
    }
    
   
    if (transfer.teams.in.id && !clubHistory.has(transfer.teams.in.id)) {
        clubHistory.set(transfer.teams.in.id, {
            id: transfer.teams.in.id,
            name: transfer.teams.in.name,
            logo: transfer.teams.in.logo,
            years: [],
        });
    }
    if (transfer.teams.in.id) {
        const club = clubHistory.get(transfer.teams.in.id);
        if (club && !club.years.includes(year)) club.years.push(year);
    }
  });

  
  const careerClubs = Array.from(clubHistory.values()).map(club => {
    club.years.sort((a, b) => a - b);
    const minYear = club.years[0];
    const maxYear = club.years[club.years.length - 1] || minYear;
    
    return {
        ...club,
        range: minYear === maxYear ? `${minYear}` : `${minYear}–${maxYear}`,
    };
  }).sort((a, b) => {
   
    const yearA = a.years[0] || Infinity;
    const yearB = b.years[0] || Infinity;
    return yearA - yearB;
  });

  
  const rating =
    seasonStats?.games?.rating && !isNaN(seasonStats.games.rating)
      ? parseFloat(seasonStats.games.rating).toFixed(2)
      : "-";


  const aggregatedTrophies = Object.values(
    trophies.reduce((acc, trophy) => {
    
      const key = `${trophy.league}_${trophy.country}`; 
      if (!acc[key]) {
        acc[key] = { 
            name: trophy.league, 
            country: trophy.country,
            count: 0 
        };
      }
      acc[key].count += 1;
      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 sm:p-6 md:p-8">
  
      <div className="flex flex-col bg-neutral-800 items-center mb-8 p-6 rounded-xl shadow-lg border border-neutral-700">
        <img
          src={player.photo}
          alt={player.name}
          className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-4 border-4 border-yellow-500 object-cover"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold mb-1 text-yellow-400">{player.name}</h1>
        <p className="text-gray-400 text-sm italic">{player.firstname} {player.lastname}</p>
        <div className="flex flex-wrap justify-center gap-4 text-gray-300 mt-4 text-sm md:text-base">
          <DetailStat label="Age" value={player.age} />
          <DetailStat label="Height" value={player.height || '-'} unit="cm" />
          <DetailStat label="Weight" value={player.weight || '-'} unit="kg" />
          <DetailStat label="Position" value={seasonStats?.games?.position || 'N/A'} />
          <DetailStat label="Nationality" value={player.nationality} />
        </div>
      </div>

     
      {seasonStats && (
        <div className="bg-neutral-800 p-5 rounded-xl shadow-md mb-8 border border-neutral-700">
          <h2 className="text-xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-yellow-400">
            Current Team
          </h2>
          <Link to={`/team/${seasonStats.team.id}`} className="flex items-center gap-4 hover:bg-neutral-700 p-2 rounded-lg transition-colors duration-150">
            <img
              src={seasonStats.team.logo}
              alt={seasonStats.team.name}
              className="w-10 h-10 object-contain"
            />
            <p className="text-lg font-bold flex-1">{seasonStats.team.name}</p>
            <p className="text-sm text-gray-400">
              {seasonStats.league.name} ({seasonStats.league.season})
            </p>
          </Link>
        </div>
      )}

     
      {seasonStats && (
        <div className="bg-neutral-800 p-5 rounded-xl shadow-md mb-8 border border-neutral-700">
          <h2 className="text-xl font-semibold mb-4 border-b border-neutral-700 pb-2 text-yellow-400">
            Season Stats ({CURRENT_SEASON})
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
            <Stat label="Apps" value={seasonStats.games.appearences} />
            <Stat label="Mins" value={seasonStats.games.minutes} />
            <Stat label="Goals" value={seasonStats.goals.total} />
            <Stat label="Assists" value={seasonStats.goals.assists || 0} />
            <Stat label="Shots/OT" value={`${seasonStats.shots.total || 0}/${seasonStats.shots.on || 0}`} />
            <Stat label="Rating" value={rating} />
            <Stat label="YC" value={seasonStats.cards.yellow} />
            <Stat label="RC" value={seasonStats.cards.red} />
          </div>
        </div>
      )}


      <div className="bg-neutral-800 p-5 rounded-xl shadow-md mb-8 border border-neutral-700">
        <h2 className="text-xl font-semibold mb-4 border-b border-neutral-700 pb-2 text-yellow-400">
          Career Overview
        </h2>
        <ul className="space-y-4">
          
          <li key="national-team-career" className="flex items-center gap-3 text-sm p-2 bg-neutral-700/50 rounded-lg border-l-4 border-blue-500">
              <span className="w-6 h-6 flex items-center justify-center text-xl">
                  ⚽
              </span>
              <span className="font-medium flex-1 text-blue-300">{player.nationality} National Team</span>
              <span className="text-gray-400 text-xs">International</span>
          </li>
          
         
          {careerClubs.map((club) => (
            <Link to={`/team/${club.id}`} key={club.id} className="flex items-center gap-3 text-sm p-2 hover:bg-neutral-700 rounded-lg transition-colors duration-150 border-l-4 border-transparent">
              <img src={club.logo} alt={club.name} className="w-6 h-6 object-contain" />
              <span className="font-medium flex-1">{club.name}</span>
              <span className="text-gray-400 text-xs">{club.range}</span>
            </Link>
          ))}
        </ul>
      </div>

      {/* Transfers */}
      <div className="bg-neutral-800 p-5 rounded-xl shadow-md mb-8 border border-neutral-700">
        <h2 className="text-xl font-semibold mb-4 border-b border-neutral-700 pb-2 text-yellow-400">
          Transfers History
        </h2>
        {transfers.length > 0 ? (
          <ul className="space-y-3">
            {transfers.slice(0, 5).map((transfer, idx) => ( 
              <li key={transfer.date + transfer.teams.in.id + idx} className="flex items-center justify-between text-sm p-1 border-b border-neutral-700 last:border-b-0">
                <span className="font-medium text-gray-300 w-1/4">
                  {new Date(transfer.date).toLocaleDateString()}
                </span>
                <div className="flex items-center justify-end w-3/4">
                    <Link to={`/team/${transfer.teams.out.id}`} className="flex items-center gap-2 hover:text-red-400">
                      <span className="text-xs text-gray-400">{transfer.teams.out.name}</span>
                      <img src={transfer.teams.out.logo} alt="Out" className="w-5 h-5 opacity-70" />
                    </Link>
                    <span className="mx-3 text-sm text-yellow-500 font-bold">→</span>
                    <Link to={`/team/${transfer.teams.in.id}`} className="flex items-center gap-2 hover:text-green-400">
                      <img src={transfer.teams.in.logo} alt="In" className="w-5 h-5" />
                      <span className="text-xs font-semibold">{transfer.teams.in.name}</span>
                    </Link>
                </div>
                <span className="text-gray-400 font-mono text-xs ml-4 w-1/4 text-right hidden sm:block">{transfer.type || 'Free'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No recent transfer history found.</p>
        )}
      </div>
      
      {/* Trophies */}
      <div className="bg-neutral-800 p-5 rounded-xl shadow-md border border-neutral-700">
        <h2 className="text-xl font-semibold mb-4 border-b border-neutral-700 pb-2 text-yellow-400">
          Trophies
        </h2>
        {aggregatedTrophies.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aggregatedTrophies.map((trophy, idx) => (
          
              <li key={`${trophy.name}-${trophy.country}`} className="flex items-center text-sm p-3 bg-neutral-700 rounded-lg">
                <span className="font-bold text-lg text-yellow-500 mr-3">🏆</span>
                <span className="flex-1">{trophy.name} ({trophy.country})</span>
                <span className="font-extrabold text-lg text-yellow-400">{trophy.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No major trophies recorded.</p>
        )}
      </div>
      
    
      <div className="mt-8 space-y-8">
        <NewsDisplay
          title={`${player.name} News`}
          fetchFunction={getPlayerNewsByName}
          fetchParam={player.name}
        />
        
        {seasonStats && (
            <NewsDisplay
              title={`${seasonStats.team.name} Club News`}
              fetchFunction={getTeamNewsByName}
              fetchParam={seasonStats.team.name}
            />
        )}
      </div>
    </div>
  );
}


function Stat({ label, value }) {
  return (
    <div className="bg-neutral-700 rounded-lg p-3 border border-neutral-600">
      <p className="text-lg font-extrabold text-yellow-400">{value ?? "-"}</p>
      <p className="text-gray-400 text-xs uppercase">{label}</p>
    </div>
  );
}

function DetailStat({ label, value, unit = '' }) {
    return (
        <span className="flex flex-col items-center p-2 rounded-lg bg-neutral-700/50">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="font-semibold">{value}{unit}</span>
        </span>
    )
}