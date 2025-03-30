import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./components/Home"
import Hero from "./components/Hero"
import Explore from "./components/Explore"
import Genre from "./components/Genre"
import News from "./components/News"
import Movies from "./components/Movies"
import TVShows from "./components/TvShows"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f0f0f]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/genre" element={<Genre />} />
          <Route path="/news" element={<News />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tvShows" element={<TVShows />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App