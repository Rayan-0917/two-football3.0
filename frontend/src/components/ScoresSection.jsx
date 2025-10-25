import React, { useState, useEffect } from "react";
import MatchCard from "./MatchCard";
import { getMatchesByDate } from "../api/footballApi";
import { Link } from "react-router-dom";

export default function ScoresSection() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => date.toISOString().split("T")[0]; // yyyy-mm-dd
  const displayDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const fetchMatches = async (date) => {
    setLoading(true);
    const data = await getMatchesByDate(formatDate(date));
    setMatches(data);
    setLoading(false);
  };

  const goToYesterday = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToTomorrow = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  useEffect(() => {
    fetchMatches(currentDate);
  }, [currentDate]);

  // ✅ Group matches by league
  const groupedByLeague = matches.reduce((acc, match) => {
    const leagueName = match.league.name;
    if (!acc[leagueName]) acc[leagueName] = [];
    acc[leagueName].push(match);
    return acc;
  }, {});

  return (
    // UPDATED CSS: Brighter shadow, more defined background
    <section className="flex-1 bg-neutral-800 text-white p-6 rounded-2xl shadow-xl border border-neutral-700 overflow-y-auto">
      {/* Date Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goToYesterday}
          // UPDATED CSS: Vibrant primary color hover
          className="bg-neutral-700 text-gold-400 p-2 rounded-full hover:bg-neutral-600 transition duration-200"
        >
          <span className="text-lg font-bold">◀</span>
        </button>
        {/* UPDATED CSS: Title highlight */}
        <h2 className="text-xl font-extrabold text-gold-400">
          {displayDate(currentDate)} Fixtures
        </h2>
        <button
          onClick={goToTomorrow}
          // UPDATED CSS: Vibrant primary color hover
          className="bg-neutral-700 text-gold-400 p-2 rounded-full hover:bg-neutral-600 transition duration-200"
        >
          <span className="text-lg font-bold">▶</span>
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-gold-400 font-semibold animate-pulse">Loading matches...</p>}

      {/* Matches Grouped by League */}
      {!loading && matches.length > 0 ? (
        Object.entries(groupedByLeague).map(([leagueName, leagueMatches]) => (
          <div key={leagueName} className="mb-8 p-3 bg-neutral-900 rounded-xl shadow-inner border border-neutral-800">
            {/* UPDATED CSS: Stronger league header */}
            <h3 className="text-lg font-bold mb-3 border-b border-gold-500 pb-2 flex items-center gap-3 text-gray-100">
              <img
                src={leagueMatches[0].league.logo}
                alt={leagueName}
                className="w-7 h-7 object-contain"
              />
              {leagueName}
            </h3>
            <div className="space-y-3">
              {leagueMatches.map((match) => (
                <Link 
                    key={match.fixture.id} 
                    to={`/match/${match.fixture.id}`}
                    className="block"
                >
                  <MatchCard
                    match={{
                      id: match.fixture.id,
                      home: match.teams.home.name,
                      away: match.teams.away.name,
                      homeLogo: match.teams.home.logo,
                      awayLogo: match.teams.away.logo,
                      score:
                        match.goals.home !== null
                          ? `${match.goals.home} - ${match.goals.away}`
                          : "vs",
                      status: match.fixture.status.short,
                      minute:
                        match.fixture.status.short === "1H" ||
                        match.fixture.status.short === "2H"
                          ? match.fixture.status.elapsed
                          : null,
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>
        ))
      ) : (
        !loading && (
          <p className="text-center text-gray-500 font-medium p-4">
            No matches found for this date.
          </p>
        )
      )}
    </section>
  );
}