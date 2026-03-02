import React from 'react';
import Image from 'next/image';

const FeaturedJobs = () => {
  const jobs = [
    {
      company: 'Revolut',
      logo: 'R',
      position: 'Email Marketing',
      location: 'Madrid, Spain',
      type: 'Full Time',
      tags: ['Marketing', 'Design'],
      bgColor: 'bg-purple-100',
    },
    {
      company: 'Dropbox',
      logo: 'D',
      position: 'Brand Designer',
      location: 'San Fransisco, US',
      type: 'Full Time',
      tags: ['Design', 'Business'],
      bgColor: 'bg-blue-100',
    },
    {
      company: 'Pitch',
      logo: 'P',
      position: 'Email Marketing',
      location: 'Berlin, Germany',
      type: 'Full Time',
      tags: ['Marketing', 'Design'],
      bgColor: 'bg-green-100',
    },
    {
      company: 'Blinklist',
      logo: 'B',
      position: 'Visual Designer',
      location: 'Granada, Spain',
      type: 'Full Time',
      tags: ['Design', 'Technology'],
      bgColor: 'bg-yellow-100',
    },
    {
      company: 'ClassPass',
      logo: 'C',
      position: 'Product Designer',
      location: 'Manchester, UK',
      type: 'Full Time',
      tags: ['Marketing', 'Design'],
      bgColor: 'bg-red-100',
    },
    {
      company: 'Canva',
      logo: 'C',
      position: 'Lead Designer',
      location: 'Ontario, Canada',
      type: 'Full Time',
      tags: ['Design', 'Business'],
      bgColor: 'bg-indigo-100',
    },
    {
      company: 'GoDaddy',
      logo: 'G',
      position: 'Brand Strategist',
      location: 'Marseille, France',
      type: 'Full Time',
      tags: ['Marketing', 'Technology'],
      bgColor: 'bg-pink-100',
    },
  ];

  return (
    <section className="bg-gray-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Featured jobs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <div key={index} className="bg-white p-6 rounded-xl hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${job.bgColor} rounded-lg flex items-center justify-center text-xl font-bold text-gray-700`}>
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.position}</h3>
                    <p className="text-gray-500 text-sm">{job.company} · {job.location}</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                  {job.type}
                </span>
              </div>
              
              <p className="text-gray-500 text-sm mb-4">
                {job.company} is looking for {job.position} to help team ma ...
              </p>
              
              <div className="flex gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;