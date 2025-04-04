export default function Footer() {
  return (
    <footer className="py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-primary">Movies Bazer</h2>
            <p className="text-sm text-gray-400 mt-1">© {new Date().getFullYear()} All rights reserved.</p>
          </div>

          <div className="flex gap-6">
            <a href="privacyPolicy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms and Policies
            </a>
            <a href="contactus" className="text-sm text-gray-400 hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

