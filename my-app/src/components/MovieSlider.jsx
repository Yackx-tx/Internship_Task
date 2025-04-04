"use client"

import { useState, useEffect, useRef } from "react"
import MovieCard from "./MovieCard"
import { ChevronLeft, ChevronRight } from "lucide-react"

const MovieSlider = ({ title, fetchFunction, onMovieClick }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const sliderRef = useRef(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const data = await fetchFunction()

        if (data && data.results) {
          // Get more movies (up to 20)
          setMovies(data.results.slice(0, 20))
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

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -800,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 800,
        behavior: "smooth",
      })
    }
  }

  if (loading) {
    return (
      <div className="py-4">
        <h2 className="text-white text-xl font-semibold mb-2 px-4">{title}</h2>
        <div className="flex gap-2 px-4 overflow-hidden">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="min-w-[80px] h-[140px] bg-dark-light animate-pulse rounded-md" />
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
      <div className="flex items-center justify-between mb-2 px-4">
        <h2 className="text-white text-xl font-semibold">{title}</h2>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        <button
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
          onClick={scrollLeft}
          disabled={loading}
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="min-w-[80px] snap-start" style={{ flex: "0 0 auto" }}>
              <MovieCard movie={movie} onClick={onMovieClick} variant="compact" />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
          onClick={scrollRight}
          disabled={loading}
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default MovieSlider

