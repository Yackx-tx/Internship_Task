"use client"

import { useState, useEffect } from "react"
import { searchMovies } from "../services/api"

// OMDb doesn't have genre IDs like TMDB, so we'll use these genres for search
const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 3, name: "Animation" },
  { id: 4, name: "Comedy" },
  { id: 5, name: "Crime" },
  { id: 6, name: "Documentary" },
  { id: 7, name: "Drama" },
  { id: 8, name: "Family" },
  { id: 9, name: "Fantasy" },
  { id: 10, name: "History" },
  { id: 11, name: "Horror" },
  { id: 12, name: "Music" },
  { id: 13, name: "Mystery" },
  { id: 14, name: "Romance" },
  { id: 15, name: "Science Fiction", searchTerm: "sci-fi" },
  { id: 16, name: "TV Movie", searchTerm: "tv movie" },
  { id: 17, name: "Thriller" },
  { id: 18, name: "War" },
  { id: 19, name: "Western" }
]

const Genre = () => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre)
    }
  }, [selectedGenre])

  const fetchMoviesByGenre = async (genre) => {
    setLoading(true)
    try {
      // Use the genre name or searchTerm for the API query
      const searchTerm = genre.searchTerm || genre.name
      const moviesData = await searchMovies(searchTerm)
      setMovies(moviesData || [])
    } catch (error) {
      console.error("Error fetching movies:", error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-red-600">Browse by Genre</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre)}
            className={`py-3 px-4 rounded-lg transition-colors ${
              selectedGenre?.id === genre.id
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-white hover:bg-red-600/80"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {selectedGenre && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            {selectedGenre.name} Movies
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-white font-medium truncate">{movie.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {movie.year}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-400">
                  No movies found for this genre.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {!selectedGenre && (
        <div className="text-center text-gray-400 py-12">
          <p>Select a genre to browse movies</p>
        </div>
      )}
    </div>
  )
}

export default Genre
