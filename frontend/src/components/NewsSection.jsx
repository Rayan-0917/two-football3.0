import React, { useEffect, useState } from "react";
import { getFootballNews } from "../api/newsApi";

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const articles = await getFootballNews();
        setNews(articles);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading)
    return <p className="text-gold-400 text-center mt-4 font-semibold animate-pulse">Loading news...</p>;

  return (
   
    <aside className="w-90 bg-neutral-800 text-white p-6 rounded-2xl scrollbar-none shadow-xl border border-neutral-700 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
   
      <h2 className="text-xl font-bold mb-4 border-b border-gold-500 pb-3 text-gold-400">
        Latest Football News
      </h2>
      <ul className="space-y-4">
        {news.length === 0 && (
          <p className="text-gray-400 text-center p-4">No news available.</p>
        )}
        {news.map((article, idx) => (
          <li
            key={idx}
           
            className="hover:bg-neutral-700 p-3 rounded-lg cursor-pointer transition duration-200 border border-neutral-700"
            onClick={() => window.open(article.url, '_blank')}
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-36 object-cover rounded-lg mb-3 shadow-md"
              />
            )}
            <h3 className="font-bold text-gray-100 mb-1">{article.title}</h3>
            <p className="text-sm text-gray-400">
              {article.source.name} •{" "}
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}