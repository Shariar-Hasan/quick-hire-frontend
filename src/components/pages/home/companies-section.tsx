import React from 'react';
import Image from 'next/image';

const CompaniesSection = () => {
  const companies = [
    { name: 'vodafone', icon: '📱' },
    { name: 'intel', icon: '💻' },
    { name: 'TEL', icon: '📞' },
    { name: 'AMD', icon: '⚡' },
    { name: 'Talkit', icon: '💬' },
  ];

  return (
    <section className="bg-gray-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Companies we helped grow
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {companies.map((company) => (
            <div key={company.name} className="flex items-center space-x-2">
              <span className="text-3xl">{company.icon}</span>
              <span className="text-xl font-medium text-gray-600">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;