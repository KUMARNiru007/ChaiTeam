import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

const GroupsPage = ({ group, userGroupId, onJoin, onLeave, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { darkMode } = useTheme();

  if (!group) return null;

  const isUserMember = userGroupId === group.id;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <div
        className={`sticky top-0 z-50 ${
          darkMode ? 'bg-zinc-900' : 'bg-white'
        } border-b ${
          darkMode ? 'border-zinc-800' : 'border-gray-200'
        } shadow-sm`}
      >
        <div className='max-w-5xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <button
                onClick={onBack}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  darkMode
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <i className='ri-arrow-left-line text-xl'></i>
              </button>
              <div>
                <h1
                  className={`text-lg font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Group Details
                </h1>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <button
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  darkMode
                    ? 'bg-zinc-800 hover:bg-zinc-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <i
                  className={`ri-share-line text-lg ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                ></i>
              </button>
              <button
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  darkMode
                    ? 'bg-zinc-800 hover:bg-zinc-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <i
                  className={`ri-more-2-fill text-lg ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-5xl mx-auto px-6 py-8'>
        {/* Group Header Section */}
        <div
          className={`rounded-xl p-8 mb-6 ${
            darkMode ? 'bg-zinc-900' : 'bg-white'
          } border ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}
        >
          <div className='flex flex-col md:flex-row gap-6 items-start'>
            {/* Group Info */}
            <div className='flex-1'>
              <h2
                className={`text-3xl font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {group.name}
              </h2>
              <div className='flex items-center gap-3 flex-wrap mb-6'>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {group.batchName || 'General'}
                </span>
                <span className={darkMode ? 'text-zinc-700' : 'text-gray-300'}>
                  •
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                    group.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : group.status === 'INACTIVE'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {group.status.toLowerCase()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3'>
                {isUserMember ? (
                  <button
                    onClick={onLeave}
                    className={`px-6 py-3 rounded-lg font-semibold text-sm transition-colors ${
                      darkMode
                        ? 'bg-zinc-800 hover:bg-red-600 text-white border border-zinc-700'
                        : 'bg-white hover:bg-red-500 hover:text-white text-gray-900 border-2 border-gray-300'
                    }`}
                  >
                    <i className='ri-logout-box-r-line mr-2'></i>
                    Leave Group
                  </button>
                ) : (
                  <button
                    onClick={onJoin}
                    className='px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-colors'
                  >
                    <i className='ri-user-add-line mr-2'></i>
                    Join Group
                  </button>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-3 gap-4'>
              {[
                {
                  label: 'Members',
                  value: group.member?.length || 0,
                  icon: 'ri-group-line',
                },
                {
                  label: 'Capacity',
                  value: group.capacity || 4,
                  icon: 'ri-user-settings-line',
                },
                {
                  label: 'Tags',
                  value: group.tags?.length || 0,
                  icon: 'ri-price-tag-3-line',
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg text-center ${
                    darkMode ? 'bg-zinc-800' : 'bg-gray-50'
                  } border ${darkMode ? 'border-zinc-700' : 'border-gray-200'}`}
                >
                  <i
                    className={`${stat.icon} text-2xl mb-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  ></i>
                  <div
                    className={`text-2xl font-bold mb-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`mb-6 p-1.5 rounded-lg inline-flex gap-2 ${
            darkMode ? 'bg-zinc-900' : 'bg-white'
          } border ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}
        >
          {['overview', 'members', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-zinc-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className={`rounded-lg p-6 ${
            darkMode ? 'bg-zinc-900' : 'bg-white'
          } border ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}
        >
          {activeTab === 'overview' && (
            <OverviewTab group={group} darkMode={darkMode} />
          )}
          {activeTab === 'members' && (
            <MembersTab group={group} darkMode={darkMode} />
          )}
          {activeTab === 'activity' && (
            <ActivityTab group={group} darkMode={darkMode} />
          )}
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ group, darkMode }) => (
  <div className='space-y-6'>
    {/* About Section */}
    <div>
      <h3
        className={`text-lg font-bold mb-3 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        About
      </h3>
      <p
        className={`text-sm leading-relaxed ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        {group.description || 'No description available for this group.'}
      </p>
    </div>

    {/* Tags Section */}
    {group.tags && Array.isArray(group.tags) && group.tags.length > 0 && (
      <div>
        <h3
          className={`text-lg font-bold mb-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Tags
        </h3>
        <div className='flex flex-wrap gap-2'>
          {group.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                darkMode
                  ? 'bg-zinc-800 text-gray-300 border border-zinc-700'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Group Leader */}
    <div>
      <h3
        className={`text-lg font-bold mb-3 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        Group Leader
      </h3>
      <div
        className={`flex items-center gap-4 p-4 rounded-lg ${
          darkMode ? 'bg-zinc-800' : 'bg-gray-50'
        } border ${darkMode ? 'border-zinc-700' : 'border-gray-200'}`}
      >
        <div className='w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-lg font-bold text-gray-900'>
          {(group.leader?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div className='flex-1'>
          <div
            className={`font-bold text-base mb-1 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {group.leader?.name || 'Unknown'}
          </div>
          <div
            className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Group Leader
          </div>
        </div>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            darkMode
              ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
              : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'
          }`}
        >
          View Profile
        </button>
      </div>
    </div>

    {/* Group Info */}
    <div>
      <h3
        className={`text-lg font-bold mb-3 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        Information
      </h3>
      <div
        className={`rounded-lg overflow-hidden ${
          darkMode ? 'bg-zinc-800' : 'bg-gray-50'
        } border ${darkMode ? 'border-zinc-700' : 'border-gray-200'}`}
      >
        {[
          {
            label: 'Created',
            value: new Date(group.createdAT).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
          },
          { label: 'Batch', value: group.batchName || 'N/A' },
          { label: 'Group ID', value: `#${group.id}`, mono: true },
        ].map((info, idx, arr) => (
          <div
            key={idx}
            className={`flex justify-between items-center p-4 ${
              idx !== arr.length - 1
                ? `border-b ${darkMode ? 'border-zinc-700' : 'border-gray-200'}`
                : ''
            }`}
          >
            <span
              className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {info.label}
            </span>
            <span
              className={`text-sm font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              } ${info.mono ? 'font-mono' : ''}`}
            >
              {info.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MembersTab = ({ group, darkMode }) => (
  <div>
    <h3
      className={`text-lg font-bold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}
    >
      Members ({group.member?.length || 0}/{group.capacity || 4})
    </h3>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
      {group.member && group.member.length > 0 ? (
        group.member.map((member, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 rounded-lg ${
              darkMode ? 'bg-zinc-800' : 'bg-gray-50'
            } border ${darkMode ? 'border-zinc-700' : 'border-gray-200'}`}
          >
            <div className='w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-lg font-bold text-gray-900 shrink-0'>
              {(member.name || member.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className='flex-1 min-w-0'>
              <div
                className={`font-semibold text-sm mb-1 truncate ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {member.name || `Member ${index + 1}`}
              </div>
              <div
                className={`text-xs truncate ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {member.email || 'member@example.com'}
              </div>
            </div>
            {member.id === group.leader?.id && (
              <span className='bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-lg shrink-0'>
                Leader
              </span>
            )}
          </div>
        ))
      ) : (
        <div
          className={`col-span-full text-center py-12 rounded-lg ${
            darkMode ? 'bg-zinc-800' : 'bg-gray-50'
          }`}
        >
          <i
            className={`ri-group-line text-5xl mb-3 ${
              darkMode ? 'text-gray-600' : 'text-gray-300'
            }`}
          ></i>
          <p
            className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            No members yet
          </p>
        </div>
      )}
    </div>
  </div>
);

const ActivityTab = ({ group, darkMode }) => {
  // Generate activities based on group data
  const activities = [];

  // Group creation activity
  activities.push({
    icon: 'ri-user-add-line',
    title: `${group.leader?.name || 'Leader'} created the group`,
    time: new Date(group.createdAT).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  });

  // Individual member join activities
  if (group.member && group.member.length > 0) {
    group.member.forEach((member) => {
      // Skip the leader as they created the group
      if (member.id !== group.leader?.id) {
        activities.push({
          icon: 'ri-user-follow-line',
          title: `${member.name || 'A member'} joined the group`,
          time: 'Recently',
        });
      }
    });
  }

  // Tags configuration activity
  if (group.tags && group.tags.length > 0) {
    activities.push({
      icon: 'ri-price-tag-3-line',
      title: 'Tags added to group',
      time: `${group.tags.slice(0, 3).join(', ')}${
        group.tags.length > 3 ? ` and ${group.tags.length - 3} more` : ''
      }`,
    });
  }

  // Group settings activity
  activities.push({
    icon: 'ri-settings-3-line',
    title: 'Group settings configured',
    time: `Capacity set to ${group.capacity || 4} members`,
  });

  return (
    <div>
      <h3
        className={`text-lg font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        Recent Activity
      </h3>
      <div className='space-y-3'>
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className={`flex gap-4 p-4 rounded-lg ${
              darkMode ? 'bg-zinc-800' : 'bg-gray-50'
            } border ${darkMode ? 'border-zinc-700' : 'border-gray-200'}`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                darkMode ? 'bg-zinc-700' : 'bg-gray-200'
              }`}
            >
              <i
                className={`${activity.icon} text-lg ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              ></i>
            </div>
            <div className='flex-1 min-w-0'>
              <div
                className={`text-sm mb-1 font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {activity.title}
              </div>
              <div
                className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsPage;
