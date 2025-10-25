// leaguePage.jsx (Corrected)
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getLeagueStandings,
  getTopScorers,
  getTopAssisters,
} from "../api/footballApi";


export default function LeaguePage() {
  const { leagueId } = useParams();
  const [standings, setStandings] = useState([]);
  const [leagueInfo, setLeagueInfo] = useState(null); // NEW: State for league header data
  const [scorers, setScorers] = useState([]);
  const [assisters, setAssisters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagueData = async () => {
      const [tableData, scorersData, assistersData] = await Promise.all([
        getLeagueStandings(leagueId),
        getTopScorers(leagueId),
        getTopAssisters(leagueId),
      ]);
      
      // FIX: The backend now returns { standings: [...], leagueInfo: {...} }
      setStandings(tableData.standings || []);
      setLeagueInfo(tableData.leagueInfo || null); // FIX: Set league info separately
      setScorers(scorersData.slice(0, 10));
      setAssisters(assistersData.slice(0, 10));
      setLoading(false);
    };

    // store league id for use in TeamPage
    if (leagueId) localStorage.setItem("selectedLeagueId", leagueId);

    fetchLeagueData();
  }, [leagueId]);

  if (loading)
    return <p className="text-center text-gray-400 p-6 bg-neutral-900 min-h-screen">Loading league data...</p>;

  // FIX: leagueInfo is now retrieved directly from state
  // const leagueInfo = standings.length > 0 ? standings[0].league : null; // REMOVE THIS LINE

  return (
    <div className="p-4 sm:p-6 bg-neutral-900 min-h-screen text-white">
      {/* League Header */}
      {leagueInfo && ( // Use the new leagueInfo state
        <div className="flex flex-col items-center mb-10 bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-700">
          <img
            src={leagueInfo.logo}
            alt="League Logo"
            className="w-16 h-16 mb-3 object-contain"
          />
          <h1 className="text-3xl font-extrabold text-yellow-400">
            {leagueInfo.name}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{leagueInfo.country} ({leagueInfo.season})</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* League Table */}
        <div className="bg-neutral-800 rounded-xl shadow-lg p-4 sm:p-6 mb-10 border border-neutral-700">
          <h2 className="text-2xl font-semibold mb-4 border-b border-neutral-700 pb-2 text-yellow-400">
            League Table
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base border-separate border-spacing-y-1">
              <thead className="text-gray-400 uppercase text-xs sm:text-sm bg-neutral-700/50 rounded-lg">
                <tr>
                  <th className="text-left py-2 px-1 rounded-l-lg">#</th>
                  <th className="text-left py-2 px-2">Team</th>
                  <th className="text-center py-2 px-1 hidden sm:table-cell">P</th>
                  <th className="text-center py-2 px-1">W</th>
                  <th className="text-center py-2 px-1 hidden sm:table-cell">D</th>
                  <th className="text-center py-2 px-1 hidden sm:table-cell">L</th>
                  <th className="text-center py-2 px-1">GD</th>
                  <th className="text-center py-2 px-1 rounded-r-lg">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, i) => {
                  // Determine background color based on rank (simplified for example)
                  let rowClass = "bg-neutral-700 hover:bg-neutral-700/80 transition duration-150 ease-in-out";
                  let rankColor = 'text-gray-300';
                  
                  if (i === 0) {
                      rankColor = 'text-yellow-400 font-extrabold'; // 1st place
                  } else if (i < 4) {
                      rankColor = 'text-green-400 font-semibold'; // Champions League spots
                  } else if (i > standings.length - 4) {
                      rankColor = 'text-red-400 font-semibold'; // Relegation
                  }

                  return (
                    <tr
                      key={team.team.id}
                      className={`${rowClass} rounded-lg`}
                    >
                      <td className={`py-2 px-1 text-center font-bold ${rankColor} rounded-l-lg`}>{team.rank}</td>
                      <td className="flex items-center gap-2 py-2 px-2">
                        <img
                          src={team.team.logo}
                          alt={team.team.name}
                          className="w-5 h-5 object-contain"
                        />
                        <Link
                          to={`/team/${team.team.id}`}
                          className="hover:text-blue-400 transition font-medium"
                          onClick={() => localStorage.setItem("selectedLeagueId", leagueId)}
                        >
                          {team.team.name}
                        </Link>
                      </td>
                      <td className="text-center hidden sm:table-cell">{team.all.played}</td>
                      <td className="text-center">{team.all.win}</td>
                      <td className="text-center hidden sm:table-cell">{team.all.draw}</td>
                      <td className="text-center hidden sm:table-cell">{team.all.lose}</td>
                      <td className="text-center font-medium">{team.goalsDiff > 0 ? `+${team.goalsDiff}` : team.goalsDiff}</td>
                      <td className={`text-center font-extrabold py-2 px-1 text-lg rounded-r-lg ${rankColor}`}>
                        {team.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Scorers + Assisters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Top Scorers */}
          <StatTable
            title="Top Scorers"
            data={scorers}
            statKey="goals.total"
            statLabel="Goals"
            statColor="text-blue-400"
            linkClass="hover:text-blue-400"
            leagueId={leagueId}
          />

          {/* Top Assisters */}
          <StatTable
            title="Top Assisters"
            data={assisters}
            statKey="goals.assists"
            statLabel="Assists"
            statColor="text-purple-400"
            linkClass="hover:text-purple-400"
            leagueId={leagueId}
          />
        </div>
      </div>
    </div>
  );
}

// Helper component for Top Scorers/Assisters tables (No changes needed here)
function StatTable({ title, data, statKey, statLabel, statColor, linkClass, leagueId }) {
  const getValue = (player) => {
    // Safely extract the nested stat value
    const keys = statKey.split('.');
    let value = player.statistics[0];
    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        return 0; // Default to 0 if path is invalid/null
      }
    }
    return value;
  };

  return (
    <div className="bg-neutral-800 rounded-xl shadow-lg p-4 sm:p-6 border border-neutral-700">
      <h2 className="text-2xl font-semibold mb-4 border-b border-neutral-700 pb-2 text-yellow-400">
        {title}
      </h2>
      {data.length > 0 ? (
        <table className="w-full text-sm sm:text-base border-separate border-spacing-y-1">
          <thead className="text-gray-400 uppercase text-xs bg-neutral-700/50 rounded-lg">
            <tr>
              <th className="text-left py-2 px-1 rounded-l-lg">#</th>
              <th className="text-left py-2 px-2">Player</th>
              <th className="text-center py-2 px-2 hidden sm:table-cell">Team</th>
              <th className="text-center py-2 px-1 rounded-r-lg">{statLabel}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((player, i) => (
              <tr
                key={player.player.id}
                className="bg-neutral-700 hover:bg-neutral-700/80 transition rounded-lg"
              >
                <td className="py-2 px-1 text-center font-bold text-gray-300 rounded-l-lg">{i + 1}</td>
                <td className="py-2 px-2">
                  <Link
                    to={`/player/${player.player.id}`}
                    className={`flex items-center gap-2 ${linkClass} transition`}
                  >
                    <img
                      src={player.player.photo}
                      alt={player.player.name}
                      className="w-6 h-6 rounded-full object-cover border border-neutral-600"
                    />
                    <span className="font-medium">{player.player.name}</span>
                  </Link>
                </td>
                <td className="text-center hidden sm:table-cell">
                  <Link
                    to={`/team/${player.statistics[0].team.id}`}
                    className={`${linkClass} transition`}
                    onClick={() => localStorage.setItem("selectedLeagueId", leagueId)}
                  >
                    {player.statistics[0].team.name}
                  </Link>
                </td>
                <td className={`text-center font-extrabold text-lg ${statColor} rounded-r-lg`}>
                  {getValue(player)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400 py-4">No data available for this season.</p>
      )}
    </div>
  );
}