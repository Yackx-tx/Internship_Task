"use client"
import { useState, useEffect } from "react"
import Hero from "./Hero"
import TrendingMovies from "./TrendingMovies"
import RecommendedMovies from "./RecommendedMovies"
import {
  getTrendingMovies,
  getRecommendedMovies,
  getTrendingMoviesSync,
  getRecommendedMoviesSync,
} from "../data/movies"

function Home() {
  const [trendingMovies, setTrendingMovies] = useState(getTrendingMoviesSync())
  const [recommendedMovies, setRecommendedMovies] = useState(getRecommendedMoviesSync())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true)
        const [trending, recommended] = await Promise.all([getTrendingMovies(), getRecommendedMovies()])

        setTrendingMovies(trending)
        setRecommendedMovies(recommended)
      } catch (error) {
        console.error("Error fetching movie data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieData()
  }, [])

  return (
    <>
      <Hero />
      {loading ? (
        <div className="container mx-auto px-6 py-10 text-white text-center">Loading movies...</div>
      ) : (
        <>
          <TrendingMovies movies={trendingMovies} />
          <RecommendedMovies movies={recommendedMovies} />
        </>
      )}
    </>
  )
}

export default Home

