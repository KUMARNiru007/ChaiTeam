import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../services/api';
import CustomDropdown from '../components/CustomDropdown.jsx';
import GroupsPage from './GroupPage.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { toast } from 'sonner';

const Groups = ({ batchId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  // const [selectedGroup, setSelectedGroup] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const data = await groupService.getBatchGroups(batchId);
        console.log('Groups Data: ', data);
        setGroupsData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch groups:', err);
        setError('Failed to load groups. Please try again later.');
        toast.error('Failed to load groups. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (batchId) {
      fetchGroups();
    }
  }, [batchId]);

  const tabCounts = {
    active: groupsData.filter((group) => group.status === 'ACTIVE').length,
    inactive: groupsData.filter((group) => group.status === 'INACTIVE').length,
    disbanded: groupsData.filter((group) => group.status === 'DISBANNED')
      .length,
  };

  // Get all unique tags from groups
  const allTags = [
    ...new Set(
      groupsData
        .flatMap((group) => group.tags || [])
        .filter((tag) => tag && tag.trim() !== ''),
    ),
  ].sort();

  // Create options array for the dropdown
  const tagOptions = [
    { id: 'all-tags', label: 'All Tags' },
    ...allTags.map((tag, index) => ({
      id: `tag-${index}`,
      label: tag,
    })),
  ];

  const filteredGroups = groupsData.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.description &&
        group.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      selectedStatus === 'All Status' ? true : group.status === selectedStatus;
    const matchesTag =
      selectedTag === 'All Tags'
        ? true
        : group.tags &&
          Array.isArray(group.tags) &&
          group.tags.includes(selectedTag);
    const matchesTab =
      activeTab === 'active'
        ? group.status === 'ACTIVE'
        : activeTab === 'inactive'
        ? group.status === 'INACTIVE'
        : activeTab === 'disbanded'
        ? group.status === 'DISBANNED'
        : false;
    return matchesSearch && matchesStatus && matchesTag && matchesTab;
  });

  const openGroupPage = (group) => {
    navigate(`/groups/${group.id}`);
  };

  const closeGroupModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setSelectedGroup(null), 300);
  };

  const handleJoinGroup = () => {
    console.log('Join group:', selectedGroup.id);

    closeGroupModal();
  };

  const handleLeaveGroup = () => {
    console.log('Leave group:', selectedGroup.id);

    closeGroupModal();
  };

  return (
    <div className='parkinsans-light'>
      {/* Search Filters */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center'>
        {/* Search Input */}
        <div className='flex-1 w-full md:w-2/4'>
          <div className='relative'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
              <i
                className={`ri-search-line ${
                  darkMode ? 'text-gray-50' : 'text-black'
                }`}
              ></i>
            </span>
            <input
              type='text'
              placeholder='Search Groups'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl border ${
                darkMode
                  ? 'bg-[#27272A] text-white placeholder-gray-50 border-white/30'
                  : 'border-gray-300 bg-gray-50 text-gray-600 placeholder-gray-400 focus:bg-gray-100'
              } py-2 pl-9 pr-2 focus:outline-none md:w-4/4`}
            />
          </div>
        </div>

        {/* Tag Filter Dropdown */}
        <div className='relative w-full md:w-1/4'>
          <CustomDropdown
            options={tagOptions}
            placeholder='All Tags'
            onSelect={(option) => {
              console.log('Selected tag:', option.label);
              setSelectedTag(option.label || 'All Tags');
            }}
          />
        </div>
      </div>

      {/* Loading and error states */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div
            className='spinner'
            style={{
              border: '4px solid rgba(0, 0, 0, 0.1)',
              borderLeft: '4px solid #ffffff',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto',
            }}
          ></div>
          <p style={{ marginTop: '1rem', color: '#b3b3b3' }}>
            Loading groups...
          </p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ff4d4f' }}>
          <i className='ri-error-warning-line' style={{ fontSize: '2rem' }}></i>
          <p style={{ marginTop: '1rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              marginTop: '1rem',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      ) : (
        /* Groups Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginTop: '1.25rem',
          }}
        >
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => openGroupPage(group)}
                style={{
                  backgroundColor: darkMode ? '#27272A' : '#ffffff',
                  border: darkMode ? '1px solid #404040' : '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 16px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Banner Image with Logo Overlay */}
                <div style={{ position: 'relative', height: '120px' }}>
                  {/* Banner Image */}
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#404040',
                      backgroundImage: group.groupImageUrl
                        ? `url(${group.groupImageUrl})`
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />

                  {/* Logo Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-25px',
                      left: '1rem',
                      width: '60px',
                      height: '60px',
                      backgroundColor: darkMode ? '#18181B' : '#ffffff',
                      border: `3px solid ${darkMode ? '#27272A' : '#ffffff'}`,
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    {group.logoImageUrl ? (
                      <img
                        src={group.logoImageUrl}
                        alt={group.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background:
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#ffffff',
                          fontSize: '1.25rem',
                          fontWeight: '700',
                        }}
                      >
                        {group.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '2rem 1.25rem 1.25rem' }}>
                  {/* Title */}
                  <h3
                    style={{
                      color: darkMode ? '#ffffff' : '#111827',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '0.375rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {group.name}
                  </h3>

                  {/* Category/Batch Badge */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        color: darkMode ? '#9ca3af' : '#6b7280',
                        fontSize: '0.813rem',
                        fontWeight: '500',
                      }}
                    >
                      {group.batchName || 'Games'}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      color: darkMode ? '#b3b3b3' : '#6b7280',
                      fontSize: '0.813rem',
                      lineHeight: '1.4',
                      marginBottom: '0.875rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.25rem',
                    }}
                  >
                    {group.description || 'No description available'}
                  </p>

                  {/* Tags */}
                  {group.tags &&
                    Array.isArray(group.tags) &&
                    group.tags.length > 0 && (
                      <div
                        style={{
                          marginBottom: '0.875rem',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.375rem',
                        }}
                      >
                        {group.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: darkMode ? '#404040' : '#f3f4f6',
                              color: darkMode ? '#e5e7eb' : '#4b5563',
                              fontSize: '0.688rem',
                              padding: '0.188rem 0.5rem',
                              borderRadius: '0.375rem',
                              fontWeight: '500',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {group.tags.length > 3 && (
                          <span
                            style={{
                              color: darkMode ? '#9ca3af' : '#6b7280',
                              fontSize: '0.688rem',
                              padding: '0.188rem 0',
                              fontWeight: '500',
                            }}
                          >
                            +{group.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                  {/* Group Info */}
                  <div
                    style={{
                      marginBottom: '0.875rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.375rem',
                    }}
                  >
                    {/* Creator */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                      }}
                    >
                      <i
                        className='ri-user-line'
                        style={{
                          color: darkMode ? '#9ca3af' : '#6b7280',
                          fontSize: '0.813rem',
                        }}
                      ></i>
                      <span
                        style={{
                          color: darkMode ? '#b3b3b3' : '#6b7280',
                          fontSize: '0.75rem',
                        }}
                      >
                        {group.leader?.name || 'Unknown'}
                      </span>
                    </div>

                    {/* Members Count */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                      }}
                    >
                      <i
                        className='ri-group-line'
                        style={{
                          color: darkMode ? '#9ca3af' : '#6b7280',
                          fontSize: '0.813rem',
                        }}
                      ></i>
                      <span
                        style={{
                          color: darkMode ? '#b3b3b3' : '#6b7280',
                          fontSize: '0.75rem',
                        }}
                      >
                        {group.member?.length || 0} member
                        {(group.member?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{ marginTop: '0.375rem' }}>
                    <span
                      style={{
                        backgroundColor:
                          group.status === 'ACTIVE'
                            ? '#52c41a33'
                            : group.status === 'INACTIVE'
                            ? '#faad1433'
                            : group.status === 'DISBANNED'
                            ? '#ff4d4f33'
                            : '#1890ff33',
                        color:
                          group.status === 'ACTIVE'
                            ? '#52c41a'
                            : group.status === 'INACTIVE'
                            ? '#faad14'
                            : group.status === 'DISBANNED'
                            ? '#ff4d4f'
                            : '#1890ff',
                        fontSize: '0.688rem',
                        padding: '0.188rem 0.625rem',
                        borderRadius: '0.375rem',
                        textTransform: 'capitalize',
                        display: 'inline-block',
                      }}
                    >
                      {group.status.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '2rem',
                color: '#ffa116',
              }}
            >
              No groups found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* Group Modal */}
      {/* <GroupsPage
        group={selectedGroup}
        isOpen={isModalOpen}
        onClose={closeGroupModal}
        userGroupId={userGroupId}
        onJoin={handleJoinGroup}
        onLeave={handleLeaveGroup}
      /> */}
    </div>
  );
};

export default Groups;
