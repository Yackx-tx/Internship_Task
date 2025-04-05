import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, ArrowRight, Mail } from 'lucide-react';

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Fallback news data in case the API fails


  useEffect(() => {
    const fallbackNews = [
      {
        id: "news1",
        title: "New Superhero Movie Breaks Box Office Records",
        date: "May 15, 2023",
        excerpt: "The latest superhero blockbuster has shattered opening weekend records worldwide, grossing over $300 million in its first three days.",
        image: "/placeholder.svg?height=300&width=500",
      },
      {
        id: "news2",
        title: "Award-Winning Director Announces New Project",
        date: "May 12, 2023",
        excerpt: "The acclaimed filmmaker has revealed details about an upcoming psychological thriller set to begin production next month with an all-star cast.",
        image: "/placeholder.svg?height=300&width=500",
      },
      {
        id: "news3",
        title: "Classic Film Series Getting Modern Reboot",
        date: "May 10, 2023",
        excerpt: "A beloved film franchise from the 90s is being reimagined for today's audiences with a star-studded cast and cutting-edge visual effects.",
        image: "/placeholder.svg?height=300&width=500",
      },
      {
        id: "news4",
        title: "Streaming Platform Announces New Original Series",
        date: "May 8, 2023",
        excerpt: "A major streaming service has greenlit an ambitious new sci-fi series from renowned showrunners, with production set to begin this summer.",
        image: "/placeholder.svg?height=300&width=500",
      },
      {
        id: "news5",
        title: "Iconic Actor Returns for Sequel After Decade-Long Hiatus",
        date: "May 5, 2023",
        excerpt: "Fans are thrilled as a beloved actor confirms their return to a popular franchise after stepping away from the role over ten years ago.",
        image: "/placeholder.svg?height=300&width=500",
      },
      {
        id: "news6",
        title: "Film Festival Announces This Year's Lineup",
        date: "May 3, 2023",
        excerpt: "One of the world's most prestigious film festivals has revealed its official selection, featuring works from both established directors and newcomers.",
        image: "/placeholder.svg?height=300&width=500",
      },
    ];
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(false);

        // Since we don't have a real API for news, we'll use the fallback data
        // In a real app, you would fetch from an actual API endpoint
        setTimeout(() => {
          setNewsItems(fallbackNews);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading news:", error);
        setError(true);
        setNewsItems(fallbackNews);
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");

    // In a real app, you would send this to your backend
    console.log(`Subscribed with email: ${email}`);
  };

  return (
    <div className="bg-dark min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-3xl font-bold flex items-center">
            <span className="mr-3 p-2 rounded-full bg-primary/20">
              <Newspaper size={20} className="text-primary" />
            </span>
            Latest Movie News
          </h1>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-white px-4 py-3 rounded mb-6">
            <p>There was an error loading the latest news. Showing sample news instead.</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="bg-dark-lighter rounded-lg overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300"
              >
                <div className="h-48 bg-dark-light relative overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <Calendar size={14} className="mr-1" />
                    <span>{item.date}</span>
                  </div>
                  <h2 className="text-white text-xl font-bold mb-3 hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-3">{item.excerpt}</p>
                  <button className="flex items-center text-primary hover:text-primary-hover font-medium transition-colors">
                    Read More
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-r from-dark-lighter to-dark-light rounded-lg p-8 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-bold text-white mb-3">Subscribe to Our Newsletter</h2>
                <p className="text-gray-300">
                  Get the latest movie news, release dates, and exclusive content delivered straight to your inbox.
                </p>
              </div>
              <div className="md:w-1/3 w-full">
                {subscribed ? (
                  <div className="bg-green-900/30 border border-green-500 text-white px-4 py-3 rounded">
                    <p>Thank you for subscribing!</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="bg-dark text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-primary focus:outline-none w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
