const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";


export const getFootballNews = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/news/football`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching football news:", error);
    return [];
  }
};


export const getLeagueNewsById = async (leagueId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/news/league/${leagueId}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching league news:", error);
    return [];
  }
};


export const getTeamNewsByName = async (teamName) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/news/team/${encodeURIComponent(teamName)}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching news for team ${teamName}:`, error);
        return [];
    }
};


export const getPlayerNewsByName = async (playerName) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/news/player/${encodeURIComponent(playerName)}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching news for player ${playerName}:`, error);
        return [];
    }
};
