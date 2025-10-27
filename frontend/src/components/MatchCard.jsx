import React from "react";
import { useNavigate } from "react-router-dom";

export default function MatchCard({ match }) {
  const navigate = useNavigate();
  const isLive =
    match.status === "1H" ||
    match.status === "2H" ||
    match.status === "ET";

  return (
    
    <div onClick={()=>navigate(`/match/${match.id}`)}
      className="grid grid-cols-3 items-center bg-neutral-800 p-4 rounded-xl hover:bg-neutral-700 transition duration-200 cursor-pointer text-sm font-semibold border border-neutral-700 hover:border-green-500"
    >
      {/* Home team */}
      <div className="flex items-center justify-start gap-3 truncate">
        <img src={match.homeLogo} alt={match.home} className="w-6 h-6 object-contain" />
        <p className="text-left text-gray-200">{match.home}</p>
      </div>

      {/* Center: Score + Minute/Status */}
      <div className="text-center flex flex-col items-center">
        
        <p className={`text-xl font-extrabold ${isLive ? "text-green-400" : "text-gray-100"}`}>
          {match.score}
        </p>
        {isLive ? (
         
          <p className="text-[10px] text-green-400 font-bold bg-green-900/50 px-2 py-0.5 rounded-full animate-pulse mt-1">
            {match.minute}’
          </p>
        ) : (
          <p className="text-xs text-gray-400 font-normal mt-1">{match.status}</p>
        )}
      </div>

      {/* Away team */}
      <div className="flex items-center justify-end gap-3 truncate">
        <p className="text-right text-gray-200">{match.away}</p>
        <img src={match.awayLogo} alt={match.away} className="w-6 h-6 object-contain" />
      </div>
    </div>
  );
}