"use client"

import { useState, useEffect } from "react"
import { Play } from "lucide-react"
import { fetchMovieById } from "../services/api"

export default function Hero() {
  const [featuredMovies, setFeaturedMovies] = useState([
    {
      id: "tt4633694", // Spider-Man: Into the Spider-Verse
      title: "Loading...",
      posterUrl: "/placeholder.svg?height=450&width=300",
      year: "",
    },
    {
      id: "tt6791350", // Guardians of the Galaxy Vol. 3
      title: "Loading...",
      posterUrl: "/placeholder.svg?height=450&width=300",
      year: "",
    },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const movieIds = ["tt4633694", "tt6791350"] // Spider-Verse and Guardians Vol. 3
        const moviesData = await Promise.all(movieIds.map((id) => fetchMovieById(id)))

        // Filter out any null results (failed requests)
        const validMovies = moviesData.filter((movie) => movie !== null)

        if (validMovies.length > 0) {
          setFeaturedMovies(validMovies)
        }
      } catch (error) {
        console.error("Error fetching featured movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMovies()
  }, [])

  return (
    <div className="relative bg-gradient-to-tr from-black via-black to-red-900/40 text-white">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] overflow-hidden flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            {/* Left Content - Text Section */}
            <div className="w-full md:w-1/2 relative z-10 pr-0 md:pr-12">
              {/* Top line decoration */}
              <div className="absolute top-10 right-0 w-25 h-px bg-gradient-to-r from-gray-300 to-gray-400"></div>

              <div className="max-w-lg pt-8">
                <h1 className="text-3xl md: font-bold mb-6 leading-10">
                  FIND MOVIES
                  <br />
                  <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-red-500">
                    TV SHOWS AND MORE
                  </span>
                </h1>
                <p className="text-gray-300 text-xl md:text-2 xs mb-6 leading-relaxed">
                  Discover the latest blockbusters, timeless classics,
                  <br />
                  and hidden gems from around the world.
                  <br />
                  Your next favorite movie is just a click away.
                </p>

                <button className="flex items-center space-x-2 border-2 border-white hover:border-red-500 text-white py-3 px-8 rounded-2xl transition-all hover:bg-red-900">
                  <Play size={20} className="rounded-full bg-white fill-black p-1" />
                  <span className="font-medium text-lg">Watch Tutorial</span>
                </button>
              </div>
            </div>

            {/* Right Content - Image Section */}
            <div className="w-full md:w-1/2 relative z-10 mt-12 md:mt-0">
              <div className="relative h-full flex justify-center">
                {/* Right vertical line decoration */}
                <div className="absolute left-0 top-10 bottom-0 w-px h-[100%-2.5rem] bg-gradient-to-b from-gray-300 to-gray-400"></div>

                <div className="grid grid-cols-2 -gap-2 p-4">
                  {/* First Image */}
                  <div className="relative aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-lg group">
                    {loading ? (
                      <div className="w-full h-full bg-gray-800 animate-pulse"></div>
                    ) : (
                      <img
                        src={featuredMovies[0]?.posterUrl || "/placeholder.svg?height=450&width=300"}
                        alt={featuredMovies[0]?.title || "Movie poster"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all">
                        <Play size={24} className="text-white" />
                      </button>
                    </div>
                    {!loading && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                        <p className="text-xs text-white truncate">{featuredMovies[0]?.title}</p>
                        <p className="text-xs text-gray-300">{featuredMovies[0]?.year}</p>
                      </div>
                    )}
                  </div>

                  {/* Second Image */}
                  <div className="relative aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-lg group -mt-10">
                    {loading ? (
                      <div className="w-full h-full bg-gray-800 animate-pulse"></div>
                    ) : (
                      <img
                        src={featuredMovies[1]?.posterUrl || "/placeholder.svg?height=450&width=300"}
                        alt={featuredMovies[1]?.title || "Movie poster"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all">
                        <Play size={24} className="text-white" />
                      </button>
                    </div>
                    {!loading && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                        <p className="text-xs text-white truncate">{featuredMovies[1]?.title}</p>
                        <p className="text-xs text-gray-300">{featuredMovies[1]?.year}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom line decoration */}
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-gray-300 to-gray-400"></div>
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-0" />
      </section>
    </div>
  )
}

