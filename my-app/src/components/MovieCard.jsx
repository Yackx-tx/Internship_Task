"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import MovieDetailsModal from "./MovieDetailsModal"

export default function MovieCard({ movie }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleClick = () => {
    setShowModal(true)
  }

  return (
    <>
      <div
        className="relative group cursor-pointer rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Movie Poster */}
        <div className="aspect-[2/3] w-full overflow-hidden rounded-lg">
          <img
            src={movie.posterUrl || "/placeholder.svg?height=450&width=300"}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <button className="bg-primary/90 rounded-full p-3 transform transition-transform duration-300 hover:scale-110">
            <Play size={24} className="text-white" />
          </button>
        </div>

        {/* Movie Info */}
        <div className="mt-2">
          <h3 className="text-sm font-medium line-clamp-1">{movie.title}</h3>
          <div className="flex items-center text-xs text-gray-400 mt-1">
            <span>{movie.year || "2023"}</span>
            {movie.duration && movie.duration !== "N/A" && (
              <>
                <span className="mx-2">•</span>
                <span>{movie.duration}</span>
              </>
            )}
            {movie.rating && (
              <>
                <span className="mx-2">•</span>
                <span>⭐ {movie.rating}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Movie Details Modal */}
      <MovieDetailsModal movieId={movie.id} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

