"use client"

import { useState, useRef } from "react"
import MovieCard from "./MovieCard"
import SectionHeader from "./SectionHeader"
import { ChevronLeft, ChevronRight } from "lucide-react"

const MovieSlider = ({ movies, title }) => {
  const sliderRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth

      sliderRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      })

      // Check if we need to show/hide arrows after scrolling
      setTimeout(() => {
        if (sliderRef.current) {
          setShowLeftArrow(sliderRef.current.scrollLeft > 0)
          setShowRightArrow(
            sliderRef.current.scrollLeft + sliderRef.current.clientWidth < sliderRef.current.scrollWidth - 10,
          )
        }
      }, 300)
    }
  }

  const handleScroll = () => {
    if (sliderRef.current) {
      setShowLeftArrow(sliderRef.current.scrollLeft > 0)
      setShowRightArrow(
        sliderRef.current.scrollLeft + sliderRef.current.clientWidth < sliderRef.current.scrollWidth - 10,
      )
    }
  }

  // Don't render if no movies
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeader title={title} />

        <div className="relative">
          {showLeftArrow && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
          )}

          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x"
            onScroll={handleScroll}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="flex-none w-[220px] snap-start">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          {showRightArrow && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default MovieSlider
