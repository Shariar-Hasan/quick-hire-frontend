import React from 'react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="bg-white px-6 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1">
            {/* Discover Badge */}
            <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2 mb-6">
              <span className="text-gray-600">Discover</span>
              <span className="text-blue-600 font-bold ml-2">morethan</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              5000+ Jobs
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Great platform for the jobseeker that searching for new career heights and passionate about startups.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Florence, Italy"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                Search my job
              </button>
            </div>

            {/* Popular Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-500">Popular:</span>
              {['UI Designer', 'UX Researcher', 'Android', 'Admin'].map((tag) => (
                <span
                  key={tag}
                  className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Image Placeholder */}
          <div className="flex-1">
            <div className="bg-linear-to-br from-blue-100 to-purple-100 rounded-3xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Hero Image Placeholder</p>
                <p className="text-sm text-gray-400">(You can add your image here)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;