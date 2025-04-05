import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import MovieDetailsModal from './MovieDetailsModal';
import { getMoviesByGenre, getMovieDetails } from '../services/api';
import { Filter } from 'lucide-react';

const Genre = ({ genreId, genreName }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        setLoading(true);
        const data = await getMoviesByGenre(genreId, page);

        if (data && data.results) {
          if (page === 1) {
            setMovies(data.results);
          } else {
            setMovies((prevMovies) => [...prevMovies, ...data.results]);
          }

          setHasMore(data.page < data.total_pages);
        } else {
          setError(`Failed to fetch ${genreName} movies`);
        }
      } catch (err) {
        setError(`An error occurred while fetching ${genreName} movies`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, [genreId, genreName, page]);

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);

    try {
      const details = await getMovieDetails(movie.id);
      setMovieDetails(details);
    } catch (err) {
      console.error("Error fetching movie details:", err);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
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
              <Filter size={20} className="text-primary" />
            </span>
            {genreName} Movies
          </h2>
        </div>

        {error ? (
          <div className="bg-red-900/30 border border-red-500 text-white px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
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

        {selectedMovie && movieDetails && (
          <MovieDetailsModal movie={movieDetails} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default Genre;
