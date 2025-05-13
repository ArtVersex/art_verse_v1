"use client";
import React from 'react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-800 to-indigo-900 py-16 px-4 sm:px-6 lg:px-8">
            {/* Artistic background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/api/placeholder/1200/800')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-400 blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-purple-400 blur-xl"></div>
            </div>
            
            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-3">
                        About Us
                    </h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
                    <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                        Welcome to <span className="font-semibold text-indigo-300">Aart VerseX</span>, a sanctuary where creativity meets purpose. 
                        We believe in the transformative power of art to inspire, connect, and make a lasting impact on the world.
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Our Story Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30 transform transition-all hover:shadow-2xl hover:-translate-y-1">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
                        <p className="text-gray-700 mb-4">
                            <span className="font-semibold text-indigo-600">Aart VerseX</span> was born in 2020 from a collective passion of artists who believed that art should be both accessible and meaningful. What began as a small exhibition in a local community space has evolved into a dynamic platform that connects creators and art lovers across the globe.
                        </p>
                        <p className="text-gray-700">
                            Our journey has been shaped by a commitment to authenticity and innovation, pushing boundaries while honoring artistic traditions. Through challenges and triumphs, we've remained dedicated to our core vision: creating a space where art transcends the ordinary and inspires meaningful connection.
                        </p>
                    </div>

                    {/* Vision Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30 transform transition-all hover:shadow-2xl hover:-translate-y-1">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
                        <p className="text-gray-700">
                            At <span className="font-semibold text-indigo-600">Aart VerseX</span>, we offer a diverse collection of artwork 
                            spanning multiple styles and mediums. Each piece is crafted with meticulous attention to detail, reflecting 
                            a deep connection to the world around us. From abstract expressions to intricate realism, our work aims to 
                            evoke emotions, spark conversations, and bring beauty into everyday life.
                        </p>
                    </div>

                    {/* Mission Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30 transform transition-all hover:shadow-2xl hover:-translate-y-1">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-gray-700">
                            Art has the unique ability to transcend boundaries and unite people from all walks of life. Through our creations, 
                            we strive to contribute to a global dialogue, addressing themes of hope, resilience, and the shared human experience. 
                            Whether you're an art enthusiast, a collector, or someone seeking inspiration, we invite you to explore our collections 
                            and join us on this artistic journey.
                        </p>
                    </div>

                    {/* Values Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30 transform transition-all hover:shadow-2xl hover:-translate-y-1">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-indigo-50/90 backdrop-blur-sm p-4 rounded-lg">
                                <h3 className="font-medium text-indigo-700 mb-2">Authenticity</h3>
                                <p className="text-gray-700">We believe in creating and promoting genuine art that speaks truth, regardless of current trends or conventions.</p>
                            </div>
                            <div className="bg-indigo-50/90 backdrop-blur-sm p-4 rounded-lg">
                                <h3 className="font-medium text-indigo-700 mb-2">Innovation</h3>
                                <p className="text-gray-700">We embrace experimentation and push creative boundaries while respecting artistic traditions.</p>
                            </div>
                            <div className="bg-indigo-50/90 backdrop-blur-sm p-4 rounded-lg">
                                <h3 className="font-medium text-indigo-700 mb-2">Inclusivity</h3>
                                <p className="text-gray-700">We celebrate diverse perspectives and create spaces where all artists and art enthusiasts feel welcomed.</p>
                            </div>
                            <div className="bg-indigo-50/90 backdrop-blur-sm p-4 rounded-lg">
                                <h3 className="font-medium text-indigo-700 mb-2">Sustainability</h3>
                                <p className="text-gray-700">We consider our environmental impact, prioritizing eco-friendly materials and practices wherever possible.</p>
                            </div>
                        </div>
                    </div>

                    {/* What Makes Us Unique */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30 transform transition-all hover:shadow-2xl hover:-translate-y-1">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">What Makes Us Unique</h2>
                        <p className="text-gray-700 mb-4">
                            <span className="font-semibold text-indigo-600">Aart VerseX</span> stands apart through our commitment to blending traditional artistic techniques with cutting-edge digital innovation. We've pioneered a process we call "Dimensional Translation," where classical art principles are reimagined through modern technological approaches.
                        </p>
                        <p className="text-gray-700">
                            Our collaborative studio model brings together artists from diverse backgrounds and disciplines, creating unexpected synergies and fresh perspectives. This cross-pollination of ideas allows us to create work that exists at the intersection of multiple art worlds—neither purely traditional nor exclusively contemporary, but thoughtfully balanced between heritage and innovation.
                        </p>
                    </div>

                    {/* Quote Section */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path d="M38.8,22.9c-0.7-3.7-3.8-6.6-7.6-7.4c-4.9-0.9-9.6,2.3-10.5,7.2c-0.6,3.1,0.5,6.1,2.9,8.1c-3.5,2.3-5.9,6.2-5.9,10.7
                                c0,7,5.7,12.7,12.7,12.7c7,0,12.7-5.7,12.7-12.7c0-4.6-2.5-8.6-6.1-10.8C38.5,28.1,39.3,25.6,38.8,22.9z" fill="white">
                                </path>
                                <path d="M76.8,22.9c-0.7-3.7-3.8-6.6-7.6-7.4c-4.9-0.9-9.6,2.3-10.5,7.2c-0.6,3.1,0.5,6.1,2.9,8.1c-3.5,2.3-5.9,6.2-5.9,10.7
                                c0,7,5.7,12.7,12.7,12.7s12.7-5.7,12.7-12.7c0-4.6-2.5-8.6-6.1-10.8C76.5,28.1,77.2,25.6,76.8,22.9z" fill="white">
                                </path>
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xl font-medium italic mb-6 leading-relaxed">
                                "Art is not what you see, but what you make others see."
                            </p>
                            <p className="text-white text-opacity-80 font-medium text-right">
                                — Edgar Degas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final Message */}
                <div className="mt-12 text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join Our Community</h2>
                    <p className="text-gray-700 mb-6">
                        Thank you for visiting <span className="font-semibold text-indigo-600">Aart VerseX</span>. Together, let's celebrate the beauty 
                        and power of art to shape a better world. Sign up for our newsletter to stay informed about upcoming exhibitions, artist spotlights, and special events.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <a href="/contact-us" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-200/50 w-full sm:w-auto">
                            Contact Us
                        </a>
                        <a href="/" className="px-6 py-3 bg-white/90 text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all w-full sm:w-auto">
                            Explore Gallery
                        </a>
                        <a href="/" className="px-6 py-3 bg-white/90 text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all w-full sm:w-auto">
                            Subscribe
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;