"use client"

import MovieSection from "./MovieSection"

export default function RecommendedMovies({ movies }) {
  return <MovieSection title="Recommended For You" movies={movies} />
}

