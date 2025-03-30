"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
    <div className="container mx-auto px-6 py-8">
      <SectionHeader title={title} onSeeMoreClick={handleSeeMoreClick} />

      {showAll ? (
        // Grid view showing all movies
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        // Slider view showing movies in a scrollable container
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            ref={sliderRef}
            className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="flex-none w-[180px] snap-start">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  )
}

