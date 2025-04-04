"use client"

import { useState, useEffect } from "react"
import { X, Clock, Star, Calendar, Award, User, Film } from "lucide-react"
import { fetchMovieById } from "../services/api"

export default function MovieDetailsModal({ movieId, isOpen, onClose }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!movieId || !isOpen) return

      setLoading(true)
      try {
        // Fetch movie details
        const movieData = await fetchMovieById(movieId)
        setMovie(movieData)
      } catch (error) {
        console.error("Error fetching movie details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieData()
  }, [movieId, isOpen])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black shadow-2xl transition-all duration-300 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-red-950 hover:text-white"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="flex h-[600px] flex-col items-center justify-center space-y-4 p-8">
            <div className="h-16 w-16 animate-pulse rounded-full border-4 border-gray-700 border-t-red-500"></div>
            <p className="text-gray-400">Loading movie details...</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Left side - Poster */}
            <div className="relative w-full md:w-2/5">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80 md:hidden"></div>
                <img
                  src={movie?.posterUrl || "/placeholder.svg?height=600&width=400"}
                  alt={movie?.title}
                  className="h-full w-full object-cover md:rounded-l-xl"
                />

                {/* Rating badge */}
                {movie?.rating && (
                  <div className="absolute right-4 top-4 flex items-center rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-sm md:left-4 md:right-auto">
                    <Star size={16} className="mr-1 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium text-yellow-500">{movie.rating}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Content */}
            <div className="flex w-full flex-col justify-between md:w-3/5">
              {/* Movie details */}
              <div className="space-y-6 p-6 md:p-8">
                <div>
                  <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">{movie?.title}</h2>

                  <div className="flex flex-wrap gap-3">
                    {movie?.year && (
                      <span className="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">
                        <Calendar size={12} className="mr-1" />
                        {movie.year}
                      </span>
                    )}
                    {movie?.duration && movie.duration !== "N/A" && (
                      <span className="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">
                        <Clock size={12} className="mr-1" />
                        {movie.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Genre tags */}
                {movie?.genre && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.split(", ").map((genre, index) => (
                      <span
                        key={index}
                        className="inline-block rounded-md bg-red-900/40 px-2.5 py-1 text-xs font-medium text-red-200"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Plot */}
                {movie?.plot && (
                  <div>
                    <h3 className="mb-2 text-lg font-medium text-white">Synopsis</h3>
                    <p className="text-gray-300 leading-relaxed">{movie.plot}</p>
                  </div>
                )}

                {/* Cast & Crew */}
                <div className="grid gap-6 md:grid-cols-2">
                  {movie?.director && movie.director !== "N/A" && (
                    <div>
                      <h3 className="mb-2 flex items-center text-sm font-medium uppercase tracking-wider text-gray-400">
                        <Film size={16} className="mr-2" />
                        Director
                      </h3>
                      <p className="text-white">{movie.director}</p>
                    </div>
                  )}

                  {movie?.actors && movie.actors !== "N/A" && (
                    <div>
                      <h3 className="mb-2 flex items-center text-sm font-medium uppercase tracking-wider text-gray-400">
                        <User size={16} className="mr-2" />
                        Cast
                      </h3>
                      <p className="text-white">{movie.actors}</p>
                    </div>
                  )}
                </div>

                {/* Awards */}
                {movie?.awards && movie.awards !== "N/A" && (
                  <div>
                    <h3 className="mb-2 flex items-center text-sm font-medium uppercase tracking-wider text-gray-400">
                      <Award size={16} className="mr-2" />
                      Awards
                    </h3>
                    <p className="text-white">{movie.awards}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

