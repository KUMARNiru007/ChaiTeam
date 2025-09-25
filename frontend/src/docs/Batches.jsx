import React, { useState } from 'react';

const Batches = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [activeTab, setActiveTab] = useState('live');

  // Sample batch 
  const batchesData = [
    {
      id: 1,
      name: "Full Stack Web Development",
      description: "Complete MERN stack development course with hands-on projects",
      cohort: "Web Dev Cohort",
      technology: "JavaScript , Node js , React",
      status: "live",
      startDate: "May 29, 2025, 12:30 PM",
      dueDate: "Sep 30, 2025, 11:59 PM",
      enrollments: 45,
      timeline: "Timeline"
    },
    {
      id: 2,
      name: "Data Science with Python Bootcamp",
      description: "Advanced data analysis and machine learning with Python",
      cohort: "Data Science Cohort", 
      technology: "Python",
      status: "live",
      startDate: "Jun 23, 2025, 9:00 AM",
      dueDate: "Oct 15, 2025, 11:59 PM",
      enrollments: 32,
      timeline: "Timeline"
    },
    {
      id: 3,
      name: "Mobile App Development Course",
      description: "Build cross-platform mobile apps with React Native",
      cohort: "Mobile Dev Cohort",
      technology: "React Native",
      status: "live", 
      startDate: "Jul 9, 2025, 9:00 AM",
      dueDate: "Nov 20, 2025, 11:59 PM",
      enrollments: 28,
      timeline: "Timeline"
    },
    {
      id: 4,
      name: "DevOps Engineering Bootcamp",
      description: "Complete DevOps pipeline with AWS and containerization",
      cohort: "DevOps Cohort",
      technology: "Docker/AWS",
      status: "live",
      startDate: "Aug 15, 2025, 10:00 AM", 
      dueDate: "Dec 30, 2025, 11:59 PM",
      enrollments: 18,
      timeline: "Timeline"
    },
    {
      id: 5,
      name: "UI/UX Design Masterclass",
      description: "Modern design principles and user experience optimization",
      cohort: "Design Cohort",
      technology: "Figma",
      status: "live",
      startDate: "Sep 1, 2025, 2:00 PM",
      dueDate: "Jan 15, 2026, 11:59 PM", 
      enrollments: 41,
      timeline: "Timeline"
    },
    {
      id: 6,
      name: "Blockchain Development Course",
      description: "Smart contracts and DApp development on Ethereum",
      cohort: "Blockchain Cohort",
      technology: "Solidity",
      status: "live",
      startDate: "Oct 1, 2025, 11:00 AM",
      dueDate: "Feb 28, 2026, 11:59 PM",
      enrollments: 15,
      timeline: "Timeline"
    }
  ];

  const tabCounts = {
    live: batchesData.filter(batch => batch.status === 'live').length,
    upcoming: 0,
    past: 4
  };

  const filteredBatches = batchesData.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.technology.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = batch.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const BatchCard = ({ batch }) => (
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
      {/* Batch Name */}
      <h3 style={{
        color: '#ffffff',
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '1rem',
        lineHeight: '1.4'
      }}>
        {batch.name}
      </h3>

      {/* Tags */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <i className="ri-group-line" style={{ 
            color: '#b3b3b3', 
            marginRight: '0.5rem',
            fontSize: '16px'
          }}></i>
          <span style={{ 
            color: '#b3b3b3',
            fontSize: '0.875rem'
          }}>
            {batch.cohort}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <i className="ri-code-line" style={{ 
            color: '#b3b3b3', 
            marginRight: '0.5rem',
            fontSize: '16px'
          }}></i>
          <span style={{ 
            color: '#b3b3b3',
            fontSize: '0.875rem'
          }}>
            {batch.technology}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <i className="ri-time-line" style={{ 
            color: '#b3b3b3', 
            marginRight: '0.5rem',
            fontSize: '16px'
          }}></i>
          <span style={{ 
            color: '#b3b3b3',
            fontSize: '0.875rem'
          }}>
            {batch.timeline}
          </span>
        </div>
      </div>

      {/* Start and Due Dates */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.25rem' }}>
          <span style={{ color: '#b3b3b3', fontSize: '0.875rem' }}>Start: </span>
          <span style={{ color: '#ffffff', fontSize: '0.875rem' }}>{batch.startDate}</span>
        </div>
        <div>
          <span style={{ color: '#b3b3b3', fontSize: '0.875rem' }}>Due: </span>
          <span style={{ color: '#ff4d4f', fontSize: '0.875rem' }}>{batch.dueDate}</span>
        </div>
      </div>

      {/* Enrollments */}
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
          Enrollments: {batch.enrollments}
        </span>
      </div>
    </div>
  );

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
            Batches
          </h1>
          <p style={{
            color: '#b3b3b3',
            fontSize: '1rem',
            margin: 0
          }}>
            Enroll and participate in your batches before the deadline.
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
            placeholder="Search Batches"
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
          <option>Web Dev Cohort</option>
          <option>Data Science Cohort</option>
          <option>Mobile Dev Cohort</option>
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
          <option>All Categories</option>
          <option>Full Stack</option>
          <option>Data Science</option>
          <option>Mobile Development</option>
        </select>

      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #404040',
        marginBottom: '2rem'
      }}>
        {[
          { key: 'live', label: 'Live', count: tabCounts.live },
          { key: 'upcoming', label: 'Upcoming', count: tabCounts.upcoming },
          { key: 'past', label: 'Past', count: tabCounts.past }
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

      {/* Batch Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredBatches.map(batch => (
          <BatchCard key={batch.id} batch={batch} />
        ))}
      </div>

      {/* Empty State */}
      {filteredBatches.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#8c8c8c'
        }}>
          <i className="ri-inbox-line" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No batches found</p>
          <p style={{ fontSize: '0.875rem' }}>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Batches;