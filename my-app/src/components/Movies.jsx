"use client"

import { useState, useEffect } from "react"
import MovieCard from "./MovieCard"
import MovieDetailsModal from "./MovieDetailsModal"
import { getPopularMovies, getMovieDetails } from "../services/api"

const Movies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [movieDetails, setMovieDetails] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const data = await getPopularMovies(page)

        if (data && data.results) {
          if (page === 1) {
            setMovies(data.results)
          } else {
            setMovies((prevMovies) => [...prevMovies, ...data.results])
          }

          setHasMore(data.page < data.total_pages)
        } else {
          setError("Failed to fetch movies")
        }
      } catch (err) {
        setError("An error occurred while fetching movies")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [page])

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie)

    try {
      const details = await getMovieDetails(movie.id)
      setMovieDetails(details)
    } catch (err) {
      console.error("Error fetching movie details:", err)
    }
  }

  const handleCloseModal = () => {
    setSelectedMovie(null)
    setMovieDetails(null)
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  return (
    <div className="bg-dark min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-white text-3xl font-bold mb-8">Popular Movies</h1>

        {error ? (
          <div className="text-red-500 bg-red-100/10 p-4 rounded-lg">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
              ))}
            </div>

            {loading && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}

            {!loading && hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-medium transition-colors"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedMovie && movieDetails && <MovieDetailsModal movie={movieDetails} onClose={handleCloseModal} />}
    </div>
  )
}

export default Movies

