import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-lighter text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-primary text-2xl font-bold">MovieBazer</span>
            </Link>
            <p className="text-sm mb-4">
              Discover the latest movies and TV shows, watch trailers, and explore our vast database of films and
              series.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Facebook size={18} />} label="Facebook" />
              <SocialLink href="#" icon={<Twitter size={18} />} label="Twitter" />
              <SocialLink href="#" icon={<Instagram size={18} />} label="Instagram" />
              <SocialLink href="#" icon={<Youtube size={18} />} label="YouTube" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/movies">Movies</FooterLink>
              <FooterLink to="/tv-shows">TV Shows</FooterLink>
              <FooterLink to="/explore">Explore</FooterLink>
              <FooterLink to="/news">News</FooterLink>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-white font-semibold mb-4">Genres</h3>
            <ul className="space-y-2">
              <FooterLink to="/genre/action">Action</FooterLink>
              <FooterLink to="/genre/comedy">Comedy</FooterLink>
              <FooterLink to="/genre/drama">Drama</FooterLink>
              <FooterLink to="/genre/horror">Horror</FooterLink>
              <FooterLink to="/genre/sci-fi">Science Fiction</FooterLink>
              <FooterLink to="/genre/thriller">Thriller</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <p className="flex items-start">
                <Mail size={18} className="mr-2 mt-0.5" />
                <span>support@movieflix.com</span>
              </p>
              <Link
                to="/contact"
                className="inline-block bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">&copy; {currentYear} MovieBazer. All rights reserved.</p>
          <div className="flex space-x-4 text-sm">
            <FooterLink to="/privacypolicy">Privacy Policy</FooterLink>
            <FooterLink to="/contactus">Contact Us</FooterLink>
            <FooterLink to="https://github.com/Yackx-Tx/Internship_Task">Source Code</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-white transition-colors">
      {children}
    </Link>
  </li>
)

const SocialLink = ({ href, icon, label }) => (
  <a href={href} className="text-gray-400 hover:text-white transition-colors" aria-label={label}>
    {icon}
  </a>
)

export default Footer

