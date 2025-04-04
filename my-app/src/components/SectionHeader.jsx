"use client"
import { ChevronRight } from "lucide-react"

export default function SectionHeader({ title, onSeeMoreClick }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white ">{title}</h2>
      <div className="relative -ml-50 right-0 w-[50%] h-px bg-gradient-to-l from-gray-300 via-red-900/20 to-gray-300"></div>
      <button onClick={onSeeMoreClick} className="flex items-center text-gray-400 hover:text-white transition-colors">
        <span>See More</span>
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

