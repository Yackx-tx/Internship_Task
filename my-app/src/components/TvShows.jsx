import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import MovieDetailsModal from './MovieDetailsModal';
import { getPopularTVShows, getTVShowDetails } from '../services/api';
import { Tv } from 'lucide-react';

const TvShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        const data = await getPopularTVShows(page);

        if (data && data.results) {
          if (page === 1) {
            setTvShows(data.results);
          } else {
            setTvShows((prevShows) => [...prevShows, ...data.results]);
          }

          setHasMore(data.page < data.total_pages);
        } else {
          setError("Failed to fetch TV shows");
        }
      } catch (err) {
        setError("An error occurred while fetching TV shows");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, [page]);

  const handleShowClick = async (show) => {
    setSelectedShow(show);

    try {
      const details = await getTVShowDetails(show.id);
      setShowDetails(details);
    } catch (err) {
      console.error("Error fetching TV show details:", err);
    }
  };

  const handleCloseModal = () => {
    setSelectedShow(null);
    setShowDetails(null);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="bg-dark min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white text-3xl font-bold flex items-center">
            <span className="mr-3 p-2 rounded-full bg-primary/20">
              <Tv size={20} className="text-primary" />
            </span>
            Popular TV Shows
          </h2>
        </div>

        {error ? (
          <div className="bg-red-900/30 border border-red-500 text-white px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {tvShows.map((show) => (
                <MovieCard key={show.id} movie={show} onClick={handleShowClick} />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              {loading && (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              )}

              {!loading && hasMore && (
                <button 
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-medium transition-colors"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              )}
            </div>
          </>
        )}

        {selectedShow && showDetails && (
          <MovieDetailsModal movie={showDetails} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default TvShows;
