import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">QuickHire</h3>
            <p className="text-gray-400 text-sm">
              Great platform for the job seeker that passionate about startups. Find your dream job easier.
            </p>
          </div>

          {/* About Column */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/companies" className="hover:text-white">Companies</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              <li><Link href="/advice" className="hover:text-white">Advice</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help-docs" className="hover:text-white">Help Docs</Link></li>
              <li><Link href="/guide" className="hover:text-white">Guide</Link></li>
              <li><Link href="/updates" className="hover:text-white">Updates</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-semibold mb-4">Get job notifications</h4>
            <p className="text-gray-400 text-sm mb-4">
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-3 py-2 rounded-l-lg text-gray-900 focus:outline-none"
              />
              <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>2021 © QuickHire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;