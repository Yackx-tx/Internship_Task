"use client"
import { ChevronRight } from "lucide-react"

export default function SectionHeader({ title, onSeeMoreClick }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <button onClick={onSeeMoreClick} className="flex items-center text-gray-400 hover:text-white transition-colors">
        <span>See More</span>
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

