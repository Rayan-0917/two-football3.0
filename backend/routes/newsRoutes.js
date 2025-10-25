import express from "express";
import fetch from "node-fetch";

const router=express.Router();

const LEAGUE_NEWS_NAMES = {
  39: "Premier League",
  140: "La Liga",
  78: "Bundesliga",
  61: "Ligue 1",
  135: "Serie A",
  2: "Champions League",
};

// Fetch general football news
router.get("/football", async (req, res) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=soccer&sortBy=publishedAt&pageSize=10&language=en`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEWS_API_KEY}`,
        },
      }
    );
    const data = await response.json();
    res.json(data.articles || []);
  } catch (error) {
    console.error("Error fetching football news:", error);
    res.status(500).json({ error: "Failed to fetch football news" });
  }
});

// Fetch league-specific news by ID
router.get("/league/:id", async (req, res) => {
  const leagueId = req.params.id;
  const leagueName = LEAGUE_NEWS_NAMES[leagueId];

  if (!leagueName) return res.json([]); // unsupported league

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        leagueName
      )}&sortBy=publishedAt&pageSize=9&language=en`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEWS_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    res.json(data.articles || []);
  } catch (error) {
    console.error("Error fetching league news:", error);
    res.status(500).json({ error: "Failed to fetch league news" });
  }
});

// NEW: Fetch team-specific news by name
router.get("/team/:name", async (req, res) => {
    const teamName = req.params.name;
    
    if (!teamName) return res.json([]);

    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(
                `${teamName} football`
            )}&sortBy=publishedAt&pageSize=6&language=en`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEWS_API_KEY}`,
                },
            }
        );

        const data = await response.json();
        res.json(data.articles || []);
    } catch (error) {
        console.error("Error fetching team news:", error);
        res.status(500).json({ error: "Failed to fetch team news" });
    }
});

// NEW: Fetch player-specific news by name
router.get("/player/:name", async (req, res) => {
    const playerName = req.params.name;

    if (!playerName) return res.json([]);

    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(
                `${playerName} soccer player`
            )}&sortBy=publishedAt&pageSize=6&language=en`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEWS_API_KEY}`,
                },
            }
        );

        const data = await response.json();
        res.json(data.articles || []);
    } catch (error) {
        console.error("Error fetching player news:", error);
        res.status(500).json({ error: "Failed to fetch player news" });
    }
});

export default router;
