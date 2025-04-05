export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-white py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-red-500">
                        Privacy Policy
                    </h1>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 mb-6">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>

                        <div className="space-y-8">
                            <section>
                                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                                <p className="text-gray-300">
                                    Welcome to Movies Bazer. We respect your privacy and are committed to protecting your personal data.
                                    This privacy policy will inform you about how we look after your personal data when you visit our
                                    website and tell you about your privacy rights and how the law protects you.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
                                <p className="text-gray-300 mb-4">
                                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                                </p>
                                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                                    <li>Identity Data (name, username, etc.)</li>
                                    <li>Contact Data (email address, etc.)</li>
                                    <li>Technical Data (IP address, browser type, etc.)</li>
                                    <li>Usage Data (how you use our website)</li>
                                    <li>Marketing and Communications Data (your preferences)</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
                                <p className="text-gray-300">
                                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data:
                                </p>
                                <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
                                    <li>To provide and maintain our service</li>
                                    <li>To notify you about changes to our service</li>
                                    <li>To allow you to participate in interactive features</li>
                                    <li>To provide customer support</li>
                                    <li>To gather analysis or valuable information</li>
                                    <li>To monitor the usage of our service</li>
                                    <li>To detect, prevent and address technical issues</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                                <p className="text-gray-300">
                                    We have implemented appropriate security measures to prevent your personal data from being accidentally lost,
                                    used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data to those
                                    employees and other third parties who have a business need to know.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4">5. Your Legal Rights</h2>
                                <p className="text-gray-300 mb-4">
                                    Under certain circumstances, you have rights under data protection laws in relation to your personal data:
                                </p>
                                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                                    <li>Request access to your personal data</li>
                                    <li>Request correction of your personal data</li>
                                    <li>Request erasure of your personal data</li>
                                    <li>Object to processing of your personal data</li>
                                    <li>Request restriction of processing your personal data</li>
                                    <li>Request transfer of your personal data</li>
                                    <li>Right to withdraw consent</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
                                <p className="text-gray-300">
                                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                                    Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}