import React, { useState } from 'react';

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [activeTab, setActiveTab] = useState('active');

  // Sample groups data based on the schema
  const groupsData = [
    {
      id: 1,
      name: "React Masters",
      description: "Focused on advanced React patterns and state management",
      tags: ["React", "JavaScript", "Frontend"],
      leader_id: "leader1",
      leaderName: "John Smith",
      status: "active",
      batchId: "batch1",
      batchName: "Full Stack Web Development",
      capacity: 4,
      currentMembers: 3,
      createdAT: "Jun 15, 2025"
    },
    {
      id: 2,
      name: "Data Wizards",
      description: "Machine learning and data analysis enthusiasts",
      tags: ["Python", "ML", "Data Science"],
      leader_id: "leader2",
      leaderName: "Sarah Johnson",
      status: "active",
      batchId: "batch2",
      batchName: "Data Science with Python Bootcamp",
      capacity: 4,
      currentMembers: 4,
      createdAT: "Jul 2, 2025"
    },
    {
      id: 3,
      name: "Mobile Innovators",
      description: "Cross-platform mobile app development team",
      tags: ["React Native", "Mobile", "JavaScript"],
      leader_id: "leader3",
      leaderName: "Mike Chen",
      status: "active",
      batchId: "batch3",
      batchName: "Mobile App Development Course",
      capacity: 4,
      currentMembers: 2,
      createdAT: "Aug 10, 2025"
    },
    {
      id: 4,
      name: "Cloud Architects",
      description: "DevOps and cloud infrastructure specialists",
      tags: ["AWS", "Docker", "DevOps"],
      leader_id: "leader4",
      leaderName: "Emily Davis",
      status: "active",
      batchId: "batch4",
      batchName: "DevOps Engineering Bootcamp",
      capacity: 4,
      currentMembers: 4,
      createdAT: "Aug 25, 2025"
    },
    {
      id: 5,
      name: "Design Thinkers",
      description: "User-centered design and prototyping group",
      tags: ["Figma", "UX", "Design"],
      leader_id: "leader5",
      leaderName: "Alex Rodriguez",
      status: "active",
      batchId: "batch5",
      batchName: "UI/UX Design Masterclass",
      capacity: 4,
      currentMembers: 3,
      createdAT: "Sep 5, 2025"
    },
    {
      id: 6,
      name: "Blockchain Builders",
      description: "Smart contract development and DeFi projects",
      tags: ["Solidity", "Ethereum", "Web3"],
      leader_id: "leader6",
      leaderName: "David Kim",
      status: "active",
      batchId: "batch6",
      batchName: "Blockchain Development Course",
      capacity: 4,
      currentMembers: 2,
      createdAT: "Sep 20, 2025"
    }
  ];

  const tabCounts = {
    active: groupsData.filter(group => group.status === 'active').length,
    inactive: 0,
    disbanded: 2
  };

  const filteredGroups = groupsData.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = group.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const GroupCard = ({ group }) => {
    const isFull = group.currentMembers >= group.capacity;
    
    return (
      <div style={{
        backgroundColor: '#2d2d2d', 
        border: '1px solid #404040', 
        borderRadius: '0.5rem',
        padding: '1.5rem',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        height: 'fit-content'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#525252';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#404040';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
        {/* Group Name and Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.125rem',
            fontWeight: '600',
            margin: 0,
            lineHeight: '1.4'
          }}>
            {group.name}
          </h3>
          
          {isFull && (
            <span style={{
              backgroundColor: '#ff4d4f',
              color: '#ffffff',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              Full
            </span>
          )}
        </div>

        {/* Description */}
        <p style={{
          color: '#b3b3b3',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          margin: '0 0 1rem 0'
        }}>
          {group.description}
        </p>

        {/* Tags */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {group.tags.map((tag, index) => (
              <span key={index} style={{
                backgroundColor: '#404040',
                color: '#ffffff',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem'
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Group Info */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <i className="ri-user-star-line" style={{ 
              color: '#b3b3b3', 
              marginRight: '0.5rem',
              fontSize: '16px'
            }}></i>
            <span style={{ 
              color: '#b3b3b3',
              fontSize: '0.875rem'
            }}>
              Leader: 
            </span>
            <span style={{ 
              color: '#ffffff',
              fontSize: '0.875rem',
              marginLeft: '0.25rem'
            }}>
              {group.leaderName}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <i className="ri-book-line" style={{ 
              color: '#b3b3b3', 
              marginRight: '0.5rem',
              fontSize: '16px'
            }}></i>
            <span style={{ 
              color: '#b3b3b3',
              fontSize: '0.875rem'
            }}>
              Batch: 
            </span>
            <span style={{ 
              color: '#ffffff',
              fontSize: '0.875rem',
              marginLeft: '0.25rem'
            }}>
              {group.batchName}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <i className="ri-calendar-line" style={{ 
              color: '#b3b3b3', 
              marginRight: '0.5rem',
              fontSize: '16px'
            }}></i>
            <span style={{ 
              color: '#b3b3b3',
              fontSize: '0.875rem'
            }}>
              Created: 
            </span>
            <span style={{ 
              color: '#ffffff',
              fontSize: '0.875rem',
              marginLeft: '0.25rem'
            }}>
              {group.createdAT}
            </span>
          </div>
        </div>

        {/* Members Count */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#404040',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.25rem',
            display: 'inline-block'
          }}>
            <span style={{ 
              color: '#b3b3b3',
              fontSize: '0.875rem'
            }}>
              Members: {group.currentMembers}/{group.capacity}
            </span>
          </div>
          
          {/* Join/View Button */}
          <button style={{
            backgroundColor: isFull ? '#525252' : '#ffa116',
            color: '#ffffff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: isFull ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease'
          }}>
            {isFull ? 'View' : 'Join'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '2rem',
      color: '#ffffff'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 0.5rem 0'
          }}>
            Groups
          </h1>
          <p style={{
            color: '#b3b3b3',
            fontSize: '1rem',
            margin: 0
          }}>
            Join study groups and collaborate with your batch mates.
          </p>
        </div>
        
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#2d2d2d',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <i className="ri-moon-line" style={{ color: '#ffffff', fontSize: '16px' }}></i>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
          <i className="ri-search-line" style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#8c8c8c',
            fontSize: '16px'
          }}></i>
          <input
            type="text"
            placeholder="Search Groups"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              backgroundColor: '#2d2d2d',
              border: '1px solid #404040',
              color: '#ffffff',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>

        {/* Batch Filter */}
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          style={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #404040',
            color: '#ffffff',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            outline: 'none',
            minWidth: '150px'
          }}
        >
          <option>All Batches</option>
          <option>Full Stack Web Development</option>
          <option>Data Science with Python Bootcamp</option>
          <option>Mobile App Development Course</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #404040',
            color: '#ffffff',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            outline: 'none',
            minWidth: '150px'
          }}
        >
          <option>All Status</option>
          <option>Available</option>
          <option>Full</option>
        </select>

        {/* Create Group Button */}
        <button style={{
          backgroundColor: '#ffa116',
          color: '#ffffff',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6940f'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffa116'}
        >
          <i className="ri-add-line" style={{ fontSize: '16px' }}></i>
          Create Group
        </button>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #404040',
        marginBottom: '2rem'
      }}>
        {[
          { key: 'active', label: 'Active', count: tabCounts.active },
          { key: 'inactive', label: 'Inactive', count: tabCounts.inactive },
          { key: 'disbanded', label: 'Disbanded', count: tabCounts.disbanded }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0.75rem 0',
              marginRight: '2rem',
              color: activeTab === tab.key ? '#ffa116' : '#b3b3b3',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '2px solid #ffa116' : '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Group Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredGroups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#8c8c8c'
        }}>
          <i className="ri-team-line" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No groups found</p>
          <p style={{ fontSize: '0.875rem' }}>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Groups;