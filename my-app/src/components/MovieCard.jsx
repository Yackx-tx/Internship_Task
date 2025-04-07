"use client"
import { useState } from "react"
import { getPosterUrl } from "../services/api"
import { Star, Heart, PlayCircle, Plus, Check, Info, X } from 'lucide-react'

const MovieCard = ({ movie, onClick, variant = "default", onAddToWatchlist, isInWatchlist = false }) => {
  const [isHovering, setIsHovering] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  
  const handleClick = (e) => {
    // Only trigger the main click if not clicking on action buttons
    if (!e.target.closest('.card-action-btn')) {
      if (onClick) {
        onClick(movie)
      }
    }
  }
  
  const handleAddToWatchlist = (e) => {
    e.stopPropagation()
    if (onAddToWatchlist) {
      onAddToWatchlist(movie)
    }
  }
  
  const handleQuickView = (e) => {
    e.stopPropagation()
    setShowQuickView(true)
  }
  
  const handlePlayTrailer = (e) => {
    e.stopPropagation()
    // This would typically open a mini-player or trigger the trailer in the parent
    if (movie.videos?.results?.length > 0) {
      const trailer = movie.videos.results.find(v => v.type === "Trailer") || movie.videos.results[0]
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')
    }
  }

  const releaseYear = movie.release_date || movie.first_air_date
    ? new Date(movie.release_date || movie.first_air_date).getFullYear()
    : null

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
  const title = movie.title || movie.name || "Untitled"
  const posterUrl = movie.poster_path ? getPosterUrl(movie.poster_path) : null

  // Compact variant for sliders - smaller to fit at least 5 per row
  if (variant === "compact") {
    return (
      <div
        className="group relative overflow-hidden rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer bg-gray-900"
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ width: "100%", maxWidth: "160px" }}
      >
        <div className="aspect-[2/3] w-full overflow-hidden">
          {posterUrl ? (
            <img
              src={posterUrl || "/placeholder.svg"}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-800 p-2 text-center">
              <span className="text-xs font-medium text-gray-200 line-clamp-3">{title}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
          
          {/* Rating badge */}
          <div className="absolute top-1 right-1 flex items-center rounded-full bg-black/60 px-1 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
            <Star size={8} className="mr-0.5 text-yellow-400" fill="currentColor" />
            <span className="text-white">{rating}</span>
          </div>
          
          {/* Action buttons that appear on hover */}
          {isHovering && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                className="card-action-btn rounded-full bg-red-600 p-2 text-white hover:bg-red-700 transition-colors"
                onClick={handlePlayTrailer}
                aria-label="Play trailer"
              >
                <PlayCircle size={20} />
              </button>
              <button 
                className="card-action-btn rounded-full bg-gray-700 p-2 text-white hover:bg-gray-600 transition-colors"
                onClick={handleAddToWatchlist}
                aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              >
                {isInWatchlist ? <Check size={20} /> : <Plus size={20} />}
              </button>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 w-full p-1.5">
          <h3 className="text-[11px] font-medium text-white line-clamp-1">{title}</h3>
          {releaseYear && (
            <p className="mt-0.5 text-[9px] text-gray-300">{releaseYear}</p>
          )}
        </div>
      </div>
    )
  }

  // Default variant for other pages
  return (
    <div
      className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-gray-900"
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-800 p-4 text-center">
            <span className="text-sm font-medium text-gray-200">{title}</span>
          </div>
        )}
        
        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-3">
          <div className="flex justify-end">
            <button 
              className="card-action-btn rounded-full bg-gray-800/80 p-1.5 text-white hover:bg-gray-700 transition-colors backdrop-blur-sm"
              onClick={handleAddToWatchlist}
              aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {isInWatchlist ? 
                <Check size={16} className="text-green-400" /> : 
                <Plus size={16} />
              }
            </button>
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              className="card-action-btn w-full rounded-md bg-red-600 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
              onClick={handlePlayTrailer}
            >
              <PlayCircle size={14} />
              <span>Play Trailer</span>
            </button>
            
            <button 
              className="card-action-btn w-full rounded-md bg-gray-700/80 py-1.5 text-xs font-medium text-white hover:bg-gray-600 transition-colors flex items-center justify-center gap-1 backdrop-blur-sm"
              onClick={handleQuickView}
            >
              <Info size={14} />
              <span>Quick View</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Card info */}
      <div className="absolute bottom-0 w-full transform bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 transition-all duration-300">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium text-white line-clamp-1">{title}</h3>
          <button 
            className="card-action-btn ml-1 text-gray-400 hover:text-red-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              // Toggle favorite status
            }}
          >
            <Heart size={14} className={`${isInWatchlist ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between">
          {releaseYear && (
            <p className="text-xs text-gray-300">{releaseYear}</p>
          )}
          <div className="flex items-center">
            <Star size={12} className="mr-1 text-yellow-400" fill="currentColor" />
            <span className="text-xs font-medium text-gray-200">{rating}</span>
          </div>
        </div>
      </div>
      
      {/* Quick view popup */}
      {showQuickView && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowQuickView(false)}
        >
          <div 
            className="relative max-w-md w-full bg-gray-900 rounded-lg p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white"
              onClick={() => setShowQuickView(false)}
            >
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            {movie.overview && (
              <p className="text-sm text-gray-300 mb-3 line-clamp-3">{movie.overview}</p>
            )}
            <div className="flex justify-between">
              <button 
                className="rounded-md bg-gray-800 px-3 py-1.5 text-xs text-white"
                onClick={() => {
                  setShowQuickView(false)
                  if (onClick) onClick(movie)
                }}
              >
                More Details
              </button>
              <button 
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs text-white flex items-center gap-1"
                onClick={handlePlayTrailer}
              >
                <PlayCircle size={14} />
                Play Trailer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieCard
