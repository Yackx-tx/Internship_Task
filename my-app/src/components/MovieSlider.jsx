"use client"

import { useState, useEffect, useRef } from "react"
import MovieCard from "./MovieCard"
import { ChevronLeft, ChevronRight, Filter, SortAsc, SortDesc } from "lucide-react"

const MovieSlider = ({ title, fetchFunction, onMovieClick }) => {
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [watchlist, setWatchlist] = useState([])
  const [sortOrder, setSortOrder] = useState("popularity")
  const [showFilters, setShowFilters] = useState(false)
  const [genreFilter, setGenreFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const sliderRef = useRef(null)

  // Load watchlist from localStorage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("movieWatchlist")
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist))
      } catch (e) {
        console.error("Error parsing watchlist from localStorage", e)
      }
    }
  }, [])

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const data = await fetchFunction()

        if (data && data.results) {
          // Get more movies (up to 20)
          setMovies(data.results.slice(0, 20))
          setFilteredMovies(data.results.slice(0, 20))
        } else {
          setError(`Failed to fetch ${title} movies`)
        }
      } catch (err) {
        setError(`An error occurred while fetching ${title} movies`)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [fetchFunction, title])

  // Apply filters and sorting
  useEffect(() => {
    if (movies.length === 0) return

    let result = [...movies]

    // Apply genre filter
    if (genreFilter !== "all") {
      result = result.filter((movie) => movie.genre_ids && movie.genre_ids.includes(Number.parseInt(genreFilter)))
    }

    // Apply year filter
    if (yearFilter !== "all") {
      const year = Number.parseInt(yearFilter)
      result = result.filter((movie) => {
        const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null
        return movieYear === year
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOrder) {
        case "popularity":
          return b.popularity - a.popularity
        case "rating":
          return b.vote_average - a.vote_average
        case "release_date":
          return new Date(b.release_date || "1900") - new Date(a.release_date || "1900")
        case "title":
          return (a.title || a.name || "").localeCompare(b.title || b.name || "")
        default:
          return 0
      }
    })

    setFilteredMovies(result)
  }, [movies, sortOrder, genreFilter, yearFilter])

  const scrollLeft = () => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.8
      sliderRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.8
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Handle adding/removing from watchlist
  const handleWatchlist = (movie) => {
    const isInWatchlist = watchlist.some((item) => item.id === movie.id)
    let newWatchlist

    if (isInWatchlist) {
      newWatchlist = watchlist.filter((item) => item.id !== movie.id)
    } else {
      newWatchlist = [...watchlist, movie]
    }

    setWatchlist(newWatchlist)
    localStorage.setItem("movieWatchlist", JSON.stringify(newWatchlist))
  }

  // Get unique years from movies
  const getYears = () => {
    const years = movies
      .map((movie) => (movie.release_date ? new Date(movie.release_date).getFullYear() : null))
      .filter((year) => year !== null)

    return [...new Set(years)].sort((a, b) => b - a) // Sort descending
  }

  // Get unique genres from movies
  const getGenres = () => {
    // This is a simplified version - in a real app you'd have a genres mapping
    const genreMap = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Science Fiction",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    }

    const genreIds = new Set()
    movies.forEach((movie) => {
      if (movie.genre_ids) {
        movie.genre_ids.forEach((id) => genreIds.add(id))
      }
    })

    return Array.from(genreIds).map((id) => ({
      id,
      name: genreMap[id] || `Genre ${id}`,
    }))
  }

  if (loading) {
    return (
      <div className="py-4">
        <h2 className="text-white text-xl font-semibold mb-2 px-4">{title}</h2>
        <div className="flex gap-2 px-4 overflow-hidden">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="min-w-[160px] h-[240px] bg-gray-800 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !movies || movies.length === 0) {
    return null
  }

  return (
    <div className="py-4 relative group">
      <div className="flex items-center justify-between mb-3 px-4">
        <h2 className="text-white text-xl font-semibold">{title}</h2>

        <div className="flex items-center gap-2">
          {/* Sort button */}
          <div className="relative">
            <button
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              onClick={() => {
                const orders = ["popularity", "rating", "release_date", "title"]
                const currentIndex = orders.indexOf(sortOrder)
                const nextIndex = (currentIndex + 1) % orders.length
                setSortOrder(orders[nextIndex])
              }}
              title={`Sort by ${sortOrder}`}
            >
              {sortOrder === "title" ? <SortAsc size={18} /> : <SortDesc size={18} />}
            </button>
            <div className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
              {sortOrder === "popularity"
                ? "P"
                : sortOrder === "rating"
                  ? "R"
                  : sortOrder === "release_date"
                    ? "D"
                    : "T"}
            </div>
          </div>

          {/* Filter button */}
          <div className="relative">
            <button
              className={`p-2 rounded-full ${
                genreFilter !== "all" || yearFilter !== "all"
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              } transition-colors`}
              onClick={() => setShowFilters(!showFilters)}
              title="Filter movies"
            >
              <Filter size={18} />
            </button>

            {/* Filter dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-20 p-3">
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Genre</label>
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="w-full bg-gray-700 text-white text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="all">All Genres</option>
                    {getGenres().map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Year</label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full bg-gray-700 text-white text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="all">All Years</option>
                    {getYears().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="w-full bg-red-600 text-white text-sm font-medium rounded-md py-1 hover:bg-red-700 transition-colors"
                  onClick={() => {
                    setGenreFilter("all")
                    setYearFilter("all")
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-black/90"
          onClick={scrollLeft}
          disabled={loading}
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <div key={movie.id} className="w-[160px] flex-shrink-0 snap-start">
                <MovieCard
                  movie={movie}
                  onClick={onMovieClick}
                  variant="compact"
                  onAddToWatchlist={handleWatchlist}
                  isInWatchlist={watchlist.some((item) => item.id === movie.id)}
                />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-40 text-gray-500">
              No movies match your filters
            </div>
          )}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-black/90"
          onClick={scrollRight}
          disabled={loading}
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default MovieSlider

