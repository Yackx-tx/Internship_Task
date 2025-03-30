"use client"

import { useState, useEffect } from "react"
import { fetchMovieNews } from "../services/api"

const News = () => {
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [error, setError] = useState(false)

  // Fallback news data in case the API fails
  const fallbackNews = [
    {
      id: "news1",
      title: "New Superhero Movie Breaks Box Office Records",
      date: "May 15, 2023",
      excerpt: "The latest superhero blockbuster has shattered opening weekend records worldwide.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "news2",
      title: "Award-Winning Director Announces New Project",
      date: "May 12, 2023",
      excerpt:
        "The acclaimed filmmaker has revealed details about an upcoming psychological thriller set to begin production next month.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "news3",
      title: "Classic Film Series Getting Modern Reboot",
      date: "May 10, 2023",
      excerpt:
        "A beloved film franchise from the 90s is being reimagined for today's audiences with a star-studded cast.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "news4",
      title: "Streaming Platform Announces New Original Series",
      date: "May 8, 2023",
      excerpt: "A major streaming service has greenlit an ambitious new sci-fi series from renowned showrunners.",
      image: "/placeholder.svg?height=300&width=500",
    },
  ]

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true)
        setError(false)

        const news = await fetchMovieNews()

        if (news && news.length > 0) {
          setNewsItems(news)
        } else {
          // If no news or empty array, use fallback
          console.log("No news returned from API, using fallback")
          setNewsItems(fallbackNews)
        }
      } catch (error) {
        console.error("Error loading news:", error)
        setError(true)
        setNewsItems(fallbackNews)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    alert(`Thank you for subscribing with: ${email}`)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-6 md:px-12 py-8">
        <h1 className="text-4xl font-bold text-red-600 mb-8">Latest Movie News</h1>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-white px-4 py-3 rounded mb-6">
            <p>There was an error loading the latest news. Showing sample news instead.</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="bg-black/80 border border-gray-800 rounded-lg overflow-hidden hover:border-red-600 transition-colors"
              >
                <div className="h-48 bg-gray-800 relative">
                  {item.image ? (
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=300&width=500"
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                      [Featured Image]
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-gray-400 text-sm mb-2">{item.date}</p>
                  <h2 className="text-xl font-bold mb-3 text-white hover:text-red-500 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-300 mb-4">{item.excerpt}</p>
                  <button className="text-red-500 hover:text-red-400 font-semibold transition-colors">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-black/70 border border-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Subscribe to Newsletter</h2>
          <p className="text-gray-300 mb-4">Stay updated with the latest movie news and releases.</p>
          <form onSubmit={handleSubscribe}>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-black/90 text-white px-4 py-2 rounded border border-gray-700 focus:border-red-500 focus:outline-none flex-grow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default News

