import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import MatchDetails from "./pages/MatchDetails";
import LeaguePage from "./pages/LeaguePage";
import TeamPage from "./pages/TeamPage";
import PlayerPage from "./pages/PlayerPage";


export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match/:fixtureId" element={<MatchDetails/>} />
        <Route path="/league/:leagueId" element={<LeaguePage/>}/>
        <Route path="/team/:id" element={<TeamPage/>}/>
        <Route path="/player/:id" element={<PlayerPage/>}/>
        <Route path="/news" element={<NewsPage />} />
      </Routes>
    </div>
    
  );
}
