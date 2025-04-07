"use client"
import { useState, useEffect, useRef } from "react"
import { getBackdropUrl, getPosterUrl, getMovieVideos, getSimilarMovies } from "../services/api"
import MovieCard from "./MovieCard"
import { X, Star, Clock, Calendar, Film, User, Users, ChevronLeft, ChevronRight } from "lucide-react"

const MovieDetailsModal = ({ movie, onClose }) => {
  const [videos, setVideos] = useState([])
  const [similarMovies, setSimilarMovies] = useState([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const similarMoviesRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
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
      } else if (movie.videos && movie.videos.results) {
        setVideos(movie.videos.results)
      }
    }

    const fetchSimilarMovies = async () => {
      if (!movie.similar && !movie.recommendations) {
        try {
          const data = await getSimilarMovies(movie.id)
          if (data && data.results) {
            setSimilarMovies(data.results.slice(0, 8))
          }
        } catch (err) {
          console.error("Error fetching similar movies:", err)
        }
      } else if (movie.similar && movie.similar.results) {
        setSimilarMovies(movie.similar.results.slice(0, 8))
      } else if (movie.recommendations && movie.recommendations.results) {
        setSimilarMovies(movie.recommendations.results.slice(0, 8))
      }
    }

    fetchVideos()
    fetchSimilarMovies()

    // Prevent scrolling of the body when modal is open
    document.body.style.overflow = "hidden"

    // Handle escape key to close modal
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)

    // Handle click outside to close
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.body.style.overflow = "auto"
      document.removeEventListener("keydown", handleEscapeKey)
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [movie, onClose])

  // Find trailer or first video
  const trailer =
    videos.find((video) => video.type === "Trailer" && video.site === "YouTube") ||
    videos.find((video) => video.site === "YouTube")

  // Get director and cast
  const director = movie.credits?.crew?.find((person) => person.job === "Director")
  const cast = movie.credits?.cast?.slice(0, 5) || []

  // Format runtime
  const formatRuntime = (minutes) => {
    if (!minutes) return null
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Handle similar movies scrolling
  const scrollSimilarMovies = (direction) => {
    if (similarMoviesRef.current) {
      const { scrollWidth, clientWidth } = similarMoviesRef.current
      const maxScroll = scrollWidth - clientWidth
      const scrollAmount = clientWidth / 2

      let newPosition = direction === "right" ? scrollPosition + scrollAmount : scrollPosition - scrollAmount

      newPosition = Math.max(0, Math.min(newPosition, maxScroll))

      similarMoviesRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })

      setScrollPosition(newPosition)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/20"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Backdrop Header */}
        <div className="relative">
          <div
            className="h-[250px] w-full bg-cover bg-center sm:h-[350px] md:h-[400px]"
            style={{
              backgroundImage: movie.backdrop_path
                ? `url(${getBackdropUrl(movie.backdrop_path)})`
                : "linear-gradient(to bottom, #1a1a2e, #16213e)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-start gap-6 p-6 md:flex-row">
            {/* Poster */}
            <div className="relative z-10 -mb-20 h-auto w-32 shrink-0 overflow-hidden rounded-lg shadow-2xl sm:w-40 md:mb-0 md:w-48 lg:w-56">
              {movie.poster_path ? (
                <img
                  src={getPosterUrl(movie.poster_path) || "/placeholder.svg"}
                  alt={movie.title || movie.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[2/3] w-full items-center justify-center bg-gray-800 p-4">
                  <span className="text-center text-sm font-medium text-white">{movie.title || movie.name}</span>
                </div>
              )}
            </div>

            {/* Movie Info */}
            <div className="z-10 pt-2 text-white md:pt-0">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">{movie.title || movie.name}</h2>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {movie.release_date && (
                  <div className="flex items-center text-gray-300">
                    <Calendar size={14} className="mr-1.5" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                )}

                {movie.runtime && (
                  <div className="flex items-center text-gray-300">
                    <Clock size={14} className="mr-1.5" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}

                {movie.vote_average > 0 && (
                  <div className="flex items-center">
                    <Star size={14} className="mr-1.5 text-yellow-400" fill="currentColor" />
                    <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-gray-800/80 px-2.5 py-0.5 text-xs font-medium text-gray-200 backdrop-blur-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-20 space-y-8 p-6 pt-4 md:mt-8">
          {/* Overview */}
          {movie.overview && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">Overview</h3>
              <p className="text-sm leading-relaxed text-gray-300">{movie.overview}</p>
            </div>
          )}

          {/* Cast & Crew */}
          {(director || cast.length > 0) && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-white">Cast & Crew</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {director && (
                  <div className="flex items-center gap-2 rounded-lg bg-gray-800/50 p-3">
                    <User size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-400">Director</p>
                      <p className="text-sm font-medium text-white">{director.name}</p>
                    </div>
                  </div>
                )}

                {cast.length > 0 && (
                  <div className="flex items-start gap-2 rounded-lg bg-gray-800/50 p-3">
                    <Users size={18} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-400">Cast</p>
                      <p className="text-sm text-white">{cast.map((person) => person.name).join(", ")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Trailer */}
          {trailer && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-lg font-medium text-white">
                <Film size={18} className="text-gray-400" />
                Trailer
              </h3>
              <div className="overflow-hidden rounded-lg bg-black shadow-lg">
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={trailer.name || "Trailer"}
                    className="h-full w-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">You May Also Like</h3>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scrollSimilarMovies("left")}
                    className="rounded-full bg-gray-800/80 p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white disabled:opacity-40"
                    disabled={scrollPosition <= 0}
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => scrollSimilarMovies("right")}
                    className="rounded-full bg-gray-800/80 p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div
                ref={similarMoviesRef}
                className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {similarMovies.map((similarMovie) => (
                  <div key={similarMovie.id} className="w-[140px] flex-shrink-0 sm:w-[160px]">
                    <MovieCard
                      movie={similarMovie}
                      variant="compact"
                      onClick={(movie) => {
                        onClose()
                        // You would typically handle navigation to the new movie here
                      }}
                    />
                  </div>
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

