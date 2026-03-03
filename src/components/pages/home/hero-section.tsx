'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    const q = search.trim();
    router.push(q ? `/jobs?search=${encodeURIComponent(q)}` : '/jobs');
  };

  return (
    <section className="relative bg-white overflow-hidden">

      {/* Mobile-only: pattern bg behind whole section */}
      <div
        className="absolute inset-0 md:hidden opacity-50"
        style={{
          backgroundImage: "url('/pattern.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row min-h-130">

        {/* Left content */}
        <div className="flex-1 flex flex-col justify-center px-6 py-16 md:py-24 z-10">

          <div className="text-4xl md:text-5xl flex flex-col mb-4 text-gray-900 font-bold font-clash">
            <span>Discover</span>
            <span className="my-1">more than</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4 font-clash">
            5000+ Jobs
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Great platform for the jobseeker that searching for new career heights and passionate about startups.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Job title or keyword"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
            />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search by company, location, etc."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
            />
            <button
              onClick={handleSearch}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition font-medium whitespace-nowrap"
            >
              Search Jobs
            </button>
          </div>

          {/* Popular tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-500 text-sm">Popular:</span>
            {['UI Designer', 'UX Researcher', 'Android', 'Admin'].map((tag) => (
              <button
                key={tag}
                onClick={() => router.push(`/jobs?search=${encodeURIComponent(tag)}`)}
                className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm hover:bg-primary/10 hover:text-primary transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right image panel — pattern bg desktop only */}
        <div
          className="relative hidden md:flex flex-1 overflow-hidden"
          style={{
            backgroundImage: "url('/pattern.png')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Hero man fills full height */}
          <Image
            src="/hero_man.png"
            alt="Hero"
            fill
            className="object-contain object-bottom z-10"
            priority
          />

          {/* White diagonal strip at bottom */}
          <div
            className="absolute z-20 bg-white"
            style={{
              bottom: '-60px',
              right: '-120px',
              width: '700px',
              height: '130px',
              transform: 'rotate(-27deg)',
              transformOrigin: 'center',
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
