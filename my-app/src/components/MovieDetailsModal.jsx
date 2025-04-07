"use client"
import { useState, useEffect, useRef } from "react"
import { getBackdropUrl, getPosterUrl, getMovieVideos, getSimilarMovies, getMovieCredits } from "../services/api"
import MovieCard from "./MovieCard"
import {
  X,
  Star,
  Clock,
  Calendar,
  Film,
  User,
  Share2,
  Plus,
  Check,
  Bookmark,
  ExternalLink,
  Facebook,
  Twitter,
  Link,
} from "lucide-react"

const MovieDetailsModal = ({ movie, onClose, onAddToWatchlist, isInWatchlist = false }) => {
  const [videos, setVideos] = useState([])
  const [similarMovies, setSimilarMovies] = useState([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [userRating, setUserRating] = useState(0)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [fullCast, setFullCast] = useState([])
  const [isFullCastLoaded, setIsFullCastLoaded] = useState(false)

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

  // Load full cast when needed
  const loadFullCast = async () => {
    if (!isFullCastLoaded && movie.id) {
      try {
        const data = await getMovieCredits(movie.id)
        if (data && data.cast) {
          setFullCast(data.cast)
          setIsFullCastLoaded(true)
        }
      } catch (err) {
        console.error("Error fetching full cast:", err)
      }
    }
  }

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

  // Handle user rating
  const handleRatingClick = (rating) => {
    setUserRating(rating)
    // Here you would typically send this rating to your backend
    console.log(`User rated ${movie.title} as ${rating}/5`)
  }

  // Handle share
  const handleShare = (platform) => {
    const movieTitle = encodeURIComponent(movie.title || movie.name)
    const movieUrl = encodeURIComponent(`https://yourmovieapp.com/movie/${movie.id}`)

    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${movieUrl}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=Check out ${movieTitle}&url=${movieUrl}`
        break
      case "copy":
        navigator.clipboard.writeText(`https://yourmovieapp.com/movie/${movie.id}`)
        alert("Link copied to clipboard!")
        setShowShareOptions(false)
        return
      default:
        return
    }

    window.open(shareUrl, "_blank", "width=600,height=400")
    setShowShareOptions(false)
  }

  // Handle watchlist
  const handleAddToWatchlist = () => {
    if (onAddToWatchlist) {
      onAddToWatchlist(movie)
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

              {/* Action buttons on poster */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                <button
                  className="rounded-full bg-black/70 p-2 text-white hover:bg-black/90 transition-colors"
                  onClick={handleAddToWatchlist}
                >
                  {isInWatchlist ? <Check size={16} className="text-green-400" /> : <Plus size={16} />}
                </button>

                <button
                  className="rounded-full bg-black/70 p-2 text-white hover:bg-black/90 transition-colors"
                  onClick={() => setShowShareOptions(!showShareOptions)}
                >
                  <Share2 size={16} />
                </button>
              </div>

              {/* Share options popup */}
              {showShareOptions && (
                <div className="absolute -right-2 -top-2 bg-gray-800 rounded-lg shadow-xl p-2 z-20">
                  <button
                    className="block p-2 hover:bg-gray-700 rounded-lg w-full text-left text-sm text-white flex items-center gap-2"
                    onClick={() => handleShare("facebook")}
                  >
                    <Facebook size={16} className="text-blue-500" />
                    Facebook
                  </button>
                  <button
                    className="block p-2 hover:bg-gray-700 rounded-lg w-full text-left text-sm text-white flex items-center gap-2"
                    onClick={() => handleShare("twitter")}
                  >
                    <Twitter size={16} className="text-sky-500" />
                    Twitter
                  </button>
                  <button
                    className="block p-2 hover:bg-gray-700 rounded-lg w-full text-left text-sm text-white flex items-center gap-2"
                    onClick={() => handleShare("copy")}
                  >
                    <Link size={16} className="text-gray-400" />
                    Copy Link
                  </button>
                  <button
                    className="absolute -top-1 -right-1 bg-gray-900 rounded-full p-1 text-gray-400 hover:text-white"
                    onClick={() => setShowShareOptions(false)}
                  >
                    <X size={14} />
                  </button>
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

              {/* User rating */}
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-1">Rate this movie:</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      className={`rounded-full p-1 transition-colors ${
                        userRating >= star ? "text-yellow-400" : "text-gray-600 hover:text-gray-400"
                      }`}
                    >
                      <Star size={16} fill={userRating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-2">
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    <Film size={16} />
                    Watch Trailer
                  </a>
                )}

                <button
                  onClick={handleAddToWatchlist}
                  className="flex items-center gap-1 rounded-md bg-gray-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-600 transition-colors"
                >
                  {isInWatchlist ? <Check size={16} /> : <Bookmark size={16} />}
                  {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </button>

                {movie.homepage && (
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20 border-b border-gray-800 px-6 md:mt-8">
          <div className="flex space-x-4 -mb-px">
            <button
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-red-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "cast"
                  ? "border-red-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
              }`}
              onClick={() => {
                setActiveTab("cast")
                loadFullCast()
              }}
            >
              Cast & Crew
            </button>
            <button
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "videos"
                  ? "border-red-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
              }`}
              onClick={() => setActiveTab("videos")}
            >
              Videos
            </button>
            <button
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "similar"
                  ? "border-red-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
              }`}
              onClick={() => setActiveTab("similar")}
            >
              Similar
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Overview */}
              {movie.overview && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">Overview</h3>
                  <p className="text-sm leading-relaxed text-gray-300">{movie.overview}</p>
                </div>
              )}

              {/* Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {movie.status && (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Status</span>
                      <span className="text-sm text-white">{movie.status}</span>
                    </div>
                  )}
                  {movie.original_language && (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Original Language</span>
                      <span className="text-sm text-white">
                        {new Intl.DisplayNames(["en"], { type: "language" }).of(movie.original_language)}
                      </span>
                    </div>
                  )}
                  {movie.budget > 0 && (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Budget</span>
                      <span className="text-sm text-white">${movie.budget.toLocaleString()}</span>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Revenue</span>
                      <span className="text-sm text-white">${movie.revenue.toLocaleString()}</span>
                    </div>
                  )}
                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Production</span>
                      <span className="text-sm text-white">
                        {movie.production_companies.map((company) => company.name).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Featured trailer */}
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
            </div>
          )}

          {/* Cast Tab */}
          {activeTab === "cast" && (
            <div className="space-y-6">
              {/* Director */}
              {director && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-white">Director</h3>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-3">
                    <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      {director.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${director.profile_path}`}
                          alt={director.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User size={24} className="text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{director.name}</p>
                      <p className="text-xs text-gray-400">Director</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cast */}
              {(isFullCastLoaded ? fullCast : cast).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-white">Cast</h3>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {(isFullCastLoaded ? fullCast : cast).map((person) => (
                      <div key={person.id} className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-3">
                        <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          {person.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                              alt={person.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User size={24} className="text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{person.name}</p>
                          <p className="text-xs text-gray-400">{person.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!isFullCastLoaded && cast.length > 0 && (
                    <button
                      className="mt-2 text-sm text-gray-400 hover:text-white transition-colors"
                      onClick={loadFullCast}
                    >
                      View Full Cast
                    </button>
                  )}
                </div>
              )}

              {/* Crew */}
              {movie.credits?.crew && movie.credits.crew.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-white">Key Crew</h3>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {movie.credits.crew
                      .filter((person) =>
                        ["Producer", "Executive Producer", "Writer", "Screenplay", "Director of Photography"].includes(
                          person.job,
                        ),
                      )
                      .slice(0, 6)
                      .map((person) => (
                        <div
                          key={`${person.id}-${person.job}`}
                          className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-3"
                        >
                          <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                            {person.profile_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                                alt={person.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User size={24} className="text-gray-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{person.name}</p>
                            <p className="text-xs text-gray-400">{person.job}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div className="space-y-6">
              {videos.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {videos.map((video) => (
                    <div key={video.id} className="space-y-2">
                      <div className="overflow-hidden rounded-lg bg-black shadow-lg">
                        <div className="aspect-video w-full">
                          <iframe
                            src={`https://www.youtube.com/embed/${video.key}`}
                            title={video.name}
                            className="h-full w-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{video.name}</h4>
                        <p className="text-xs text-gray-400">{video.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-500">No videos available</div>
              )}
            </div>
          )}

          {/* Similar Tab */}
          {activeTab === "similar" && (
            <div className="space-y-6">
              {similarMovies.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {similarMovies.map((similarMovie) => (
                    <MovieCard
                      key={similarMovie.id}
                      movie={similarMovie}
                      onClick={(movie) => {
                        onClose()
                        // You would typically handle navigation to the new movie here
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-500">No similar movies found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetailsModal

