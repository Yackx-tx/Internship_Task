"use client"

// This file contains sample movie data that can be used for testing or as fallback data
// when the API is not available or during development

export const sampleMovies = [
  {
    id: 1,
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    release_date: "2010-07-16",
    vote_average: 8.4,
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" },
      { id: 53, name: "Thriller" },
    ],
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    overview:
      "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    release_date: "1994-09-23",
    vote_average: 8.7,
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" },
    ],
  },
  {
    id: 3,
    title: "The Dark Knight",
    overview:
      "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    genres: [
      { id: 28, name: "Action" },
      { id: 80, name: "Crime" },
      { id: 18, name: "Drama" },
    ],
  },
  {
    id: 4,
    title: "Pulp Fiction",
    overview:
      "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    release_date: "1994-09-10",
    vote_average: 8.5,
    genres: [
      { id: 53, name: "Thriller" },
      { id: 80, name: "Crime" },
    ],
  },
  {
    id: 5,
    title: "Forrest Gump",
    overview:
      "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdrop_path: "/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg",
    release_date: "1994-06-23",
    vote_average: 8.5,
    genres: [
      { id: 35, name: "Comedy" },
      { id: 18, name: "Drama" },
      { id: 10749, name: "Romance" },
    ],
  },
  {
    id: 6,
    title: "The Matrix",
    overview:
      "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    release_date: "1999-03-30",
    vote_average: 8.2,
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" },
    ],
  },
]

// Helper function to render movie cards with Tailwind CSS classes
export const renderMovieCard = (movie, onClick) => {
  return (
    <div
      key={movie.id}
      className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer bg-dark-lighter"
      onClick={() => onClick && onClick(movie)}
    >
      <div className="aspect-[2/3] w-full">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-light text-white p-4 text-center">
            <span className="text-sm font-medium">{movie.title}</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-dark-lighter">
        <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
        <div className="flex justify-between items-center mt-1">
          {movie.release_date && <p className="text-gray-400 text-xs">{new Date(movie.release_date).getFullYear()}</p>}
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-gray-300 text-xs">{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample movie genres with Tailwind CSS classes for styling
export const movieGenres = [
  { id: 28, name: "Action", className: "bg-red-600 text-white" },
  { id: 12, name: "Adventure", className: "bg-green-600 text-white" },
  { id: 16, name: "Animation", className: "bg-blue-600 text-white" },
  { id: 35, name: "Comedy", className: "bg-yellow-500 text-black" },
  { id: 80, name: "Crime", className: "bg-gray-700 text-white" },
  { id: 99, name: "Documentary", className: "bg-indigo-600 text-white" },
  { id: 18, name: "Drama", className: "bg-purple-600 text-white" },
  { id: 10751, name: "Family", className: "bg-pink-500 text-white" },
  { id: 14, name: "Fantasy", className: "bg-violet-600 text-white" },
  { id: 36, name: "History", className: "bg-amber-700 text-white" },
  { id: 27, name: "Horror", className: "bg-black text-white" },
  { id: 10402, name: "Music", className: "bg-teal-600 text-white" },
  { id: 9648, name: "Mystery", className: "bg-slate-800 text-white" },
  { id: 10749, name: "Romance", className: "bg-rose-500 text-white" },
  { id: 878, name: "Science Fiction", className: "bg-cyan-600 text-white" },
  { id: 10770, name: "TV Movie", className: "bg-orange-500 text-white" },
  { id: 53, name: "Thriller", className: "bg-red-800 text-white" },
  { id: 10752, name: "War", className: "bg-stone-700 text-white" },
  { id: 37, name: "Western", className: "bg-amber-800 text-white" },
]

// Helper function to render genre badges with Tailwind CSS
export const renderGenreBadge = (genreId) => {
  const genre = movieGenres.find((g) => g.id === genreId)
  if (!genre) return null

  return (
    <span key={genre.id} className={`px-2 py-1 rounded-full text-xs font-medium ${genre.className}`}>
      {genre.name}
    </span>
  )
}

// Sample movie ratings with Tailwind CSS classes
export const movieRatings = [
  { value: "G", label: "G", className: "bg-green-500 text-white" },
  { value: "PG", label: "PG", className: "bg-blue-500 text-white" },
  { value: "PG-13", label: "PG-13", className: "bg-yellow-500 text-black" },
  { value: "R", label: "R", className: "bg-red-500 text-white" },
  { value: "NC-17", label: "NC-17", className: "bg-red-800 text-white" },
]

// Helper function to get a Tailwind CSS class for rating stars based on score
export const getRatingColorClass = (rating) => {
  if (rating >= 8) return "text-green-500"
  if (rating >= 6) return "text-yellow-500"
  if (rating >= 4) return "text-orange-500"
  return "text-red-500"
}

// Helper function to generate a responsive movie grid with Tailwind CSS
export const renderMovieGrid = (movies, onMovieClick) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie) => renderMovieCard(movie, onMovieClick))}
    </div>
  )
}

// Tailwind CSS classes for common movie UI elements
export const movieUIClasses = {
  container: "bg-dark min-h-screen pt-20 pb-12",
  heading: "text-white text-3xl font-bold mb-8",
  loadingSpinner: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary",
  loadMoreButton: "bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-medium transition-colors",
  errorMessage: "text-red-500 bg-red-100/10 p-4 rounded-lg",
  sectionTitle: "text-white text-xl font-semibold mb-4",
}

