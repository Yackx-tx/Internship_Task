export default function ContactUs() {
    return (
        <div className="min-h-screen bg-black text-white py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-red-500">
                        Contact Us
                    </h1>

                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                        <p className="text-gray-300 mb-6">
                            Have questions about Movies Bazer? Want to provide feedback or report an issue?
                            We'd love to hear from you!
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-primary">Email</h3>
                                <p className="text-gray-400">support@moviesbazer.com</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-primary">Social Media</h3>
                                <div className="flex gap-4 mt-2">
                                    <a href="/" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                                    <a href="/" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                                    <a href="/" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                        <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Your Message</label>
                                <textarea
                                    id="message"
                                    rows="5"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                    placeholder="Type your message here..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}