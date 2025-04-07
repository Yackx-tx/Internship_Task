"use client"
import { Film, ChevronRight, Star, Calendar, TrendingUp } from "lucide-react"
import { useState } from "react"

const SectionHeader = ({ title, onSeeMoreClick }) => {
  const [activeView, setActiveView] = useState("grid")

  return (
    <div className="mb-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Decorative left element */}
          <div className="hidden md:flex items-center">
            <div className="h-8 w-1 bg-gradient-to-b from-red-500 to-purple-600 rounded-full mr-2"></div>
            <Film size={20} className="text-red-500" />
          </div>

          {/* Title with gradient and decoration */}
          <div className="relative">
            <h2 className="text-2xl font-bold text-white relative z-10">
              {title}
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-purple-600 rounded-full"></span>
            </h2>
            <div className="absolute -left-1 -top-1 w-8 h-8 rounded-full bg-gradient-to-br from-red-500/20 to-purple-600/20 blur-lg"></div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle buttons */}
          <div className="hidden sm:flex bg-gray-800 rounded-lg p-1">
            <button
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                activeView === "grid" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveView("grid")}
            >
              Grid
            </button>
            <button
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                activeView === "list" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveView("list")}
            >
              List
            </button>
          </div>

          {/* Quick filter buttons */}
          <div className="hidden md:flex items-center gap-1">
            <button
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              title="Sort by trending"
            >
              <TrendingUp size={16} />
            </button>
            <button
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              title="Sort by rating"
            >
              <Star size={16} />
            </button>
            <button
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              title="Sort by release date"
            >
              <Calendar size={16} />
            </button>
          </div>

          {/* See more button with decoration */}
          {onSeeMoreClick && (
            <button
              onClick={onSeeMoreClick}
              className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors group relative"
            >
              <span>See All</span>
              <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
          )}
        </div>
      </div>

      {/* Decorative line */}
      <div className="mt-2 h-px w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>
    </div>
  )
}

export default SectionHeader

