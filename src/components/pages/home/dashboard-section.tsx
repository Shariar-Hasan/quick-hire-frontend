import React from 'react';

const Dashboard = () => {
  return (
    <section className="bg-gray-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-xl p-6 h-fit">
            <div className="mb-8">
              <h3 className="font-bold text-xl text-gray-800 mb-6">QuickHire</h3>
              <nav className="space-y-4">
                <div>
                  <p className="text-gray-400 text-xs mb-2">MAIN</p>
                  {['Dashboard', 'Messages', 'Company Profile', 'All Applicants', 'Job Listing', 'My Schedule'].map((item) => (
                    <div key={item} className="text-gray-600 hover:text-blue-600 cursor-pointer py-2">
                      {item}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-2 mt-4">SETTINGS</p>
                  {['Settings', 'Help Center'].map((item) => (
                    <div key={item} className="text-gray-600 hover:text-blue-600 cursor-pointer py-2">
                      {item}
                    </div>
                  ))}
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Good morning, Maria</h2>
              <p className="text-gray-500">Here is your job listings statistics report from July 19 - July 25.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'New candidates to review', value: '16', change: '+3' },
                { label: 'Job views', value: '2,342', change: '+6.4k' },
                { label: 'Jobs Open', value: '12', sub: 'Jobs Opened' },
                { label: 'Applicants Summary', value: '67', subs: ['Full Time: 46', 'Internship: 32', 'Part-Time: 24', 'Contract: 30', 'Remote: 22'] },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6">
                  <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  {stat.change && <p className="text-green-600 text-sm mt-2">{stat.change}</p>}
                  {stat.subs && (
                    <div className="mt-3 text-xs text-gray-500 space-y-1">
                      {stat.subs.map((s, i) => <p key={i}>{s}</p>)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Job Statistics</h3>
                <div className="flex gap-4">
                  <span className="text-sm text-gray-500">Jobs View</span>
                  <span className="text-sm text-gray-500">Jobs Applied</span>
                </div>
              </div>
              <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Chart Placeholder (Mon-Sun statistics)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;