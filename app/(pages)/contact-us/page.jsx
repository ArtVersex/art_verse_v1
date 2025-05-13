"use client"
import React, { useState } from "react";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            console.log("Form submitted:", formData);
            setIsSubmitting(false);
            setIsSubmitted(true);
            
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ name: "", email: "", message: "" });
            }, 3000);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-800 to-indigo-900 flex items-center justify-center p-6 pt-10">
            {/* Artistic background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/api/placeholder/1200/800')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-400 blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-purple-400 blur-xl"></div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 max-w-lg w-full border border-white/30">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Get in Touch
                    </h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full mb-4"></div>
                    <p className="text-gray-600">
                        Looking for a customized design? We're excited to collaborate with you!
                    </p>
                </div>

                {isSubmitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-6">
                        <div className="text-green-500 text-5xl mb-4">✓</div>
                        <h3 className="text-xl font-semibold text-green-700 mb-2">Thank You!</h3>
                        <p className="text-green-600">We've received your message and will get back to you soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your name"
                                className="block w-full rounded-lg px-4 py-3 border border-gray-300 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your.email@example.com"
                                className="block w-full rounded-lg px-4 py-3 border border-gray-300 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                placeholder="How can we help you?"
                                className="block w-full rounded-lg px-4 py-3 border border-gray-300 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                rows="5"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full rounded-lg py-3 px-6 font-medium text-white transition-all ${
                                isSubmitting 
                                ? "bg-indigo-400 cursor-not-allowed" 
                                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-200/50"
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : "Send Message"}
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200/70">
                    <p className="text-center text-gray-600 mb-3">Or connect with us directly:</p>
                    <div className="flex justify-center space-x-4">
                        <a
                            href="https://wa.me/+919599761361"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md hover:shadow-green-200/50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            WhatsApp Us
                        </a>
                        <a
                            href="mailto:contact@example.com"
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md hover:shadow-blue-200/50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            Email Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;