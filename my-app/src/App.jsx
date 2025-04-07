import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import Movies from "./components/Movies"
import TvShows from "./components/TvShows"
import Genre from "./components/Genre"
import Explore from "./components/Explore"
import Footer from "./components/Footer"
import ContactUs from "./components/ContactUs"
import PrivacyPolicy from "./components/PrivacyPolicy"
import News from "./components/News"

// Genre IDs from TMDB
const GENRES = {
  ACTION: 28,
  COMEDY: 35,
  DRAMA: 18,
  HORROR: 27,
  SCIENCE_FICTION: 878,
  THRILLER: 53,
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TvShows />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/genre/:genreId" element={<Genre />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* Genre Routes */}
            <Route path="/genre/action" element={<Genre genreId={GENRES.ACTION} genreName="Action" />} />
            <Route path="/genre/comedy" element={<Genre genreId={GENRES.COMEDY} genreName="Comedy" />} />
            <Route path="/genre/drama" element={<Genre genreId={GENRES.DRAMA} genreName="Drama" />} />
            <Route path="/genre/horror" element={<Genre genreId={GENRES.HORROR} genreName="Horror" />} />
            <Route
              path="/genre/sci-fi"
              element={<Genre genreId={GENRES.SCIENCE_FICTION} genreName="Science Fiction" />}
            />
            <Route path="/genre/thriller" element={<Genre genreId={GENRES.THRILLER} genreName="Thriller" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

