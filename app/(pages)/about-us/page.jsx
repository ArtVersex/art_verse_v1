"use client";
import React from "react";

const AboutUs = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-40 h-40 bg-indigo-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-52 h-52 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* HERO */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Aartverse
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-indigo-400 mx-auto rounded-full mb-8"></div>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-indigo-300">Aartverse</span> is a curated digital platform
            connecting independent artists with collectors and art lovers worldwide.
            We make discovering, buying, and commissioning original art simple,
            transparent, and deeply personal.
          </p>
        </section>

        {/* WHY AARTVERSE */}
        <section className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10 mb-12 border border-white/30">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Why Aartverse Exists
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            The art world has long been divided — talented artists struggle for visibility,
            while collectors find it difficult to discover authentic, original work
            beyond mass-produced or overly commercial platforms.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Aartverse was built to bridge this gap. We empower artists with a space to
            present their work professionally, and give collectors direct access
            to genuine creators — without unnecessary intermediaries.
          </p>
        </section>

        {/* WHAT WE OFFER */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "For Artists",
              text: "Create a verified profile, showcase your portfolio, sell original artworks, and receive custom commission requests from collectors who value your craft."
            },
            {
              title: "For Collectors",
              text: "Discover unique artists, explore curated artworks, purchase originals with confidence, or commission custom pieces tailored to your vision."
            },
            {
              title: "For Commissions",
              text: "A structured, transparent way to connect directly with artists for personalized artworks — from concept discussion to final delivery."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/85 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/30 hover:-translate-y-1 transition-all"
            >
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </section>

        {/* VISION */}
        <section className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10 mb-12 border border-white/30">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We envision a world where artists are discovered for their creativity,
            not algorithms — and where collecting art feels meaningful, transparent,
            and inspiring. Aartverse aims to become a trusted global destination
            for original art and artist-led commissions.
          </p>
        </section>

        {/* VALUES */}
        <section className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10 mb-16 border border-white/30">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Our Core Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Artist First",
                text: "We prioritize creative freedom, fair representation, and direct artist–collector relationships."
              },
              {
                title: "Authenticity",
                text: "Every artist and artwork on Aartverse is reviewed to ensure originality and trust."
              },
              {
                title: "Transparency",
                text: "Clear communication, honest pricing, and no hidden layers between artists and collectors."
              },
              {
                title: "Accessibility",
                text: "Art should be approachable — whether you are a first-time buyer or a seasoned collector."
              }
            ].map((value, idx) => (
              <div key={idx} className="bg-indigo-50/90 p-5 rounded-lg">
                <h3 className="font-medium text-indigo-700 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-700">{value.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DIFFERENTIATION */}
        <section className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10 mb-16 border border-white/30">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            What Makes Aartverse Different
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Unlike traditional galleries or generic marketplaces, Aartverse is built
            around curated discovery, verified artists, and direct communication.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Collectors can explore artist stories, view portfolios, purchase originals,
            or commission custom work — all within a single, trusted platform designed
            for long-term creative relationships.
          </p>
        </section>

        {/* QUOTE */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-10 text-white mb-16">
          <p className="text-xl md:text-2xl italic mb-6">
            “Art is not what you see, but what you make others feel.”
          </p>
          <p className="text-right text-white/80 font-medium">
            — Aartverse Philosophy
          </p>
        </section>

        {/* CTA */}
        <section className="text-center bg-white/85 backdrop-blur-md rounded-2xl shadow-xl p-10 border border-white/30">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Join the Aartverse Community
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Whether you’re an artist looking to showcase your work or a collector
            searching for meaningful art, Aartverse is your space to connect,
            create, and collect.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow hover:shadow-indigo-300/50 transition-all"
            >
              Explore Artists
            </a>
            <a
              href="/contact-us"
              className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all"
            >
              Contact Us
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;
