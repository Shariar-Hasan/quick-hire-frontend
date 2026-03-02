import React from 'react';
import Link from 'next/link';

const PostingCTA = () => {
  return (
    <section className="bg-blue-600 px-6 py-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Start posting jobs today</h2>
        <p className="text-xl text-blue-100 mb-8">Start posting jobs for only $10.</p>
        <Link
          href="/signup"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Sign Up For Free
        </Link>
      </div>
    </section>
  );
};

export default PostingCTA;