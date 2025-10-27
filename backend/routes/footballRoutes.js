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
  getPlayerTransfers, 
  getPlayerTrophies 
} from "../controllers/footballController.js";

const router = express.Router();

router.get("/matches", getMatchesByDate);
router.get("/standings/:leagueId", getLeagueStandings);
router.get("/topscorers/:leagueId", getTopScorers);
router.get("/topassisters/:leagueId", getTopAssisters);


router.get("/team/:teamId", getTeamInfo);
router.get("/team/:teamId/squad", getTeamSquad);
router.get("/team/:teamId/statistics", getTeamStatistics);
router.get("/team/:teamId/coach", getTeamCoach);
router.get("/team/:teamId/transfers", getTeamTransfers); 
router.get("/team/:teamId/lastfixtures", getTeamLastFixtures);
router.get("/match/:fixtureId", getMatchDetails);


router.get("/player/:playerId", getPlayerDetails);

router.get("/player/:playerId/transfers", getPlayerTransfers); 
router.get("/player/:playerId/trophies", getPlayerTrophies);   


export default router;