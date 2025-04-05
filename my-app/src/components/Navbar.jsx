"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Search } from "lucide-react"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // Handle search logic here
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-dark shadow-md" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-primary text-2xl font-bold">MovieBazer</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <NavLink to="/" active={location.pathname === "/"}>
              Home
            </NavLink>
            <NavLink to="/movies" active={location.pathname === "/movies"}>
              Movies
            </NavLink>
            <NavLink to="/tv-shows" active={location.pathname === "/tv-shows"}>
              TV Shows
            </NavLink>
            <NavLink to="/explore" active={location.pathname === "/explore"}>
              Explore
            </NavLink>
            <NavLink to="/news" active={location.pathname === "/news"}>
              News
            </NavLink>
          </nav>

          {/* Search and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-dark-light text-white px-4 py-1 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary w-40 lg:w-56"
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </button>
              </div>
            </form>
            <button className="text-white md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-lighter">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-dark-light text-white px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </button>
              </div>
            </form>
            <nav className="flex flex-col space-y-3">
              <MobileNavLink to="/" onClick={toggleMenu}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/movies" onClick={toggleMenu}>
                Movies
              </MobileNavLink>
              <MobileNavLink to="/tv-shows" onClick={toggleMenu}>
                TV Shows
              </MobileNavLink>
              <MobileNavLink to="/explore" onClick={toggleMenu}>
                Explore
              </MobileNavLink>
              <MobileNavLink to="/news" onClick={toggleMenu}>
                News
              </MobileNavLink>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`text-sm font-medium transition-colors duration-200 ${
      active ? "text-white" : "text-gray-300 hover:text-white"
    }`}
  >
    {children}
  </Link>
)

const MobileNavLink = ({ to, onClick, children }) => (
  <Link to={to} onClick={onClick} className="text-gray-300 hover:text-white text-lg font-medium py-1">
    {children}
  </Link>
)

export default Navbar

