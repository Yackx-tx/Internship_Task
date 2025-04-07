"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import MovieCard from "./MovieCard"
import SectionHeader from "./SectionHeader"

export default function MovieSection({ title, movies }) {
  const [showAll, setShowAll] = useState(false)
  const sliderRef = useRef(null)

  const handleSeeMoreClick = () => {
    setShowAll(true)
  }

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { current } = sliderRef
      const scrollAmount = direction === "left" ? -current.offsetWidth / 2 : current.offsetWidth / 2
      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="container mx-auto px-6 py-8 relative">
      {/* Decorative background elements */}
      <div className="absolute -top-10 right-10 opacity-10">
        <Sparkles size={80} className="text-purple-500" />
      </div>
      <div className="absolute -bottom-10 left-20 opacity-5">
        <Sparkles size={100} className="text-red-500" />
      </div>

      {/* Enhanced section header */}
      <SectionHeader title={title} onSeeMoreClick={!showAll ? handleSeeMoreClick : null} />

      {showAll ? (
        // Grid view showing all movies
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 relative">
          {/* Decorative corner elements */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-red-500/30 rounded-tl-lg"></div>
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-purple-600/30 rounded-tr-lg"></div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-purple-600/30 rounded-bl-lg"></div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-red-500/30 rounded-br-lg"></div>

          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        // Slider view showing movies in a scrollable container
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 p-2 rounded-full text-white transition-all duration-300 shadow-lg shadow-red-500/20"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            ref={sliderRef}
            className="flex overflow-x-auto space-x-6 pb-6 pt-2 scrollbar-hide snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className="flex-none w-[180px] snap-start"
                style={{
                  transform: `translateY(${index % 2 === 0 ? "0px" : "10px"})`,
                  transition: "transform 0.3s ease",
                }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 p-2 rounded-full text-white transition-all duration-300 shadow-lg shadow-purple-500/20"
          >
            <ChevronRight size={24} />
          </button>

          {/* Decorative slider track */}
          <div className="absolute bottom-0 left-4 right-4 h-1 bg-gray-800/50 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-red-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  )
}

