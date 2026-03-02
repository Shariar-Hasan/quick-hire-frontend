import React from 'react';
import Link from 'next/link';

const CategoriesSection = () => {
  const categories = [
    { name: 'Design', jobs: 235, icon: '🎨' },
    { name: 'Sales', jobs: 756, icon: '📊' },
    { name: 'Marketing', jobs: 140, icon: '📢' },
    { name: 'Finance', jobs: 325, icon: '💰' },
    { name: 'Technology', jobs: 890, icon: '💻' },
    { name: 'Engineering', jobs: 543, icon: '🔧' },
    { name: 'Business', jobs: 432, icon: '📈' },
    { name: 'Human Resource', jobs: 234, icon: '👥' },
  ];

  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Explore by category</h2>
          <Link href="/all-jobs" className="text-blue-600 hover:text-blue-700 font-medium">
            Show all jobs →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition cursor-pointer"
            >
              <span className="text-4xl mb-3 block">{category.icon}</span>
              <h3 className="font-semibold text-gray-800 text-lg">{category.name}</h3>
              <p className="text-gray-500">{category.jobs} jobs available</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;