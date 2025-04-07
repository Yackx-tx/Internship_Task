"use client"
import { Film, ChevronRight } from "lucide-react"

const SectionHeader = ({ title, onSeeMoreClick }) => {
  return (
    <div className="mb-6">
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

        {/* See more button with decoration */}
        {onSeeMoreClick && (
          <button
            onClick={onSeeMoreClick}
            className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors group"
          >
            <span>See All</span>
            <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
          </button>
        )}
      </div>

      {/* Decorative line */}
      <div className="mt-2 h-px w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>
    </div>
  )
}

export default SectionHeader

