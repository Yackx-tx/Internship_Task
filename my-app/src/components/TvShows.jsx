"use client"

import { useState, useEffect } from "react"
import { Play, Info, Loader } from "lucide-react"
import { fetchTVShows, fetchTrendingTVShows } from "../services/api"

const TVShows = () => {
  const [featuredShows, setFeaturedShows] = useState([])
  const [popularShows, setPopularShows] = useState([])
  const [trendingShows, setTrendingShows] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTVShows = async () => {
      try {
        setLoading(true)

        // Fetch TV shows data
        const [shows, trendingShows] = await Promise.all([fetchTVShows(), fetchTrendingTVShows()])

        // Use the first 3 shows as featured
        setFeaturedShows(shows.slice(0, 3))

        // Use the rest as popular shows
        setPopularShows(shows.slice(3))

        // Set trending shows
        setTrendingShows(trendingShows)
      } catch (error) {
        console.error("Error loading TV shows:", error)
        // Fallback to mock data if API fails
        setFeaturedShows(mockFeaturedShows)
        setPopularShows(mockPopularShows)
        setTrendingShows([...mockPopularShows].reverse())
      } finally {
        setLoading(false)
      }
    }

    loadTVShows()
  }, [])

  useEffect(() => {
    if (featuredShows.length === 0) return

    // Auto-rotate featured shows
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === featuredShows.length - 1 ? 0 : prevIndex + 1))
    }, 8000)

    return () => clearInterval(interval)
  }, [featuredShows.length])

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin h-12 w-12 text-red-600" />
          <p className="mt-4">Loading TV Shows...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section with Autoplay */}
      <div className="relative h-[70vh] overflow-hidden">
        {featuredShows.map((show, index) => (
          <div
            key={show.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
            <img
              src={show.posterUrl || "/placeholder.svg?height=600&width=1200"}
              alt={show.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-0 left-0 p-8 z-20 w-full md:w-2/3">
              <h2 className="text-4xl font-bold mb-2">{show.title}</h2>
              <p className="text-sm text-gray-300 mb-2">{show.genre || "TV Series"}</p>
              <p className="text-gray-200 mb-6">{show.plot || "No description available"}</p>
              <div className="flex space-x-4">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded flex items-center">
                  <Play size={20} className="mr-2" /> Play
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded flex items-center">
                  <Info size={20} className="mr-2" /> More Info
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popular TV Shows Section */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Popular TV Shows</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularShows.map((show) => (
            <div key={show.id} className="group relative overflow-hidden rounded">
              <img
                src={show.posterUrl || "/placeholder.svg?height=450&width=300"}
                alt={show.title}
                className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="font-bold">{show.title}</h3>
                <p className="text-xs text-gray-300">{show.genre || "TV Series"}</p>
                {show.rating && (
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-xs ml-1">{show.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Now Section */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingShows.map((show) => (
            <div key={show.id} className="group relative overflow-hidden rounded">
              <img
                src={show.posterUrl || "/placeholder.svg?height=450&width=300"}
                alt={show.title}
                className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="font-bold">{show.title}</h3>
                <p className="text-xs text-gray-300">{show.genre || "TV Series"}</p>
                {show.rating && (
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-xs ml-1">{show.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Fallback mock data in case the API fails
const mockFeaturedShows = [
  {
    id: 1,
    title: "Stranger Things",
    description:
      "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
    image: "/placeholder.svg?height=600&width=1200",
    genre: "Sci-Fi & Fantasy",
  },
  {
    id: 2,
    title: "Breaking Bad",
    description:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
    image: "/placeholder.svg?height=600&width=1200",
    genre: "Drama",
  },
  {
    id: 3,
    title: "Game of Thrones",
    description:
      "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    image: "/placeholder.svg?height=600&width=1200",
    genre: "Drama, Fantasy",
  },
]

const mockPopularShows = [
  {
    id: 4,
    title: "The Crown",
    image: "/placeholder.svg?height=450&width=300",
    genre: "Drama, History",
  },
  {
    id: 5,
    title: "The Mandalorian",
    image: "/placeholder.svg?height=450&width=300",
    genre: "Sci-Fi & Fantasy",
  },
  {
    id: 6,
    title: "Money Heist",
    image: "/placeholder.svg?height=450&width=300",
    genre: "Crime, Drama",
  },
  {
    id: 7,
    title: "The Witcher",
    image: "/placeholder.svg?height=450&width=300",
    genre: "Fantasy, Action",
  },
  {
    id: 8,
    title: "Dark",
    image: "/placeholder.svg?height=450&width=300",
    genre: "Sci-Fi, Mystery",
  },
  {
    id: 9,
    title: "Ozark",
    image: "/placeholder.svg?height=450&width=300",
    genre: "Crime, Drama",
  },
]

export default TVShows

