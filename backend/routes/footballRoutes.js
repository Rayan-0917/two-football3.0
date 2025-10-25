import express from "express";
import {
  getMatchesByDate,
  getLeagueStandings,
  getTopScorers,
  getTopAssisters,
  getTeamInfo,
  getTeamSquad,
  getTeamStatistics,
  getPlayerDetails,
  getMatchDetails,
  getTeamCoach,
  getTeamLastFixtures,
  getTeamTransfers,
  // NEW IMPORTS
  getPlayerTransfers, 
  getPlayerTrophies 
} from "../controllers/footballController.js";

const router = express.Router();

router.get("/matches", getMatchesByDate);
router.get("/standings/:leagueId", getLeagueStandings);
router.get("/topscorers/:leagueId", getTopScorers);
router.get("/topassisters/:leagueId", getTopAssisters);

// Team Routes
router.get("/team/:teamId", getTeamInfo);
router.get("/team/:teamId/squad", getTeamSquad);
router.get("/team/:teamId/statistics", getTeamStatistics);
router.get("/team/:teamId/coach", getTeamCoach);
router.get("/team/:teamId/transfers", getTeamTransfers); // Existing: Team Transfers
router.get("/team/:teamId/lastfixtures", getTeamLastFixtures);
router.get("/match/:fixtureId", getMatchDetails);

// Player Routes
router.get("/player/:playerId", getPlayerDetails);
// NEW ROUTES
router.get("/player/:playerId/transfers", getPlayerTransfers); // New: Player Transfers
router.get("/player/:playerId/trophies", getPlayerTrophies);   // New: Player Trophies


export default router;