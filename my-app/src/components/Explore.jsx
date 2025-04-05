"use client"

import { useState, useEffect } from "react"
import MovieCard from "./MovieCard"
import MovieDetailsModal from "./MovieDetailsModal"
import {
  getMovieGenres,
  getPopularMovies,
  getTopRatedMovies,
  searchMovies,
  getMovieDetails,
  discoverMovies,
} from "../services/api"
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from "lucide-react"

const Explore = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [genres, setGenres] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [movieDetails, setMovieDetails] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeSort, setActiveSort] = useState("popularity.desc")
  const [activeFilters, setActiveFilters] = useState({
    genres: [],
    yearFrom: 1900,
    yearTo: new Date().getFullYear(),
    ratingFrom: 0,
    ratingTo: 10,
  })

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getMovieGenres()
        if (data && data.genres) {
          setGenres(data.genres)
        }
      } catch (err) {
        console.error("Error fetching genres:", err)
      }
    }

    fetchGenres()
  }, [])

  // Fetch movies based on search query, filters, or default to popular movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        let data

        if (searchQuery.trim()) {
          // Search for movies
          data = await searchMovies(searchQuery, page)
        } else if (activeFilters.genres.length > 0) {
          // Use discover API with genre filter
          data = await discoverMovies({
            page,
            sortBy: activeSort,
            genres: activeFilters.genres,
            yearFrom: activeFilters.yearFrom,
            yearTo: activeFilters.yearTo,
            voteAverageFrom: activeFilters.ratingFrom,
            voteAverageTo: activeFilters.ratingTo,
          })
        } else {
          // Get popular or top rated movies based on sort
          data = activeSort === "vote_average.desc" ? await getTopRatedMovies(page) : await getPopularMovies(page)
        }

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
  }, [searchQuery, page, activeSort, activeFilters])

  const handleMovieClick = async (movie) => {
    try {
      const details = await getMovieDetails(movie.id)
      setSelectedMovie(movie)
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

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    setSearchQuery(searchInput)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleSortChange = (sortValue) => {
    setActiveSort(sortValue)
    setPage(1)
    setMovies([])
  }

  const toggleGenreFilter = (genreId) => {
    setActiveFilters((prev) => {
      const newGenres = prev.genres.includes(genreId)
        ? prev.genres.filter((id) => id !== genreId)
        : [...prev.genres, genreId]

      return {
        ...prev,
        genres: newGenres,
      }
    })
    setPage(1)
  }

  const handleRangeFilterChange = (type, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: value,
    }))
    setPage(1)
  }

  const clearFilters = () => {
    setActiveFilters({
      genres: [],
      yearFrom: 1900,
      yearTo: new Date().getFullYear(),
      ratingFrom: 0,
      ratingTo: 10,
    })
    setSearchInput("")
    setSearchQuery("")
    setPage(1)
  }

  // Apply client-side filters for any remaining criteria
  const filteredMovies = movies.filter((movie) => {
    // Year filter (if not already applied via API)
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null
    const yearMatch = !year || (year >= activeFilters.yearFrom && year <= activeFilters.yearTo)

    // Rating filter (if not already applied via API)
    const ratingMatch =
      !movie.vote_average ||
      (movie.vote_average >= activeFilters.ratingFrom && movie.vote_average <= activeFilters.ratingTo)

    return yearMatch && ratingMatch
  })

  const sortOptions = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "vote_average.desc", label: "Highest Rated" },
    { value: "release_date.desc", label: "Newest" },
    { value: "release_date.asc", label: "Oldest" },
    { value: "revenue.desc", label: "Highest Grossing" },
  ]

  const isFiltered =
    activeFilters.genres.length > 0 ||
    activeFilters.yearFrom > 1900 ||
    activeFilters.yearTo < new Date().getFullYear() ||
    activeFilters.ratingFrom > 0 ||
    activeFilters.ratingTo < 10

  return (
    <div className="bg-dark min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-white text-3xl font-bold flex items-center mb-4 md:mb-0">
            <span className="mr-3 p-2 rounded-full bg-primary/20">
              <Search size={20} className="text-primary" />
            </span>
            Explore Movies
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex-grow">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-dark-lighter text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full"
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchInput && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setSearchInput("")}
                >
                  <X size={14} />
                </button>
              )}
            </form>

            <button
              onClick={toggleFilters}
              className="flex items-center justify-center bg-dark-lighter hover:bg-dark-light text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Filter size={16} className="mr-2" />
              Filters
              <ChevronDown size={16} className={`ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-dark-lighter rounded-lg p-4 mb-8 animate-fadeIn">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center">
                  <SlidersHorizontal size={16} className="mr-2 text-primary" />
                  Sort By
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeSort === option.value
                        ? "bg-primary text-white"
                        : "bg-dark-light text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-white font-semibold mb-4">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeFilters.genres.includes(genre.id)
                        ? "bg-primary text-white"
                        : "bg-dark-light text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => toggleGenreFilter(genre.id)}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-white font-semibold mb-4">Year Range</h3>
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">From</label>
                    <input
                      type="number"
                      min="1900"
                      max={activeFilters.yearTo}
                      value={activeFilters.yearFrom}
                      onChange={(e) => handleRangeFilterChange("yearFrom", Number.parseInt(e.target.value))}
                      className="bg-dark-light text-white text-sm rounded-lg p-2 w-24 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">To</label>
                    <input
                      type="number"
                      min={activeFilters.yearFrom}
                      max={new Date().getFullYear()}
                      value={activeFilters.yearTo}
                      onChange={(e) => handleRangeFilterChange("yearTo", Number.parseInt(e.target.value))}
                      className="bg-dark-light text-white text-sm rounded-lg p-2 w-24 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Rating Range</h3>
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">From</label>
                    <input
                      type="number"
                      min="0"
                      max={activeFilters.ratingTo}
                      step="0.5"
                      value={activeFilters.ratingFrom}
                      onChange={(e) => handleRangeFilterChange("ratingFrom", Number.parseFloat(e.target.value))}
                      className="bg-dark-light text-white text-sm rounded-lg p-2 w-24 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">To</label>
                    <input
                      type="number"
                      min={activeFilters.ratingFrom}
                      max="10"
                      step="0.5"
                      value={activeFilters.ratingTo}
                      onChange={(e) => handleRangeFilterChange("ratingTo", Number.parseFloat(e.target.value))}
                      className="bg-dark-light text-white text-sm rounded-lg p-2 w-24 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {error ? (
          <div className="bg-red-900/30 border border-red-500 text-white px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-400">
                  {filteredMovies.length} {filteredMovies.length === 1 ? "movie" : "movies"} found
                </p>
                {searchQuery && (
                  <p className="text-white text-sm mt-1">
                    Search results for: <span className="text-primary font-medium">"{searchQuery}"</span>
                  </p>
                )}
              </div>

              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="text-primary hover:text-primary-hover text-sm flex items-center"
                >
                  <X size={14} className="mr-1" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Movies Grid */}
            {filteredMovies.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-12 bg-dark-lighter rounded-lg">
                <div className="text-gray-400 text-lg mb-4">No movies found</div>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <button
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-medium transition-colors"
                  onClick={clearFilters}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} variant="compact" />
                ))}
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Load More Button */}
            {!loading && hasMore && filteredMovies.length > 0 && (
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

      {/* Movie Details Modal */}
      {selectedMovie && movieDetails && <MovieDetailsModal movie={movieDetails} onClose={handleCloseModal} />}
    </div>
  )
}

export default Explore

