'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { createRoute, RoutesMapKey } from '@/lib/createRoute';
import Image from 'next/image';
import { Menu, X, Briefcase, Building2 } from 'lucide-react';

const navLinks = [
  { href: '/jobs', label: 'Find Jobs', icon: Briefcase },
  { href: '/companies', label: 'Browse Companies', icon: Building2 },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-gray-100 px-6 py-4 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo + desktop nav */}
          <div className="flex items-center justify-center gap-6">
            <Link href={createRoute('/')} className="flex items-center justify-center">
              <Image width={120} height={40} src="/full_logo.png" alt="QuickHire Logo" className="w-28" />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(l => (
                <Link key={l.href} href={createRoute(l.href as RoutesMapKey)} className="text-gray-600 hover:text-primary transition">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-4">
            <Link href={createRoute('/login')} className="hidden sm:inline-flex text-primary hover:text-white hover:bg-primary transition px-5 py-2">
              Login
            </Link>
            <Link href={createRoute('/register')} className="hidden sm:inline-flex bg-primary/80 text-white px-5 py-2 hover:bg-primary transition">
              Sign Up
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary transition"
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ──────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out md:hidden flex flex-col ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <Image width={110} height={36} src="/full_logo.png" alt="QuickHire Logo" />
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-primary transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={createRoute(l.href as RoutesMapKey)}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary/8 hover:text-primary transition font-medium"
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="px-4 pb-8 space-y-3 border-t pt-5">
          <Link
            href={createRoute('/login')}
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-full border border-primary text-primary py-2.5 rounded-lg hover:bg-primary hover:text-white transition font-medium"
          >
            Login
          </Link>
          <Link
            href={createRoute('/register')}
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 transition font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
