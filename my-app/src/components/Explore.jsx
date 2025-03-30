"use client"

import { useState, useEffect } from "react"
import { Filter, ChevronDown, X } from 'lucide-react'
import { searchMovies, fetchMovieById } from "../services/api"

const Explore = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    genre: "all",
    year: "all",
    rating: "all"
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("popular")

  // Initial movie loading
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true)
      try {
        // Initial search query to get some movies
        const results = await searchMovies(searchQuery)
        
        // For each search result, get detailed movie information
        const detailedMovies = await Promise.all(
          results.map(async (movie) => {
            const details = await fetchMovieById(movie.id)
            return details || movie
          })
        )
        
        setMovies(detailedMovies.filter(movie => movie !== null))
      } catch (error) {
        console.error("Error loading movies:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadMovies()
  }, [searchQuery])

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    })
  }

  const openMovieDetail = async (movie) => {
    setLoading(true)
    try {
      // Fetch full movie details if we don't have them yet
      if (!movie.plot || !movie.director || !movie.actors) {
        const detailedMovie = await fetchMovieById(movie.id)
        if (detailedMovie) {
          setSelectedMovie(detailedMovie)
        } else {
          setSelectedMovie(movie)
        }
      } else {
        setSelectedMovie(movie)
      }
      setShowModal(true)
    } catch (error) {
      console.error("Error fetching movie details:", error)
      setSelectedMovie(movie)
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }

  const closeMovieDetail = () => {
    setShowModal(false)
    setSelectedMovie(null)
  }

  // Apply filters to movies
  const filteredMovies = movies.filter(movie => {
    return (
      (filters.genre === "all" || (movie.genre && movie.genre.includes(filters.genre))) &&
      (filters.year === "all" || movie.year.toString() === filters.year) &&
      (filters.rating === "all" || (movie.rating && movie.rating >= parseInt(filters.rating)))
    )
  })

  // Extract unique years from movies for filter dropdown
  const uniqueYears = [...new Set(movies.map(movie => movie.year))].sort().reverse()
  
  // Extract unique genres from movies for filter dropdown
  const uniqueGenres = [...new Set(movies.flatMap(movie => 
    movie.genre ? movie.genre.split(", ") : []
  ))].sort()

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Explore Movies</h1>
          <button 
            onClick={toggleFilters}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
          >
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown size={18} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters section */}
        {showFilters && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Genre</label>
              <select 
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Genres</option>
                {uniqueGenres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Year</label>
              <select 
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Rating</label>
              <select 
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Ratings</option>
                <option value="9">9+</option>
                <option value="8">8+</option>
                <option value="7">7+</option>
                <option value="6">6+</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block mb-2 text-sm font-medium">Search Movies</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Search for movies..."
                  className="flex-1 bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(e.target.value)}
                />
                <button 
                  onClick={() => setSearchQuery(searchQuery)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Movies grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-400">{filteredMovies.length} movies found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMovies.map(movie => (
                <div 
                  key={movie.id} 
                  className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-red-600/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => openMovieDetail(movie)}
                >
                  <div className="relative aspect-[2/3]">
                    <img 
                      src={movie.posterUrl || "/placeholder.svg?height=450&width=300"} 
                      alt={movie.title} 
                      className="w-full h-full object-cover"
                    />
                    {movie.rating && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded">
                        {movie.rating}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 truncate">{movie.title}</h3>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{movie.year}</span>
                      <span>{movie.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* No results message */}
        {!loading && filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No movies found matching your filters</p>
            <button 
              onClick={() => setFilters({ genre: "all", year: "all", rating: "all" })}
              className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Movie Detail Modal */}
        {showModal && selectedMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <button 
                  onClick={closeMovieDetail}
                  className="absolute top-4 right-4 bg-gray-900 bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-colors z-10"
                >
                  <X size={24} />
                </button>
                
                <div className="md:flex">
                  {/* Movie poster */}
                  <div className="md:w-1/3">
                    <div className="aspect-[2/3] relative">
                      <img 
                        src={selectedMovie.posterUrl || "/placeholder.svg?height=450&width=300"} 
                        alt={selectedMovie.title} 
                        className="w-full h-full object-cover"
                      />
                      {selectedMovie.rating && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded">
                          {selectedMovie.rating}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Movie details */}
                  <div className="md:w-2/3 p-6">
                    <h2 className="text-2xl font-bold mb-2">{selectedMovie.title}</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">{selectedMovie.year}</span>
                      {selectedMovie.duration && (
                        <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">{selectedMovie.duration}</span>
                      )}
                      {selectedMovie.rating && (
                        <span className="bg-red-600 px-3 py-1 rounded-full text-sm">{selectedMovie.rating} ★</span>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Overview</h3>
                      <p className="text-gray-300">{selectedMovie.plot || "No description available"}</p>
                    </div>
                    
                    {selectedMovie.director && selectedMovie.director !== "N/A" && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Director</h3>
                        <p className="text-gray-300">{selectedMovie.director}</p>
                      </div>
                    )}
                    
                    {selectedMovie.actors && selectedMovie.actors !== "N/A" && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Cast</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedMovie.actors.split(", ").map((actor, index) => (
                            <span 
                              key={index} 
                              className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {actor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Explore
