import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <Image width={120} height={40} src="/full_logo.png" alt="QuickHire Logo" className='mb-2'/>
            <p className="text-gray-400 text-sm">
              Great platform for the job seeker that passionate about startups. Find your dream job easier.
            </p>
          </div>

          {/* About Column */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/companies" className="hover:text-white">Companies</Link></li>
              <li><Link href="#" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/#" className="hover:text-white">Terms</Link></li>
              <li><Link href="/#" className="hover:text-white">Advice</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/#" className="hover:text-white">Help Docs</Link></li>
              <li><Link href="/#" className="hover:text-white">Guide</Link></li>
              <li><Link href="/#" className="hover:text-white">Updates</Link></li>
              <li><Link href="/#" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-semibold mb-4">Get job notifications</h4>
            <p className="text-gray-400 text-sm mb-4">
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-3 py-2  text-gray-900  outline-white! bg-white border-white! focus:ring-1 focus:ring-white"
              />
              <button className="bg-primary px-4 py-2  hover:bg-primary/90 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <p>{new Date().getFullYear()} © QuickHire. All rights reserved.</p>
          <div className='flex gap-4 justify-around'>
            <Facebook className="h-6 w-6 mx-auto mt-2 text-gray-400 hover:text-white transition-colors cursor-pointer bg-gray-900 rounded-full inline-block" />
            <Twitter className="h-6 w-6 mx-auto mt-2 text-gray-400 hover:text-white transition-colors cursor-pointer bg-gray-900 rounded-full inline-block" />
            <Instagram className="h-6 w-6 mx-auto mt-2 text-gray-400 hover:text-white transition-colors cursor-pointer bg-gray-900 rounded-full inline-block" />
            <Linkedin className="h-6 w-6 mx-auto mt-2 text-gray-400 hover:text-white transition-colors cursor-pointer bg-gray-900 rounded-full inline-block" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;