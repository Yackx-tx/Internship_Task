// TMDB API Configuration with new credentials
// const API_KEY = "7596b34ab8046ab494321060aafbba12"
const API_READ_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTk2YjM0YWI4MDQ2YWI0OTQzMjEwNjBhYWZiYmExMiIsIm5iZiI6MTc0MzE0NTYzNi4xNDgsInN1YiI6IjY3ZTY0YWE0NWU4ZTVjOWJhY2JhNmQwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Dv6MpESMePSX29ntn2VssAyCiPCyoQpyRoc2rCI5ZuY"
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// Image sizes for TMDB
const BACKDROP_SIZE = "w1280"
const POSTER_SIZE = "w500"

// Helper function to create API request options with the new token
const fetchOptions = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
}

// Fetch data from TMDB API - updated to use the token-based authentication
const fetchMovieData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions)

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    return null
  }
}

// Get trending movies - preserving the existing function signature
export const getTrendingMovies = async () => {
  return await fetchMovieData("/trending/movie/day")
}

// Get popular movies - preserving the existing function signature
export const getPopularMovies = async (page = 1) => {
  return await fetchMovieData(`/movie/popular?page=${page}`)
}

// Get top rated movies - updated to handle pagination
export const getTopRatedMovies = async (page = 1) => {
  return await fetchMovieData(`/movie/top_rated?page=${page}`)
}

// Get upcoming movies - preserving the existing function signature
export const getUpcomingMovies = async () => {
  return await fetchMovieData("/movie/upcoming")
}

// Get now playing movies - preserving the existing function signature
export const getNowPlayingMovies = async () => {
  return await fetchMovieData("/movie/now_playing")
}

// Get movie details - preserving the existing function signature
export const getMovieDetails = async (movieId) => {
  return await fetchMovieData(`/movie/${movieId}?append_to_response=credits,videos,images,recommendations`)
}

// Search movies - updated to handle pagination and special queries
export const searchMovies = async (query, page = 1) => {
  // If query is "popular", return popular movies instead of search
  if (query === "popular") {
    return await getPopularMovies(page)
  }
  return await fetchMovieData(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`)
}

// Get movies by genre - preserving the existing function signature
export const getMoviesByGenre = async (genreId, page = 1) => {
  return await fetchMovieData(`/discover/movie?with_genres=${genreId}&page=${page}`)
}

// Get movie genres - preserving the existing function signature
export const getMovieGenres = async () => {
  return await fetchMovieData("/genre/movie/list")
}

// Get TV shows - preserving the existing function signature
export const getPopularTVShows = async (page = 1) => {
  return await fetchMovieData(`/tv/popular?page=${page}`)
}

// Get TV show details - preserving the existing function signature
export const getTVShowDetails = async (tvId) => {
  return await fetchMovieData(`/tv/${tvId}?append_to_response=credits,videos,images,recommendations`)
}

// Helper function to get full image URL - preserving the existing function
export const getImageUrl = (path, size = POSTER_SIZE) => {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}

// Helper function to get backdrop URL - preserving the existing function
export const getBackdropUrl = (path) => {
  return getImageUrl(path, BACKDROP_SIZE)
}

// Helper function to get poster URL - preserving the existing function
export const getPosterUrl = (path) => {
  return getImageUrl(path, POSTER_SIZE)
}

// Get movie videos - preserving the existing function signature
export const getMovieVideos = async (movieId) => {
  return await fetchMovieData(`/movie/${movieId}/videos`)
}

// Get movie credits - preserving the existing function signature
export const getMovieCredits = async (movieId) => {
  return await fetchMovieData(`/movie/${movieId}/credits`)
}

// Get similar movies - preserving the existing function signature
export const getSimilarMovies = async (movieId) => {
  return await fetchMovieData(`/movie/${movieId}/similar`)
}

// Get recommended movies - preserving the existing function signature
export const getRecommendedMovies = async (movieId) => {
  return await fetchMovieData(`/movie/${movieId}/recommendations`)
}

// Preserving any other functions that might be used in the application
export const getMoviesByActor = async (personId) => {
  return await fetchMovieData(`/discover/movie?with_cast=${personId}`)
}

export const getActorDetails = async (personId) => {
  return await fetchMovieData(`/person/${personId}`)
}

export const getActorMovieCredits = async (personId) => {
  return await fetchMovieData(`/person/${personId}/movie_credits`)
}

// If there are any pagination functions, preserve them as well
export const getMoviesWithPagination = async (endpoint, page = 1) => {
  return await fetchMovieData(`${endpoint}?page=${page}`)
}

// If there are any configuration functions, preserve them as well
export const getConfiguration = async () => {
  return await fetchMovieData("/configuration")
}

// Mock function for movie news since TMDB doesn't provide news
export const fetchMovieNews = async () => {
  // In a real app, this would fetch from a news API
  // For now, we'll return null to trigger the fallback
  return null
}

// New function to discover movies with advanced filters
export const discoverMovies = async (options = {}) => {
  const {
    page = 1,
    sortBy = "popularity.desc",
    genres = [],
    yearFrom,
    yearTo,
    voteAverageFrom,
    voteAverageTo,
  } = options

  let endpoint = `/discover/movie?page=${page}&sort_by=${sortBy}`

  if (genres.length > 0) {
    endpoint += `&with_genres=${genres.join(",")}`
  }

  if (yearFrom) {
    endpoint += `&primary_release_date.gte=${yearFrom}-01-01`
  }

  if (yearTo) {
    endpoint += `&primary_release_date.lte=${yearTo}-12-31`
  }

  if (voteAverageFrom) {
    endpoint += `&vote_average.gte=${voteAverageFrom}`
  }

  if (voteAverageTo) {
    endpoint += `&vote_average.lte=${voteAverageTo}`
  }

  return await fetchMovieData(endpoint)
}

