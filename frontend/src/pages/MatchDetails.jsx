import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMatchDetails } from "../api/footballApi";

// Helper function to generate player photo URL
const getPlayerPhotoUrl = (playerId) => {
    return `https://media.api-sports.io/football/players/${playerId}.png`;
};

// Component to render a single player in the list
const PlayerListItem = ({ player, isHomeTeam }) => {
    const linkColor = isHomeTeam ? 'text-blue-400 hover:text-blue-300' : 'text-red-400 hover:text-red-300';
    const numberBg = isHomeTeam ? 'bg-blue-600' : 'bg-red-600';

    return (
        <li className="flex items-center space-x-3 p-2 border-b border-neutral-700 last:border-b-0">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${numberBg}`}>
                {player.number}
            </div>
            <img 
                src={getPlayerPhotoUrl(player.id)} 
                alt={player.name} 
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/32'; }} // Placeholder fallback
            />
            <Link to={`/player/${player.id}`} className={`flex-1 font-medium ${linkColor}`}>
                {player.name}
            </Link>
            <span className="text-xs text-gray-400">{player.pos}</span>
        </li>
    );
};

// Component to render the full list of lineups (Starting XI)
const LineupList = ({ lineups, homeId, awayId }) => {
    if (!lineups || lineups.length < 2) return null;

    const homeLineup = lineups.find(l => l.team.id === homeId);
    const awayLineup = lineups.find(l => l.team.id === awayId);

    const homePlayers = homeLineup?.startXI.map(p => p.player) || [];
    const awayPlayers = awayLineup?.startXI.map(p => p.player) || [];
    
    // Sort by position/number for better readability (optional, but helpful)
    homePlayers.sort((a, b) => (a.number || 99) - (b.number || 99));
    awayPlayers.sort((a, b) => (a.number || 99) - (b.number || 99));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Home Team Starting XI */}
            <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-300 border-b border-neutral-700 pb-2">
                    {homeLineup?.team.name} ({homeLineup?.formation})
                </h3>
                <ul className="divide-y divide-neutral-700 bg-neutral-900 rounded-lg shadow-inner">
                    {homePlayers.map(player => (
                        <PlayerListItem key={player.id} player={player} isHomeTeam={true} />
                    ))}
                </ul>
            </div>

            {/* Away Team Starting XI */}
            <div>
                <h3 className="text-xl font-semibold mb-3 text-red-300 border-b border-neutral-700 pb-2">
                    {awayLineup?.team.name} ({awayLineup?.formation})
                </h3>
                <ul className="divide-y divide-neutral-700 bg-neutral-900 rounded-lg shadow-inner">
                    {awayPlayers.map(player => (
                        <PlayerListItem key={player.id} player={player} isHomeTeam={false} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

// --- Main Component: MatchDetails ---

export default function MatchDetails() {
  const { fixtureId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getMatchDetails(fixtureId);
        setMatch(data);
      } catch (err) {
        console.error("Failed to fetch match details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [fixtureId]);

  if (loading) return <p className="text-center text-gray-400 mt-8">Loading match details...</p>;
  if (!match || !match.fixture) return <p className="text-center text-gray-400 mt-8">No match data found</p>;

  const { fixture, statistics, lineups, events } = match;
  const home = fixture.teams.home;
  const away = fixture.teams.away;
  const score = fixture.goals;

  const liveStatus = fixture.fixture.status.short;
  const liveTime =
    liveStatus === "1H" || liveStatus === "2H" || liveStatus === "ET"
      ? `${fixture.fixture.status.elapsed}'`
      : fixture.fixture.status.long;

  const goals = events.filter((e) => e.type === "Goal");
  const homeCoach = lineups.find(l => l.team.id === home.id)?.coach;
  const awayCoach = lineups.find(l => l.team.id === away.id)?.coach;
  
  const homeSubs = lineups.find(l => l.team.id === home.id)?.substitutes || [];
  const awaySubs = lineups.find(l => l.team.id === away.id)?.substitutes || [];


  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 sm:p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* 1. Top Section - Match Info & Score */}
      <div className="text-center bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-700">
        <p className="text-gray-400 text-sm mb-3 font-medium">
          {fixture.league.name} • {new Date(fixture.fixture.date).toLocaleDateString()}
        </p>

        <div className="flex justify-around items-center gap-4 sm:gap-10">
          {/* Home Team */}
          <div className="flex flex-col items-center flex-1">
            <Link to={`/team/${home.id}`} className="hover:text-yellow-400 transition">
                <img src={home.logo} alt={home.name} className="w-16 h-16 sm:w-20 sm:h-20 mb-2 object-contain" />
            </Link>
            <Link to={`/team/${home.id}`} className="text-sm sm:text-lg font-semibold hover:text-yellow-400 truncate w-full">
              {home.name}
            </Link>
          </div>

          {/* Score & Status */}
          <div className="flex flex-col items-center mx-4">
            <p className="text-5xl sm:text-6xl font-extrabold text-yellow-400">
              {score.home} - {score.away}
            </p>
            <p
              className={`text-sm sm:text-base mt-2 font-medium px-3 py-1 rounded-full 
                ${liveStatus === "FT" ? "bg-gray-700 text-white" : 
                  (liveStatus === "1H" || liveStatus === "2H" ? "bg-green-600 text-white animate-pulse" : "bg-gray-700 text-gray-300")
              }`}
            >
              {liveTime}
            </p>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center flex-1">
            <Link to={`/team/${away.id}`} className="hover:text-yellow-400 transition">
                <img src={away.logo} alt={away.name} className="w-16 h-16 sm:w-20 sm:h-20 mb-2 object-contain" />
            </Link>
            <Link to={`/team/${away.id}`} className="text-sm sm:text-lg font-semibold hover:text-yellow-400 truncate w-full">
              {away.name}
            </Link>
          </div>
        </div>
      </div>
      
      {/* -------------------------------------------------------------------------------------- */}

      {/* 2. Lineups (Starting XI & Substitutes) */}
      {lineups && lineups.length > 0 && (
        <div className="bg-neutral-800 rounded-xl shadow-lg p-4 sm:p-6 border border-neutral-700">
            <h2 className="text-2xl font-semibold mb-6 text-yellow-400 text-center">
                Team Lineups
            </h2>

            {/* Starting XI */}
            <LineupList lineups={lineups} homeId={home.id} awayId={away.id} />
            
            {/* Coaches */}
            <div className="flex justify-between text-xs sm:text-sm pt-4 border-t border-neutral-700 mt-8">
              <p className="text-gray-300">Coach: <span className="font-semibold text-blue-300">{homeCoach?.name || 'N/A'}</span></p>
              <p className="text-gray-300">Coach: <span className="font-semibold text-red-300">{awayCoach?.name || 'N/A'}</span></p>
            </div>
            
            {/* Substitutes */}
            <h3 className="text-xl font-semibold mt-6 mb-3 border-b border-neutral-700 pb-1 text-gray-300">Substitutes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-1">
                    <p className="font-bold text-lg text-blue-300 mb-2">{home.name}</p>
                    {homeSubs.map(p => (
                        <li key={p.player.id} className="text-sm flex items-center space-x-2">
                             <span className="w-5 text-center font-bold text-gray-500">{p.player.number}.</span>
                            <Link to={`/player/${p.player.id}`} className="hover:text-blue-400 transition">
                                {p.player.name}
                            </Link>
                             <span className="text-xs text-gray-400 ml-auto">({p.player.pos})</span>
                        </li>
                    ))}
                </ul>
                <ul className="space-y-1">
                    <p className="font-bold text-lg text-red-300 mb-2">{away.name}</p>
                    {awaySubs.map(p => (
                        <li key={p.player.id} className="text-sm flex items-center space-x-2">
                            <span className="w-5 text-center font-bold text-gray-500">{p.player.number}.</span>
                            <Link to={`/player/${p.player.id}`} className="hover:text-red-400 transition">
                                {p.player.name}
                            </Link>
                             <span className="text-xs text-gray-400 ml-auto">({p.player.pos})</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------------- */}
      
      {/* 3. Match Events (Goals and Cards) */}
      {(goals.length > 0 || events.filter(e => e.type === "Card").length > 0) && (
        <div className="bg-neutral-800 rounded-xl shadow-lg p-4 sm:p-6 border border-neutral-700">
            <h2 className="text-2xl font-semibold mb-4 border-b border-neutral-700 pb-2 text-yellow-400 text-center">
                Match Events
            </h2>
            <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                {events.filter(e => e.type === "Goal" || e.type === "Card" || e.type === "Subst").sort((a, b) => a.time.elapsed - b.time.elapsed)
                    .map((event, i) => (
                    <div
                        key={i}
                        className={`flex items-center text-sm p-2 rounded-lg 
                        ${event.team.id === home.id ? "justify-start flex-row-reverse" : "justify-end flex-row"}`}
                    >
                        {/* Event Details */}
                        <div className="flex-1 max-w-[45%]">
                            <Link to={`/player/${event.player?.id || event.assist?.id}`} className="font-medium hover:text-yellow-400 transition flex items-center gap-1">
                                {event.player?.name || event.assist?.name}
                                {/* Substitution details */}
                                {event.type === 'Subst' && event.detail === 'Player Out' && event.assist?.name && (
                                    <span className="text-xs text-red-400 font-semibold">(OUT)</span>
                                )}
                                {event.type === 'Subst' && event.detail === 'Player In' && event.assist?.name && (
                                    <span className="text-xs text-green-400 font-semibold">(IN)</span>
                                )}
                                {/* Goal details */}
                                {event.type === 'Goal' && (
                                    <span className="text-xs text-gray-400">
                                        {event.assist?.name && ` (Assist: ${event.assist.name.split(' ')[0]})`}
                                    </span>
                                )}
                            </Link>
                        </div>
                        
                        {/* Time and Icon */}
                        <div className="flex flex-col items-center mx-4">
                            <span className="text-lg font-bold">
                                {event.type === 'Goal' ? '⚽' : (event.detail === 'Yellow Card' ? '🟨' : (event.detail === 'Red Card' ? '🟥' : (event.type === 'Subst' ? '🔄' : '')))}
                            </span>
                            <span className="text-xs text-gray-400">{event.time.elapsed}'</span>
                        </div>
                        
                        {/* Spacer for alignment */}
                        <div className="flex-1 max-w-[45%]"></div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------------- */}

      {/* 4. Statistics */}
      {statistics && statistics.length > 0 && (
        <div className="bg-neutral-800 rounded-xl shadow-lg p-4 sm:p-6 border border-neutral-700 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 border-b border-neutral-700 pb-2 text-yellow-400 text-center">
            Match Stats
          </h2>
          <div className="space-y-4">
            {statistics[0].statistics.map((stat, i) => {
              const homeVal = stat.value === null || stat.value === 'null' ? 0 : stat.value;
              const awayVal = statistics[1]?.statistics[i]?.value === null || statistics[1]?.statistics[i]?.value === 'null' ? 0 : statistics[1]?.statistics[i]?.value;
              
              const numHomeVal = typeof homeVal === 'string' ? parseFloat(homeVal.replace('%', '')) : homeVal;
              const numAwayVal = typeof awayVal === 'string' ? parseFloat(awayVal.replace('%', '')) : awayVal;
              
              const total = numHomeVal + numAwayVal;
              
              const homePercent =
                total > 0
                  ? (numHomeVal / total) * 100
                  : 50;

              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1 font-medium">
                    <span className="text-blue-300">{homeVal}</span>
                    <span className="text-gray-400 font-normal uppercase text-xs">{stat.type}</span>
                    <span className="text-red-300">{awayVal}</span>
                  </div>
                  <div className="flex h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 transition-all duration-500"
                      style={{ width: `${homePercent}%` }}
                    ></div>
                    <div
                      className="bg-red-500 transition-all duration-500"
                      style={{ width: `${100 - homePercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}