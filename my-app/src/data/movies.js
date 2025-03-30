import { fetchTrendingMovies, fetchRecommendedMovies } from "../services/api"

// Fallback data in case the API fails
const fallbackMovies = [
  {
    id: "tt0111161",
    title: "The Shawshank Redemption",
    posterUrl: "/placeholder.svg?height=450&width=300",
    year: "1994",
    duration: "142 min",
  },
  {
    id: "tt0068646",
    title: "The Godfather",
    posterUrl: "/placeholder.svg?height=450&width=300",
    year: "1972",
    duration: "175 min",
  },
  {
    id: "tt0468569",
    title: "The Dark Knight",
    posterUrl: "/placeholder.svg?height=450&width=300",
    year: "2008",
    duration: "152 min",
  },
  {
    id: "tt0071562",
    title: "The Godfather: Part II",
    posterUrl: "/placeholder.svg?height=450&width=300",
    year: "1974",
    duration: "202 min",
  },
  {
    id: "tt0050083",
    title: "12 Angry Men",
    posterUrl: "/placeholder.svg?height=450&width=300",
    year: "1957",
    duration: "96 min",
  },
]

// These functions now return promises that resolve to the movie data
export const getTrendingMovies = async () => {
  try {
    const movies = await fetchTrendingMovies()
    return movies.length > 0 ? movies : fallbackMovies
  } catch (error) {
    console.error("Error getting trending movies:", error)
    return fallbackMovies
  }
}

export const getRecommendedMovies = async () => {
  try {
    const movies = await fetchRecommendedMovies()
    return movies.length > 0 ? movies : fallbackMovies
  } catch (error) {
    console.error("Error getting recommended movies:", error)
    return fallbackMovies
  }
}

// Keep the original synchronous functions for backward compatibility
export const getTrendingMoviesSync = () => {
  return fallbackMovies
}

export const getRecommendedMoviesSync = () => {
  return fallbackMovies
}

