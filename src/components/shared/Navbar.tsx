import React from 'react';
import Link from 'next/link';
import { createRoute } from '@/lib/createRoute';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link  href={createRoute('/')} className="flex items-center space-x-2">
          <Image width={120} height={40} src={"/full_logo.png"} alt="QuickHire Logo" />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/jobs" className="text-gray-600 hover:text-blue-600 transition">
            Find Jobs
          </Link>
          <Link href="/companies" className="text-gray-600 hover:text-blue-600 transition">
            Browse Companies
          </Link>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600 transition">
            Login
          </Link>
          <Link 
            href="/signup" 
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;