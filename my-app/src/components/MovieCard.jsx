"use client"
import { getPosterUrl } from "../services/api"
import { Star } from "lucide-react"

const MovieCard = ({ movie, onClick, variant = "default" }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(movie)
    }
  }

  const releaseYear =
    movie.release_date || movie.first_air_date
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
          <div className="absolute top-1 right-1 flex items-center rounded-full bg-black/60 px-1 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
            <Star size={8} className="mr-0.5 text-yellow-400" fill="currentColor" />
            <span className="text-white">{rating}</span>
          </div>
        </div>
        <div className="absolute bottom-0 w-full p-1.5">
          <h3 className="text-[11px] font-medium text-white line-clamp-1">{title}</h3>
          {releaseYear && <p className="mt-0.5 text-[9px] text-gray-300">{releaseYear}</p>}
        </div>
      </div>
    )
  }

  // Default variant for other pages
  return (
    <div
      className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-gray-900"
      onClick={handleClick}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
      </div>
      <div className="absolute bottom-0 w-full transform bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 transition-all duration-300">
        <h3 className="text-sm font-medium text-white line-clamp-1">{title}</h3>
        <div className="mt-1 flex items-center justify-between">
          {releaseYear && <p className="text-xs text-gray-300">{releaseYear}</p>}
          <div className="flex items-center">
            <Star size={12} className="mr-1 text-yellow-400" fill="currentColor" />
            <span className="text-xs font-medium text-gray-200">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCard

