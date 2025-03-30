// OMDb API configuration
const API_BASE_URL = "http://www.omdbapi.com/"
const API_KEY = process.env.REACT_APP_OMDB_API_KEY || "d0b9c4a9"

// Function to fetch a single movie by ID
export const fetchMovieById = async (imdbId) => {
  try {
    const response = await fetch(`${API_BASE_URL}?i=${imdbId}&apikey=${API_KEY}`)

    if (!response.ok) {
      throw new Error("Failed to fetch movie")
    }

    const movie = await response.json()

    if (movie.Response === "False") {
      throw new Error(movie.Error)
    }

    return transformMovieData(movie)
  } catch (error) {
    console.error("Error fetching movie:", error)
    return null
  }
}

// Function to search for movies by title
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}?s=${encodeURIComponent(query)}&page=${page}&apikey=${API_KEY}`)

    if (!response.ok) {
      throw new Error("Failed to fetch movies")
    }

    const data = await response.json()

    if (data.Response === "False") {
      throw new Error(data.Error)
    }

    // Transform the search results
    return data.Search.map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      posterUrl: movie.Poster !== "N/A" ? movie.Poster : null,
      year: movie.Year,
      type: movie.Type,
      // OMDb search doesn't provide duration, so we'll leave it out for now
    }))
  } catch (error) {
    console.error("Error searching movies:", error)
    return []
  }
}

// Helper function to transform movie data
const transformMovieData = (movie) => {
  return {
    id: movie.imdbID,
    title: movie.Title,
    posterUrl: movie.Poster !== "N/A" ? movie.Poster : null,
    year: movie.Year,
    duration: movie.Runtime !== "N/A" ? movie.Runtime : "N/A",
    rating: movie.imdbRating !== "N/A" ? Number.parseFloat(movie.imdbRating) : null,
    plot: movie.Plot,
    genre: movie.Genre,
    director: movie.Director,
    actors: movie.Actors,
  }
}

// Function to fetch trending movies (simulated with predefined popular movie IDs)
export const fetchTrendingMovies = async () => {
  // Since OMDb doesn't have a trending endpoint, we'll use a list of popular movie IDs
  const trendingMovieIds = [
    "tt1375666", // Inception
    "tt0816692", // Interstellar
    "tt0468569", // The Dark Knight
    "tt0133093", // The Matrix
    "tt0109830", // Forrest Gump
    "tt0110357", // The Lion King
    "tt0114369", // Se7en
    "tt0120737", // The Lord of the Rings
    "tt0167260", // The Lord of the Rings: The Return of the King
    "tt0080684", // Star Wars: Episode V - The Empire Strikes Back
  ]

  const moviePromises = trendingMovieIds.map((id) => fetchMovieById(id))
  const movies = await Promise.all(moviePromises)

  // Filter out any null results (failed requests)
  return movies.filter((movie) => movie !== null)
}

// Function to fetch recommended movies (simulated with different predefined movie IDs)
export const fetchRecommendedMovies = async () => {
  // Different set of movie IDs for recommended
  const recommendedMovieIds = [
    "tt0111161", // The Shawshank Redemption
    "tt0068646", // The Godfather
    "tt0071562", // The Godfather: Part II
    "tt0050083", // 12 Angry Men
    "tt0108052", // Schindler's List
    "tt0167261", // The Lord of the Rings: The Two Towers
    "tt0060196", // The Good, the Bad and the Ugly
    "tt0137523", // Fight Club
    "tt0120815", // Saving Private Ryan
    "tt0109830", // Forrest Gump
  ]

  const moviePromises = recommendedMovieIds.map((id) => fetchMovieById(id))
  const movies = await Promise.all(moviePromises)

  // Filter out any null results (failed requests)
  return movies.filter((movie) => movie !== null)
}

// Function to fetch TV shows (simulated with TV show IMDb IDs)
export const fetchTVShows = async () => {
  // List of popular TV show IMDb IDs
  const tvShowIds = [
    "tt4574334", // Stranger Things
    "tt0903747", // Breaking Bad
    "tt0944947", // Game of Thrones
    "tt4786824", // The Crown
    "tt8111088", // The Mandalorian
    "tt6468322", // Money Heist (La Casa de Papel)
    "tt5180504", // The Witcher
    "tt5753856", // Dark
    "tt5071412", // Ozark
  ]

  const tvShowPromises = tvShowIds.map((id) => fetchMovieById(id))
  const tvShows = await Promise.all(tvShowPromises)

  // Filter out any null results (failed requests)
  return tvShows.filter((show) => show !== null)
}

// Function to fetch trending TV shows (different set of IDs)
export const fetchTrendingTVShows = async () => {
  // Different set of TV show IDs for trending
  const trendingTVShowIds = [
    "tt7366338", // Chernobyl
    "tt2442560", // Peaky Blinders
    "tt8420184", // The Queen's Gambit
    "tt1520211", // The Walking Dead
    "tt7569592", // Squid Game
    "tt2306299", // Vikings
    "tt0475784", // Westworld
    "tt2085059", // Black Mirror
    "tt2707408", // Narcos
  ]

  const tvShowPromises = trendingTVShowIds.map((id) => fetchMovieById(id))
  const tvShows = await Promise.all(tvShowPromises)

  // Filter out any null results (failed requests)
  return tvShows.filter((show) => show !== null)
}

// Function to generate movie news based on recent and upcoming movies
export const fetchMovieNews = async () => {
  try {
    // Use predefined movie IDs for news to ensure reliability
    const newsMovieIds = [
      "tt15398776", // Oppenheimer
      "tt1517268", // Barbie
      "tt9362722", // Spider-Man: Across the Spider-Verse
      "tt6718170", // The Super Mario Bros. Movie
    ]

    // Fetch detailed information for these movies
    const newsPromises = newsMovieIds.map(async (id, index) => {
      try {
        const movie = await fetchMovieById(id)
        if (!movie) return null

        // Create news article based on movie
        return createNewsArticle(movie, index)
      } catch (error) {
        console.error(`Error fetching movie details for news: ${error}`)
        return null
      }
    })

    const newsItems = await Promise.all(newsPromises)
    return newsItems.filter((item) => item !== null)
  } catch (error) {
    console.error("Error fetching movie news:", error)
    return []
  }
}

// Helper function to create a news article from a movie
const createNewsArticle = (movie, index) => {
  const templates = [
    {
      title: `"${movie.title}" Breaks Box Office Records`,
      excerpt: `The latest blockbuster "${movie.title}" has shattered opening weekend records worldwide with impressive numbers.`,
    },
    {
      title: `Director Announces Sequel to "${movie.title}"`,
      excerpt: `Fans of "${movie.title}" will be excited to hear that a sequel has been confirmed and is in early development.`,
    },
    {
      title: `"${movie.title}" Cast Reunites for Special Event`,
      excerpt: `The stars of "${movie.title}" are coming together for a special reunion event that fans won't want to miss.`,
    },
    {
      title: `Streaming Platform Acquires Rights to "${movie.title}"`,
      excerpt: `A major streaming service has acquired exclusive streaming rights for the hit film "${movie.title}".`,
    },
  ]

  const template = templates[index % templates.length]
  const today = new Date()
  const newsDate = new Date(today)
  newsDate.setDate(today.getDate() - index * 3) // Different dates for each news item

  return {
    id: `news-${movie.id}`,
    title: template.title,
    excerpt: template.excerpt,
    date: newsDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    image: movie.posterUrl,
  }
}

