"use client"
import { getPosterUrl } from "../services/api"
import { Star } from "lucide-react"

const MovieCard = ({ movie, onClick, variant = "default" }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(movie)
    }
  }

  // Compact variant for home page and sliders
  if (variant === "compact") {
    return (
      <div
        className="relative overflow-hidden rounded-md shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer bg-dark-lighter"
        onClick={handleClick}
      >
        <div className="aspect-[1/2] w-40">
          {movie.poster_path ? (
            <img
              src={getPosterUrl(movie.poster_path) || "/placeholder.svg"}
              alt={movie.title || movie.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-dark-light text-white p-1 text-center">
              <span className="text-xs font-medium">{movie.title || movie.name}</span>
            </div>
          )}
          <div className="absolute top-1 right-1 bg-black/70 text-yellow-500 text-xs font-bold px-1 py-0.5 rounded flex items-center">
            <Star size={8} className="mr-0.5" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </div>
        </div>
        <div className="p-1">
          <h3 className="text-white text-xs font-medium truncate text-[10px]">{movie.title || movie.name}</h3>
          {(movie.release_date || movie.first_air_date) && (
            <p className="text-gray-400 text-[9px]">
              {new Date(movie.release_date || movie.first_air_date).getFullYear()}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Default variant for other pages
  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer bg-dark-lighter"
      onClick={handleClick}
    >
      <div className="aspect-[2/3] w-full">
        {movie.poster_path ? (
          <img
            src={getPosterUrl(movie.poster_path) || "/placeholder.svg"}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-light text-white p-4 text-center">
            <span className="text-sm font-medium">{movie.title || movie.name}</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-dark-lighter">
        <h3 className="text-white font-semibold text-sm truncate">{movie.title || movie.name}</h3>
        <div className="flex justify-between items-center mt-1">
          {(movie.release_date || movie.first_air_date) && (
            <p className="text-gray-400 text-xs">
              {new Date(movie.release_date || movie.first_air_date).getFullYear()}
            </p>
          )}
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-gray-300 text-xs">{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCard

