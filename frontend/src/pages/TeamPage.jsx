import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getTeamInfo,
  getTeamSquad,
  getTeamStatistics,
  getTeamCoach,
  
} from "../api/footballApi";


import { getTeamNewsByName, getLeagueNewsById } from "../api/newsApi";

import NewsDisplay from "../components/NewsDisplay"; 



const FLAG_MAP = {
    England: "gb", France: "fr", Spain: "es", Germany: "de", Italy: "it", Brazil: "br", Argentina: "ar", Portugal: "pt", Netherlands: "nl", Belgium: "be", Croatia: "hr", Uruguay: "uy", Denmark: "dk", Sweden: "se", Norway: "no", Finland: "fi", Switzerland: "ch", Austria: "at", Poland: "pl", Turkey: "tr", Morocco: "ma", USA: "us", Canada: "ca", Japan: "jp", "South Korea": "kr", Australia: "au", Mexico: "mx", Nigeria: "ng", Egypt: "eg", Cameroon: "cm", Scotland: "gb-sct", Wales: "gb-wls"
};



export default function TeamPage() {
  const { id } = useParams();
  const [teamInfo, setTeamInfo] = useState(null);
  const [squad, setSquad] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortPosition, setSortPosition] = useState("All");

  const leagueId = localStorage.getItem("selectedLeagueId") || 39;
  

  const LEAGUE_DISPLAY_NAMES = {
    39: "Premier League", 140: "La Liga", 78: "Bundesliga", 61: "Ligue 1", 135: "Serie A", 2: "Champions League",
  };
  const leagueName = LEAGUE_DISPLAY_NAMES[leagueId] || "League";


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
      
        const results = await Promise.allSettled([
          getTeamInfo(id),
          getTeamSquad(id),
          getTeamStatistics(leagueId, id),
          getTeamCoach(id),
          
        ]);

        const getFulfilledData = (result) => 
            result.status === 'fulfilled' ? result.value : null;

       
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                const apiName = ['TeamInfo', 'Squad', 'Stats', 'Coach', 'Transfers', 'Fixtures'][index];
                console.error(`API Call for ${apiName} failed:`, result.reason);
            }
        });

        setTeamInfo(getFulfilledData(results[0]));
        setSquad(getFulfilledData(results[1]) || []);
        setStatistics(getFulfilledData(results[2]));
        setCoach(getFulfilledData(results[3]));
        

      } catch (err) {
        
        console.error("Error fetching team data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, leagueId]);

  if (loading)
    return <p className="text-gray-400 text-center mt-10">Loading team data...</p>;

  if (!teamInfo)
    return <p className="text-gray-400 text-center mt-10">No team data found. Check Team ID or API key configuration.</p>;

  
  const filteredSquad =
    sortPosition === "All"
      ? squad
      : squad.filter((p) => p.position === sortPosition);

  const positions = ["All", ...new Set(squad.map((p) => p.position))];

  return (
    <div className="max-w-6xl mx-auto p-6 text-white bg-neutral-900 min-h-screen">
        
      
      <div className="flex items-center gap-6 mb-8 bg-neutral-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <img
          src={teamInfo.team?.logo}
          alt={teamInfo.team?.name}
          className="w-24 h-24 object-contain"
        />
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">{teamInfo.team?.name}</h1>
          <p className="text-gray-400">{teamInfo.team?.country}</p>
          <p className="text-gray-400">
            Founded: {teamInfo.team?.founded || "N/A"}
          </p>
          <p className="text-gray-400">
            Home Stadium: {teamInfo.venue?.name} ({teamInfo.venue?.city})
          </p>
        </div>
      </div>
    
      {coach && (
        <div className="bg-neutral-900 rounded-xl p-6 shadow-md mb-10 border border-gray-700">
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4 text-yellow-400">
            Coach
          </h2>
          <div className="flex items-center gap-4">
            <img
              src={coach.photo || "https://via.placeholder.com/80"}
              alt={coach.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold">{coach.name}</p>
              <p className="text-gray-400">{coach.nationality}</p>
              <p className="text-gray-400">
                Age: {coach.age || "—"} | Experience: {coach.career?.length || 0} clubs
              </p>
            </div>
          </div>
        </div>
      )}

      
      
      <hr className="border-gray-700 my-8"/>

      
      <div className="bg-neutral-900 rounded-xl p-6 shadow-md mb-10 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 text-yellow-400">
            Squad
          </h2>

          <select
            value={sortPosition}
            onChange={(e) => setSortPosition(e.target.value)}
            className="bg-neutral-800 text-gray-200 p-2 rounded-lg border border-gray-700"
          >
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-300 border-separate border-spacing-y-1">
            <thead className="bg-neutral-800 text-gray-400 uppercase text-sm">
              <tr>
                <th className="px-4 py-3 text-center rounded-l-lg">Number</th>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Nationality</th>
                <th className="px-4 py-3 rounded-r-lg">Age</th>
              </tr>
            </thead>
            <tbody>
              {filteredSquad.map((player, index) => {
                const nationality = player.nationality || player.birth?.nationality || "—";
                const flagCode = FLAG_MAP[nationality.replace(/\s+/g, "")];
                const flagUrl = flagCode
                  ? `https://flagcdn.com/w20/${flagCode}.png`
                  : null;

                return (
                  <tr
                    key={player.id || index}
                    className="bg-neutral-800 hover:bg-neutral-700 transition"
                  >
                    <td className="px-4 py-3 text-center font-semibold rounded-l-lg">
                      {player.number || "—"}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <Link to={`/player/${player.id}`} className="flex items-center gap-3 hover:text-blue-400">
                        <img
                          src={player.photo || "https://via.placeholder.com/40"}
                          alt={player.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-600"
                        />
                        <span className="font-semibold">{player.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-yellow-300 font-medium text-xs">{player.position || "—"}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      {flagUrl && (
                        <img
                          src={flagUrl}
                          alt={nationality}
                          className="w-5 h-4 object-cover rounded-sm border border-gray-600"
                        />
                      )}
                      <span>{nationality}</span>
                    </td>
                    <td className="px-4 py-3 rounded-r-lg">{player.age || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
     
      <hr className="border-gray-700 my-8"/>

      <div className="space-y-10">
        
        <NewsDisplay
          title={`${teamInfo.team?.name} News`}
          fetchFunction={getTeamNewsByName}
          fetchParam={teamInfo.team?.name}
        />

    
        <NewsDisplay
          title={`${leagueName} News`}
          fetchFunction={getLeagueNewsById}
          fetchParam={leagueId}
        />
      </div>
      
    </div>
  );
}