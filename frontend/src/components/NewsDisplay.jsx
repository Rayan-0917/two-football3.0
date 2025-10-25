import React, { useState, useEffect } from 'react';

/**
 * Reusable component to fetch and display news articles in a responsive grid.
 * @param {object} props
 * @param {string} title - The title of the news section (e.g., "Premier League News").
 * @param {function} fetchFunction - The API function to call (e.g., getLeagueNewsById).
 * @param {string|number} fetchParam - The parameter for the fetch function (e.g., leagueId, teamName).
 */
export default function NewsDisplay({ title, fetchFunction, fetchParam }) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!fetchParam || !fetchFunction) {
            setLoading(false);
            return;
        }

        const loadNews = async () => {
            setLoading(true);
            try {
                const data = await fetchFunction(fetchParam);
                setArticles(data);
            } catch (error) {
                console.error(`Failed to fetch news for ${title}:`, error);
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, [fetchFunction, fetchParam, title]);

    if (loading) {
        return (
            <div className="p-4 text-center text-gray-400">
                Loading {title.toLowerCase()}...
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No recent news found for {title.toLowerCase()}.
            </div>
        );
    }

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="bg-neutral-800 rounded-xl shadow-lg p-4 sm:p-6 border border-neutral-700">
            <h2 className="text-2xl font-semibold mb-4 border-b border-neutral-700 pb-2 text-yellow-400">
                {title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                    <a 
                        key={index} 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block bg-neutral-900 rounded-xl overflow-hidden hover:shadow-yellow-500/30 shadow-md transition duration-300 ease-in-out transform hover:scale-[1.02]"
                    >
                        {/* Image or Placeholder */}
                        <div className="h-40 w-full overflow-hidden bg-neutral-700">
                            {article.urlToImage ? (
                                <img 
                                    src={article.urlToImage} 
                                    alt={article.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/3f3f46/fef3c7?text=No+Image"; }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-center p-4">
                                    Image Not Available
                                </div>
                            )}
                        </div>
                        
                        {/* Content */}
                        <div className="p-4 space-y-2">
                            <p className="text-sm text-gray-400">
                                {article.source?.name} &bull; {formatDate(article.publishedAt)}
                            </p>
                            <h3 className="text-lg font-bold text-white line-clamp-2 hover:text-yellow-400 transition">
                                {article.title}
                            </h3>
                            <p className="text-sm text-gray-300 line-clamp-3">
                                {article.description || 'Click to read full article...'}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
