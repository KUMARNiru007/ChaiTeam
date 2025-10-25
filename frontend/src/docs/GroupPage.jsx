import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

const GroupsPage = ({ group, userGroupId, onJoin, onLeave, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!group) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'activity', label: 'Group Activity' },
    { id: 'notifications', label: 'Notifications' },
  ];

  const leader = group.member.find((mem) => mem.role === 'LEADER');

  return (
    <div style={{ padding: '1.5rem' }} className='parkinsans-light'>
      {/* Nav/Header */}
      <nav className='sticky top-0 w-full bg-white text-black p-2 flex items-center justify-between shadow-sm z-50'>
        <div>
          <button
            onClick={() => navigate(-1)}
            className='bg-slate-300 rounded-md p-1 text-xl pl-2 pr-2 cursor-pointer'
          >
            <i className='ri-arrow-left-line'></i>
          </button>
        </div>
        <div className='w-full h-full text-center flex flex-col items-center font-semibold text-xl'>
          <span>{group.name}</span>
        </div>
      </nav>

      {/* Header / Banner Section */}
      <div className='max-w-7xl mx-auto mt-0.5'>
        <div
          className={`relative mb-16 ${
            darkMode ? 'bg-[#2b2d31]' : 'bg-white border border-gray-200'
          }`}
        >
          <div className='h-48 w-full overflow-hidden relative'>
            <img
              src={
                group.groupImageUrl ||
                'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80'
              }
              alt={group.name}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
          </div>

          <div className='absolute -bottom-16 left-0 right-0 p-6'>
            <div className='flex items-end gap-6'>
              <div
                className={`w-24 h-24 rounded-2xl border-4 overflow-hidden shadow-xl ${
                  darkMode ? 'border-[#2b2d31]' : 'border-white'
                }`}
              >
                <img
                  src={
                    group.logoImageUrl ||
                    'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(group.name) +
                      '&size=96&background=5865f2&color=fff&bold=true'
                  }
                  alt={group.name}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
              darkMode
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-black/10 hover:bg-black/20 text-white'
            }`}
          >
            <i className={`ri-${darkMode ? 'sun' : 'moon'}-fill text-lg`}></i>
          </button>
        </div>
      </div>

      {/* Group Name + Actions */}
      <div className='w-full p-4 pl-6 pr-6 flex justify-between items-center'>
        <div className='text-2xl font-semibold flex flex-col'>
          {group.name}{' '}
          <span className='text-xs'>{group.member.length} Members</span>
        </div>
        <div className='flex gap-3'>
          <button className='p-2 px-4 rounded-md text-sm bg-[var(--chaiteam-orange)] hover:bg-[var(--chaiteam-orange-hover)] cursor-pointer'>
            Join Group
          </button>
          <button className='p-2 px-4 rounded-md text-sm bg-[var(--chaiteam-orange)] hover:bg-[var(--chaiteam-orange-hover)] cursor-pointer'>
            Edit Group
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-4 mb-4 mt-4 border-b border-gray-200'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold transition rounded-t-lg ${
              activeTab === tab.id
                ? 'border-b-2 border-[var(--chaiteam-orange)] text-[var(--chaiteam-orange)]'
                : darkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className={`p-4 rounded-lg ${
          darkMode ? 'bg-[#2b2d31]' : 'bg-white'
        } border border-gray-200`}
      >
        {activeTab === 'overview' && (
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col gap-1'>
              <span className='text-xl font-semibold'>About</span>
              <span className='text-sm'>{group.description}</span>
            </div>

            <div className='flex flex-col gap-1'>
              <span className='text-xl font-semibold'>Categories</span>
              <div className='text-sm flex gap-3'>
                {group.tags.map((tag) => (
                  <div
                    kay={tag}
                    className='py-1 px-2 rounded-lg border border-black w-auto hover:bg-gray-300'
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className='text-xl font-semibold'>Details</span>
              <div className='mt-1'>
                <div className='flex justify-between border border-b-0 rounded-t-lg border-black p-2 px-2'>
                  <span>Group Leader</span>
                  <span>{leader.name}</span>
                </div>
                <div className='flex justify-between border border-b-0 border-black p-2 px-2'>
                  <span>Total Members</span>
                  <span>{group.member.length} Members</span>
                </div>
                <div className='flex justify-between border border-b-0 border-black p-2 px-2'>
                  <span>Last Updated</span>
                  <span>
                    {new Date(group.updatedAT).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className='flex justify-between border rounded-b-lg border-black p-2 px-2'>
                  <span>Group ID</span>
                  <span>{group.id}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'members' && (
          <div className='space-y-8'>
            {/* Leader Section */}
            {leader && (
              <div>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Group Leader
                </h3>
                <div
                  className={`flex items-center gap-4 p-4 rounded-xl border ${
                    darkMode
                      ? 'bg-[#2b2d31] border-[#3a3b40]'
                      : 'bg-white border-gray-200'
                  } shadow-sm`}
                >
                  <div className='w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center text-xl font-bold text-white'>
                    {leader.name?.charAt(0).toUpperCase() || 'L'}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div
                      className={`font-semibold text-base ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {leader.name || 'Unknown'}
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {leader.email || 'leader@example.com'}
                    </div>
                  </div>
                  <span className='px-3 py-1 text-sm font-semibold rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'>
                    Leader
                  </span>
                </div>
              </div>
            )}

            {/* Members Section */}
            <div>
              <h3
                className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Members ({group.member.length})
              </h3>

              {group.member.length === 0 ? (
                <div
                  className={`flex flex-col items-center justify-center p-12 rounded-xl ${
                    darkMode ? 'bg-[#2b2d31]' : 'bg-white'
                  } border ${
                    darkMode ? 'border-[#3a3b40]' : 'border-gray-200'
                  }`}
                >
                  <i
                    className={`ri-group-line text-5xl mb-3 ${
                      darkMode ? 'text-gray-400' : 'text-gray-300'
                    }`}
                  ></i>
                  <p
                    className={`${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    No members yet
                  </p>
                </div>
              ) : (
                <div className='flex flex-col gap-3'>
                  {group.member.map((member, index) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border shadow-sm ${
                        darkMode
                          ? 'bg-[#2b2d31] border-[#3a3b40]'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className='w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-lg font-bold text-white'>
                        {member.name?.charAt(0).toUpperCase() || 'M'}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div
                          className={`font-medium text-sm ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {member.name || `Member ${index + 1}`}
                        </div>
                        <div
                          className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          } truncate`}
                        >
                          {member.email || 'member@example.com'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'activity' && (
          <div>Group Activity content goes here...</div>
        )}
        {activeTab === 'notifications' && (
          <div>Notifications content goes here...</div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;
