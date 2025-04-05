"use client"

import { useState, useEffect } from "react"
import { getBackdropUrl, getPosterUrl } from "../services/api"
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react"

const Hero = ({ fetchFunction, onMovieClick }) => {
  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const data = await fetchFunction()

        if (data && data.results) {
          // Filter movies with backdrop images
          const moviesWithBackdrops = data.results.filter((movie) => movie.backdrop_path)

          // Get the first 5 movies or fewer if less are available
          setMovies(moviesWithBackdrops.slice(0, 5))
        } else {
          setError("Failed to fetch movies for hero section")
        }
      } catch (err) {
        setError("An error occurred while fetching hero movies")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [fetchFunction])

  useEffect(() => {
    // Auto-rotate hero movies every 8 seconds
    const interval = setInterval(() => {
      if (movies.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex === movies.length - 1 ? 0 : prevIndex + 1))
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [movies])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === movies.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? movies.length - 1 : prevIndex - 1))
  }

  if (loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || movies.length === 0) {
    return null // Don't show hero if there's an error or no movies
  }

  const currentMovie = movies[currentIndex]

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Backdrop Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: `url(${getBackdropUrl(currentMovie.backdrop_path)})`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-4xl">
          {/* Poster (visible on medium screens and up) */}
          <div className="hidden md:block w-64 rounded-lg overflow-hidden shadow-2xl">
            <img
              src={getPosterUrl(currentMovie.poster_path) || "/placeholder.svg"}
              alt={currentMovie.title}
              className="w-full h-auto"
            />
          </div>

          {/* Info */}
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{currentMovie.title}</h1>

            <div className="flex items-center gap-4 mb-4">
              {currentMovie.release_date && (
                <span className="text-gray-300">{new Date(currentMovie.release_date).getFullYear()}</span>
              )}

              <span className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{currentMovie.vote_average.toFixed(1)}</span>
              </span>
            </div>

            <p className="text-gray-300 mb-6 line-clamp-3 md:line-clamp-4">{currentMovie.overview}</p>

            <div className="flex gap-4">
              <button
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-medium transition-colors"
                onClick={() => onMovieClick(currentMovie)}
              >
                <Play size={18} />
                Watch Now
              </button>
              <button
                className="flex items-center gap-2 bg-gray-700/80 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
                onClick={() => onMovieClick(currentMovie)}
              >
                <Info size={18} />
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {movies.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            onClick={prevSlide}
            aria-label="Previous movie"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            onClick={nextSlide}
            aria-label="Next movie"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-primary w-6" : "bg-gray-400/50"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero

