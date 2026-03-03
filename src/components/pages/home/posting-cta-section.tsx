import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const PostingCTA = () => {
  return (
    <section className="bg-primary overflow-hidden p-3">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-5 md:gap-0">

        {/* Left — text + CTA */}
        <div className="flex-1 w-full md:w-auto md:text-left text-center py-6 sm:py-16 md:py-20 z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight font-clash">
            Start posting<br className='hidden md:inline-block'/>jobs today
          </h2>
          <p className="text-white/70 text-lg mb-10">Start posting jobs for only $10.</p>
          <Link
            href="/register"
            className="inline-block w-full md:w-auto border-2 bg-white text-gray-800  sm:bg-transparent border-white sm:text-white px-7 py-3 font-semibold hover:bg-white hover:text-primary transition"
          >
            Sign Up For Free
          </Link>
        </div>

        {/* Right — dashboard mockup */}
        <div className="flex-1 flex items-end justify-center md:justify-end relative min-h-70 md:min-h-95">
          {/* subtle glow behind image */}
          <div className="absolute inset-0 bg-white/5 skew-x-3 rounded-tl-3xl" />
          <Image
            src="/home_dashboard.png"
            alt="Dashboard preview"
            width={620}
            height={400}
            className="relative z-10 object-contain rounded-md object-bottom drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default PostingCTA;
