import React from "react";
import Sidebar from "../components/Sidebar";
import ScoresSection from "../components/ScoresSection";
import NewsSection from "../components/NewsSection";


export default function Home() {
  return (
    <div className="flex flex-1 gap-4 p-6 mt-3 bg-black min-h-screen">
      <Sidebar />
      <ScoresSection />
      <NewsSection/>
    </div>
  );
}
