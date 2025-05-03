"use client"

import { useState } from 'react';
import { FileText } from 'lucide-react';

export default function BioSection({ bio, artistStatement }) {
  const [expandedBio, setExpandedBio] = useState(false);
  const [expandedStatement, setExpandedStatement] = useState(false);
  
  const toggleBio = () => setExpandedBio(!expandedBio);
  const toggleStatement = () => setExpandedStatement(!expandedStatement);
  
  return (
    <div className="relative">        
        <div className="prose prose-purple max-w-none">
          {/* Bio with Read More functionality */}
          <div>
            <p className="text-gray-700 leading-relaxed first-letter:text-4xl first-letter:font-serif first-letter:text-purple-600 first-letter:mr-1 first-letter:float-left">
              {!expandedBio && bio?.length > 1600 
                ? bio.substring(0, 1600) + '...' 
                : bio}
            </p>
            {bio?.length > 1600 && !expandedBio && (
              <button 
                onClick={toggleBio}
                className="mt-2 text-purple-600 hover:text-purple-800 text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:underline"
              >
                Read more
              </button>
            )}
            {expandedBio && (
              <button 
                onClick={toggleBio}
                className="mt-2 text-purple-600 hover:text-purple-800 text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:underline"
              >
                Show less
              </button>
            )}
          </div>

          {artistStatement && (
            <>
              <h3 className="text-xl font-medium mt-8 mb-4 text-gray-800">Artist Statement</h3>
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400"></div>
                <div className="pl-4">
                  <p className="text-gray-700 leading-relaxed italic">
                    {!expandedStatement && artistStatement.length > 1600 
                      ? artistStatement.substring(0, 1600) + '...' 
                      : artistStatement}
                  </p>
                  {artistStatement.length > 1600 && !expandedStatement && (
                    <button 
                      onClick={toggleStatement}
                      className="mt-2 text-purple-600 hover:text-purple-800 text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:underline"
                    >
                      Read more
                    </button>
                  )}
                  {expandedStatement && (
                    <button 
                      onClick={toggleStatement}
                      className="mt-2 text-purple-600 hover:text-purple-800 text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:underline"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
    </div>
  );
}
