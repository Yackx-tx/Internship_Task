"use client"

import { useEffect, useState } from "react"
import { getBackdropUrl, getPosterUrl, getMovieVideos, getSimilarMovies } from "../services/api"
import MovieCard from "./MovieCard"
import { X, Star, Clock, Calendar, Film } from "lucide-react"

const MovieDetailsModal = ({ movie, onClose }) => {
  const [videos, setVideos] = useState([])
  const [similarMovies, setSimilarMovies] = useState([])

  useEffect(() => {
    // Fetch videos if they're not included in the movie object
    const fetchVideos = async () => {
      if (!movie.videos) {
        try {
          const data = await getMovieVideos(movie.id)
          if (data && data.results) {
            setVideos(data.results)
          }
        } catch (err) {
          console.error("Error fetching videos:", err)
        }
      } else if (movie.videos.results) {
        setVideos(movie.videos.results)
      }
    }

    // Fetch similar movies if they're not included in the movie object
    const fetchSimilarMovies = async () => {
      if (!movie.similar && !movie.recommendations) {
        try {
          const data = await getSimilarMovies(movie.id)
          if (data && data.results) {
            setSimilarMovies(data.results.slice(0, 6))
          }
        } catch (err) {
          console.error("Error fetching similar movies:", err)
        }
      } else if (movie.similar && movie.similar.results) {
        setSimilarMovies(movie.similar.results.slice(0, 6))
      } else if (movie.recommendations && movie.recommendations.results) {
        setSimilarMovies(movie.recommendations.results.slice(0, 6))
      }
    }

    fetchVideos()
    fetchSimilarMovies()

    // Prevent scrolling of the body when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [movie])

  // Find trailer or first video
  const trailer =
    videos.find((video) => video.type === "Trailer" && video.site === "YouTube") ||
    videos.find((video) => video.site === "YouTube")

  // Get director and top cast
  const director = movie.credits?.crew?.find((person) => person.job === "Director")

  const cast = movie.credits?.cast?.slice(0, 5) || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-dark-lighter rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Backdrop Header */}
        <div
          className="relative h-[300px] md:h-[400px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-lighter via-dark-lighter/80 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="w-32 md:w-48 shrink-0 rounded-lg overflow-hidden shadow-lg">
              {movie.poster_path ? (
                <img
                  src={getPosterUrl(movie.poster_path) || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full aspect-[2/3] flex items-center justify-center bg-dark-light text-white">
                  <span>{movie.title}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{movie.title}</h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                {movie.release_date && (
                  <div className="flex items-center text-gray-300">
                    <Calendar size={16} className="mr-1" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                )}

                {movie.runtime && (
                  <div className="flex items-center text-gray-300">
                    <Clock size={16} className="mr-1" />
                    <span>
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  </div>
                )}

                <div className="flex items-center text-gray-300">
                  <Star size={16} className="mr-1 text-yellow-500" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>

              {movie.genres && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="px-2 py-1 bg-dark-light rounded-full text-xs text-gray-300">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overview */}
          <div className="mb-8">
            <h3 className="text-white text-lg font-semibold mb-2">Overview</h3>
            <p className="text-gray-300">{movie.overview}</p>
          </div>

          {/* Cast & Crew */}
          {(director || cast.length > 0) && (
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold mb-2">Cast & Crew</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {director && (
                  <div className="text-gray-300">
                    <span className="font-medium">Director:</span> {director.name}
                  </div>
                )}

                {cast.length > 0 && (
                  <div className="text-gray-300">
                    <span className="font-medium">Cast:</span> {cast.map((person) => person.name).join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Trailer */}
          {trailer && (
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                <Film size={18} className="mr-2" />
                Trailer
              </h3>
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.name}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">You May Also Like</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {similarMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => {
                      onClose()
                      // You would typically handle this by updating the selected movie
                      // in the parent component
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetailsModal

