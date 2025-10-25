const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getMatchesByDate = async (date) => {
  const res = await fetch(`${BASE_URL}/matches?date=${date}`);
  return await res.json();
};

export const getLeagueStandings = async (leagueId, season = 2023) => {
  const res = await fetch(`${BASE_URL}/standings/${leagueId}?season=${season}`);
  return await res.json();
};

export const getTopScorers = async (leagueId, season = 2023) => {
  const res = await fetch(`${BASE_URL}/topscorers/${leagueId}?season=${season}`);
  return await res.json();
};

export const getTopAssisters = async (leagueId, season = 2023) => {
  const res = await fetch(`${BASE_URL}/topassisters/${leagueId}?season=${season}`);
  return await res.json();
};

export const getTeamInfo = async (teamId) => {
  const res = await fetch(`${BASE_URL}/team/${teamId}`);
  return await res.json();
};

export const getTeamSquad = async (teamId) => {
  const res = await fetch(`${BASE_URL}/team/${teamId}/squad`);
  return await res.json();
};

export const getTeamStatistics = async (leagueId, teamId, season = 2023) => {
  const res = await fetch(`${BASE_URL}/team/${teamId}/statistics?leagueId=${leagueId}&season=${season}`);
  return await res.json();
};

export const getPlayerDetails = async (playerId, season) => {
  const seasonQuery = season ? `&season=${season}` : '';
  const res = await fetch(`${BASE_URL}/player/${playerId}?${seasonQuery}`);
  return await res.json();
};

// NEW API FUNCTIONS

export const getPlayerTransfers = async (playerId) => {
  const res = await fetch(`${BASE_URL}/player/${playerId}/transfers`);
  return await res.json();
};

export const getPlayerTrophies = async (playerId) => {
  const res = await fetch(`${BASE_URL}/player/${playerId}/trophies`);
  return await res.json();
};

// END NEW API FUNCTIONS

export const getMatchDetails = async (fixtureId) => {
  const res = await fetch(`${BASE_URL}/match/${fixtureId}`);
  return await res.json();
};

export const getTeamCoach = async (teamId) => {
  const res = await fetch(`${BASE_URL}/team/${teamId}/coach`);
  return await res.json();
};

export const getTeamTransfers = async (teamId) => {
  const res = await fetch(`${BASE_URL}/team/${teamId}/transfers`);
  return await res.json();
};

export const getTeamLastFixtures = async (teamId) => {
  const res = await fetch(`${BASE_URL}/team/${teamId}/lastfixtures`);
  return await res.json();
};