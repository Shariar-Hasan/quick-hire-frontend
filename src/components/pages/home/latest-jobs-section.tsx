import React from 'react';

const LatestJobs = () => {
  const jobs = [
    {
      position: 'Social Media Assistant',
      company: 'Nomad',
      location: 'Paris, France',
      type: 'Full-Time',
      tags: ['Marketing', 'Design'],
    },
    {
      position: 'Brand Designer',
      company: 'Dropbox',
      location: 'San Fransisco, USA',
      type: 'Full-Time',
      tags: ['Marketing', 'Design'],
    },
    {
      position: 'Interactive Developer',
      company: 'Terraform',
      location: 'Hamburg, Germany',
      type: 'Full-Time',
      tags: ['Marketing', 'Design'],
    },
    {
      position: 'HR Manager',
      company: 'Packer',
      location: 'Lucern, Switzerland',
      type: 'Full-Time',
      tags: ['Marketing', 'Design'],
    },
    {
      position: 'Social Media Assistant',
      company: 'Netflix',
      location: 'Paris, France',
      type: 'Full-Time',
      tags: ['Marketing', 'Design'],
    },
    {
      position: 'Brand Designer',
      company: 'Maze',
      location: 'San Fransisco, USA',
      type: 'Full-Time',
      tags: ['Marketing', 'Design'],
    },
    {
      position: 'Interactive Developer',
      company: 'Udacity',
      location: 'Hamburg, Germany',
      type: 'Full-Time',
      tags: ['Marketing', 'Design'],
    },
    {
      position: 'HR Manager',
      company: 'Webflow',
      location: 'Lucern, Switzerland',
      type: 'Full-Time',
      tags: ['Marketing', 'Design'],
    },
  ];

  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Latest jobs open</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map((job, index) => (
            <div key={index} className="border border-gray-200 p-6 rounded-xl hover:shadow-lg transition">
              <h3 className="font-semibold text-gray-900 mb-2">{job.position}</h3>
              <p className="text-gray-500 text-sm mb-3">{job.company} · {job.location}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                  {job.type}
                </span>
              </div>
              <div className="flex gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
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

export default LatestJobs;