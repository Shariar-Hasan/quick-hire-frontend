import React from 'react';
import Navbar from '@/components/shared/Navbar';
import HeroSection from '@/components/pages/home/hero-section';
import CompaniesSection from '@/components/pages/home/companies-section';
import CategoriesSection from '@/components/pages/home/categories-section';
import FeaturedJobs from '@/components/pages/home/featured-jobs-section';
import LatestJobs from '@/components/pages/home/latest-jobs-section';
import Dashboard from '@/components/pages/home/dashboard-section';
import PostingCTA from '@/components/pages/home/posting-cta-section';
import Footer from '@/components/shared/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CompaniesSection />
      <CategoriesSection />
      <FeaturedJobs />
      <LatestJobs />
      <PostingCTA />
      <Footer />
    </main>
  );
}