"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-black/90 text-white py-4 px-6 md:px-12 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-light-600 mr-3">Movies Bazer <span className="text-red-900">.</span></h1>
          <div className="hidden md:flex space-x-6 ml-80">
            <a href="/" className="hover:text-red-500 transition-colors font-medium">
              Home
            </a>
            <a href="/explore" className="hover:text-red-500 transition-colors font-medium">
              Explore
            </a>
            <a href="/genre" className="hover:text-red-500 transition-colors font-medium">
              Genre
            </a>
            <a href="/news" className="hover:text-red-500 transition-colors font-medium">
              News
            </a>
            <a href="/movies" className="hover:text-red-500 transition-colors">
              Movies
            </a>
            <a href="/tvshows" className="hover:text-red-500 transition-colors">
              TV Shows
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          
          <button className="md:hidden p-2 hover:text-red-500 transition-colors" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 absolute top-16 left-0 w-full py-4 px-6 flex flex-col space-y-4">
          <a href="/" className="hover:text-red-500 transition-colors">
            Home
          </a>
          <a href="/" className="hover:text-red-500 transition-colors">
            Explore
          </a>
          <a href="/" className="hover:text-red-500 transition-colors">
            Genre
          </a>
          <a href="/" className="hover:text-red-500 transition-colors">
            News
          </a>
          <a href="/" className="hover:text-red-500 transition-colors">
            Movies
          </a>
          <a href="/" className="hover:text-red-500 transition-colors">
            TV Shows
          </a>
        </div>
      )}
    </nav>
  )
}

export default Navbar

