"use client"

import { useState } from "react"
import Hero from "./Hero"
import MovieSlider from "./MovieSlider"
import MovieDetailsModal from "./MovieDetailsModal"
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTrendingMovies,
  getMovieDetails,
} from "../services/api"

const Home = () => {
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [movieDetails, setMovieDetails] = useState(null)

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie)

    try {
      const details = await getMovieDetails(movie.id)
      setMovieDetails(details)
    } catch (err) {
      console.error("Error fetching movie details:", err)
    }
  }

  const handleCloseModal = () => {
    setSelectedMovie(null)
    setMovieDetails(null)
  }

  return (
    <div className="bg-dark min-h-screen pt-16">
      <Hero fetchFunction={getTrendingMovies} onMovieClick={handleMovieClick} />

      <div className="container mx-auto">
        <MovieSlider title="Now Playing" fetchFunction={getNowPlayingMovies} onMovieClick={handleMovieClick} />
        <MovieSlider title="Popular" fetchFunction={getPopularMovies} onMovieClick={handleMovieClick} />
        <MovieSlider title="Top Rated" fetchFunction={getTopRatedMovies} onMovieClick={handleMovieClick} />
        <MovieSlider title="Upcoming" fetchFunction={getUpcomingMovies} onMovieClick={handleMovieClick} />
      </div>

      {selectedMovie && movieDetails && <MovieDetailsModal movie={movieDetails} onClose={handleCloseModal} />}
    </div>
  )
}

export default Home

