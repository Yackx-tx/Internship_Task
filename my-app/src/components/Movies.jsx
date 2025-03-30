"use client"

import { useState, useEffect } from "react"
import { Play, Info, Star, Filter } from 'lucide-react'
import { fetchTrendingMovies, fetchMovieById } from "../services/api"

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [featured, setFeatured] = useState(null)
  const [category, setCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch trending movies
        const trendingMovies = await fetchTrendingMovies()
        
        if (trendingMovies.length > 0) {
          setMovies(trendingMovies)
          
          // Set the first movie as featured and fetch its full details
          const featuredMovie = await fetchMovieById(trendingMovies[0].id)
          setFeatured({
            ...featuredMovie,
            banner: featuredMovie.posterUrl // Using poster as banner since OMDb doesn't provide banners
          })
          
          // Extract unique genres from all movies
          const allGenres = trendingMovies
            .map(movie => movie.genre ? movie.genre.split(", ") : [])
            .flat()
            .filter((value, index, self) => self.indexOf(value) === index)
          
          setCategories(allGenres)
        }
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMoviesData()
  }, [])

  const filterMovies = (cat) => {
    setCategory(cat)
  }

  const filteredMovies = category === 'all' 
    ? movies 
    : movies.filter(movie => movie.genre && movie.genre.includes(category))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Featured Movie Banner */}
      {featured && (
        <div className="relative h-[70vh] w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featured.banner})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{featured.title}</h1>
            <div className="flex items-center mb-4">
              <Star className="text-yellow-500 mr-1" size={20} />
              <span className="mr-4">{featured.rating}</span>
              <span className="mr-4">{featured.year}</span>
              <span>{featured.genre}</span>
            </div>
            <p className="text-gray-300 mb-6">{featured.plot}</p>
            <div className="flex space-x-4">
              <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full flex items-center transition-colors">
                <Play size={20} className="mr-2" /> Watch Now
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-full flex items-center transition-colors">
                <Info size={20} className="mr-2" /> More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Streaming Section */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Movies Streaming Now</h2>
          <div className="flex items-center">
            <Filter size={20} className="mr-2" />
            <select 
              className="bg-gray-800 text-white py-2 px-4 rounded-md"
              value={category}
              onChange={(e) => filterMovies(e.target.value)}
            >
              <option value="all">All Genres</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 justify-items-center">
          {filteredMovies.map(movie => (
            <div key={movie.id} className="movie-card group w-full ">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src={movie.posterUrl || "/placeholder.svg?height=450&width=300"} 
                  alt={movie.title} 
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full">
                    <Play size={20} />
                  </button>
                </div>
              </div>
              <h3 className="mt-2 font-semibold text-center">{movie.title}</h3>
              <div className="flex items-center text-sm text-gray-400 justify-center">
                <Star className="text-yellow-500 mr-1" size={14} />
                <span>{movie.rating}</span>
                <span className="mx-2">•</span>
                <span>{movie.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*  Movie Panel */}
      <div className="bg-gray-900 py-12 w-full">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold mb-2 text-center">Movie Panel</h2>
          <div className="flex justify-center mb-8">
            <hr className="bg-red-500 w-20 h-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-red-500 text-center">Top Rated</h3>
              <ul className="space-y-4">
                {movies.sort((a, b) => b.rating - a.rating).slice(0, 5).map(movie => (
                  <li key={movie.id} className="flex items-center">
                    <img 
                      src={movie.posterUrl || "/placeholder.svg?height=450&width=300"} 
                      alt={movie.title} 
                      className="w-12 h-16 object-cover rounded mr-3"
                    />
                    <div>
                      <h4 className="font-medium">{movie.title}</h4>
                      <div className="flex items-center text-sm text-gray-400">
                        <Star className="text-yellow-500 mr-1" size={12} />
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-black/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-red-500 text-center">Coming Soon</h3>
              <p className="text-gray-400 mb-4 text-center">Stay tuned for these upcoming releases</p>
              <ul className="space-y-4">
                <li className="border-b border-gray-800 pb-2">
                  <h4 className="font-medium text-center">Dune: Part Two</h4>
                  <p className="text-sm text-gray-400 text-center">Release: March 2024</p>
                </li>
                <li className="border-b border-gray-800 pb-2">
                  <h4 className="font-medium text-center">The Batman 2</h4>
                  <p className="text-sm text-gray-400 text-center">Release: October 2024</p>
                </li>
                <li className="border-b border-gray-800 pb-2">
                  <h4 className="font-medium text-center">Mission: Impossible 8</h4>
                  <p className="text-sm text-gray-400 text-center">Release: May 2025</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-red-500 text-left">Streaming Platforms</h3>
              <ul className="space-y-3">
                <li className="flex items-center p-2 hover:bg-gray-800 rounded transition-colors justify-center">
                  <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center mr-1">N</div>
                  <span>Netflix</span>
                </li>
                <li className="flex items-center p-2 hover:bg-gray-800 rounded transition-colors justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-1">D+</div>
                  <span>Disney+</span>
                </li>
                <li className="flex items-center p-2 hover:bg-gray-800 rounded transition-colors justify-center">
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center mr-1">H</div>
                  <span>Hulu</span>
                </li>
                <li className="flex items-center p-2 hover:bg-gray-800 rounded transition-colors justify-center">
                  <div className="w-8 h-8 bg-blue-800 rounded flex items-center justify-center mr-1">P</div>
                  <span>Prime Video</span>
                </li>
                <li className="flex items-center p-2 hover:bg-gray-800 rounded transition-colors justify-center">
                  <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center mr-1">M</div>
                  <span>Max</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
