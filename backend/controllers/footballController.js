import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://v3.football.api-sports.io";
const API_KEY = process.env.API_FOOTBALL_KEY;

const fetchAPI = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "x-apisports-key": API_KEY },
  });
  const data = await res.json();
  return data.response;
};

export const getMatchesByDate = async (req, res) => {
  const { date } = req.query;
  try {
    const data = await fetchAPI(`/fixtures?date=${date}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
};

export const getLeagueStandings = async (req, res) => {
  const { leagueId } = req.params;
  const { season = 2023 } = req.query;
  try {
    const apiResponse = await fetchAPI(`/standings?league=${leagueId}&season=${season}`);
    
    // Check if the response is valid and extract necessary data
    const leagueData = apiResponse[0]?.league;
    const standingsArray = leagueData?.standings[0] || [];

    // FIX: Return an object containing both league info and the standings array.
    res.json({
        standings: standingsArray,
        leagueInfo: leagueData ? {
            name: leagueData.name,
            country: leagueData.country,
            logo: leagueData.logo,
            season: leagueData.season,
            id: leagueData.id,
        } : null,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch standings" });
  }
};

export const getTopScorers = async (req, res) => {
  const { leagueId } = req.params;
  const { season = 2023 } = req.query;
  try {
    const data = await fetchAPI(`/players/topscorers?league=${leagueId}&season=${season}`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch top scorers" });
  }
};

export const getTopAssisters = async (req, res) => {
  const { leagueId } = req.params;
  const { season = 2023 } = req.query;
  try {
    const data = await fetchAPI(`/players/topassists?league=${leagueId}&season=${season}`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch top assisters" });
  }
};

export const getTeamInfo = async (req, res) => {
  const { teamId } = req.params;
  try {
    const data = await fetchAPI(`/teams?id=${teamId}`);
    res.json(data[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch team info" });
  }
};

export const getTeamSquad = async (req, res) => {
  const { teamId } = req.params;
  try {
    const data = await fetchAPI(`/players/squads?team=${teamId}`);
    res.json(data[0]?.players || []);
  } catch {
    res.status(500).json({ error: "Failed to fetch squad" });
  }
};

export const getTeamStatistics = async (req, res) => {
  const { teamId } = req.params;
  const { leagueId, season = 2023 } = req.query;
  try {
    const data = await fetchAPI(`/teams/statistics?league=${leagueId}&team=${teamId}&season=${season}`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch team stats" });
  }
};

export const getPlayerDetails = async (req, res) => {
  const { playerId } = req.params;
  const { season } = req.query; // season is optional, for current season stats
  try {
    // The season parameter can be omitted to get general info, but is needed for stats.
    const endpoint = season
      ? `/players?id=${playerId}&season=${season}`
      : `/players?id=${playerId}`;
    const data = await fetchAPI(endpoint);
    res.json(data[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch player details" });
  }
};

export const getPlayerTransfers = async (req, res) => {
  const { playerId } = req.params;
  try {
    const data = await fetchAPI(`/transfers?player=${playerId}`);
    // The API returns an array with one object per player, containing a 'transfers' array.
    res.json(data[0]?.transfers || []);
  } catch {
    res.status(500).json({ error: "Failed to fetch player transfers" });
  }
};

export const getPlayerTrophies = async (req, res) => {
  const { playerId } = req.params;
  try {
    const data = await fetchAPI(`/trophies?player=${playerId}`);
    res.json(data || []);
  } catch {
    res.status(500).json({ error: "Failed to fetch player trophies" });
  }
};

export const getMatchDetails = async (req, res) => {
  const { fixtureId } = req.params;

  try {
    const [fixtureData, statsData, lineupsData, eventsData] = await Promise.all([
      fetchAPI(`/fixtures?id=${fixtureId}`),
      fetchAPI(`/fixtures/statistics?fixture=${fixtureId}`),
      fetchAPI(`/fixtures/lineups?fixture=${fixtureId}`),
      fetchAPI(`/fixtures/events?fixture=${fixtureId}`),
    ]);

    res.json({
      fixture: fixtureData[0],
      statistics: statsData,
      lineups: lineupsData,
      events: eventsData,
    });
  } catch (error) {
    console.error("Error fetching match details:", error);
    res.status(500).json({ error: "Failed to fetch match details" });
  }
};

export const getTeamCoach = async (req, res) => {
  const { teamId } = req.params;
  try {
    const data = await fetchAPI(`/coachs?team=${teamId}`);
    res.json(data[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch coach info" });
  }
};

export const getTeamTransfers = async (req, res) => {
  const { teamId } = req.params;
  try {
    const data = await fetchAPI(`/transfers?team=${teamId}`);
    res.json(data[0] || {});
  } catch {
    res.status(500).json({ error: "Failed to fetch transfers" });
  }
};

export const getTeamLastFixtures = async (req, res) => {
  const { teamId } = req.params;
  try {
    const data = await fetchAPI(`/fixtures?team=${teamId}&last=10`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch last fixtures" });
  }
};


