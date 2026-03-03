import React from 'react';
import Image from 'next/image';

const CompaniesSection = () => {
  const companies = [
    { name: 'vodafone', imgSrc: '/support-company/vodaphone.png' },
    { name: 'intel', imgSrc: '/support-company/intel.png' },
    { name: 'Tesla', imgSrc: '/support-company/tesla.png' },
    { name: 'AMD', imgSrc: '/support-company/amd.png' },
    { name: 'Talkit', imgSrc: '/support-company/talkit.png' },
  ];

  return (
    <section className=" px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg mb-8 text-left text-gray-400/70">
          Companies we helped grow
        </h2>
        <div className="flex flex-wrap justify-between items-center gap-8 md:gap-16">
          {companies.map((company) => (
            <div key={company.name} className="flex items-center space-x-2">
              <Image title={company.name} src={company.imgSrc} alt={company.name} width={100} height={25} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;