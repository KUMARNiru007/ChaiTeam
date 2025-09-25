import React, { useState } from 'react';

const NoticeBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScope, setSelectedScope] = useState('All Scopes');
  const [selectedType, setSelectedType] = useState('All Types');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Sample notices 
  const noticesData = [
    {
      id: "notice-1",
      title: "Project Submission Deadline Extended",
      content: "Due to popular request, we're extending the final project submission deadline by one week. New deadline is October 15, 2025. Please make sure to submit your complete project with all required documentation and testing files.",
      scope: "BATCH", // noticeScope enum
      createdById: "user-1",
      groupId: null,
      batchId: "batch-1",
      isEdited: false,
      createdAt: "2025-09-20T14:30:00Z",
      updateAt: "2025-09-20T14:30:00Z",
      type: "URGENT", // noticeType enum
      // Related data (would come from joins in real app)
      createdBy: {
        id: "user-1",
        name: "John Smith",
        role: "INSTRUCTOR"
      },
      batch: {
        id: "batch-1",
        name: "Full Stack Web Development - Batch 2025",
        code: "FSWD-2025"
      },
      group: null
    },
    {
      id: "notice-2",
      title: "New Study Group Formation",
      content: "We're forming study groups for advanced React concepts. If you're interested in joining, please sign up by September 30th. This will help you prepare better for upcoming assessments and improve your coding skills through collaborative learning.",
      scope: "GROUP",
      createdById: "user-2",
      groupId: "group-1",
      batchId: "batch-1",
      isEdited: true,
      createdAt: "2025-09-22T10:15:00Z",
      updateAt: "2025-09-22T15:20:00Z",
      type: "NORMAL",
      createdBy: {
        id: "user-2",
        name: "Sarah Johnson",
        role: "TA"
      },
      batch: {
        id: "batch-1",
        name: "Full Stack Web Development - Batch 2025",
        code: "FSWD-2025"
      },
      group: {
        id: "group-1",
        name: "React Advanced Concepts",
        description: "Study group for advanced React topics"
      }
    },
    {
      id: "notice-3",
      title: "Campus Wi-Fi Maintenance Scheduled",
      content: "Network maintenance will be performed on September 28th from 2:00 AM to 6:00 AM. Internet access may be intermittent during this period. Please plan your online activities accordingly.",
      scope: "INSTITUTE",
      createdById: "user-3",
      groupId: null,
      batchId: null,
      isEdited: false,
      createdAt: "2025-09-21T16:45:00Z",
      updateAt: "2025-09-21T16:45:00Z",
      type: "ANNOUNCEMENT",
      createdBy: {
        id: "user-3",
        name: "IT Department",
        role: "ADMIN"
      },
      batch: null,
      group: null
    },
    {
      id: "notice-4",
      title: "Career Fair Registration Open",
      content: "Annual career fair registration is now open. Don't miss this opportunity to connect with top tech companies and startups. Register before October 5th to secure your spot and access to pre-event networking sessions.",
      scope: "INSTITUTE",
      createdById: "user-4",
      groupId: null,
      batchId: null,
      isEdited: false,
      createdAt: "2025-09-23T09:00:00Z",
      updateAt: "2025-09-23T09:00:00Z",
      type: "URGENT",
      createdBy: {
        id: "user-4",
        name: "Career Services Team",
        role: "DEPARTMENT"
      },
      batch: null,
      group: null
    },
    {
      id: "notice-5",
      title: "Weekly Code Review Session",
      content: "Join us for our weekly code review session where we'll discuss best practices, review student projects, and provide feedback on coding techniques.",
      scope: "BATCH",
      createdById: "user-1",
      groupId: null,
      batchId: "batch-1",
      isEdited: true,
      createdAt: "2025-09-24T11:30:00Z",
      updateAt: "2025-09-24T14:45:00Z",
      type: "NORMAL",
      createdBy: {
        id: "user-1",
        name: "John Smith",
        role: "INSTRUCTOR"
      },
      batch: {
        id: "batch-1",
        name: "Full Stack Web Development - Batch 2025",
        code: "FSWD-2025"
      },
      group: null
    }
  ];

  const tabCounts = {
    all: noticesData.length,
    urgent: noticesData.filter(notice => notice.type === 'URGENT').length,
    recent: noticesData.filter(notice => {
      const noticeDate = new Date(notice.createdAt);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return noticeDate >= threeDaysAgo;
    }).length
  };

  const filteredNotices = noticesData.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesScope = selectedScope === 'All Scopes' || 
                        (selectedScope === 'Institute' && notice.scope === 'INSTITUTE') ||
                        (selectedScope === 'Batch' && notice.scope === 'BATCH') ||
                        (selectedScope === 'Group' && notice.scope === 'GROUP');

    const matchesType = selectedType === 'All Types' ||
                       (selectedType === 'Normal' && notice.type === 'NORMAL') ||
                       (selectedType === 'Urgent' && notice.type === 'URGENT') ||
                       (selectedType === 'Announcement' && notice.type === 'ANNOUNCEMENT');
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'urgent' && notice.type === 'URGENT') ||
                      (activeTab === 'recent' && (() => {
                        const noticeDate = new Date(notice.createdAt);
                        const threeDaysAgo = new Date();
                        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                        return noticeDate >= threeDaysAgo;
                      })());
    
    return matchesSearch && matchesScope && matchesType && matchesTab;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'URGENT': return '#ff4d4f';
      case 'ANNOUNCEMENT': return '#ffa116';
      case 'NORMAL': return '#52c41a';
      default: return '#b3b3b3';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'URGENT': return 'ri-error-warning-line';
      case 'ANNOUNCEMENT': return 'ri-megaphone-line';
      case 'NORMAL': return 'ri-information-line';
      default: return 'ri-information-line';
    }
  };

  const getScopeIcon = (scope) => {
    switch (scope) {
      case 'INSTITUTE': return 'ri-building-line';
      case 'BATCH': return 'ri-team-line';
      case 'GROUP': return 'ri-group-line';
      default: return 'ri-global-line';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const NoticeCard = ({ notice, onClick }) => (
    <div 
      style={{
        backgroundColor: '#2d2d2d',
        border: notice.type === 'URGENT' ? '1px solid #ff4d4f' : '1px solid #404040',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        marginBottom: '1rem',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        position: 'relative',
        width: '100%'
      }}
      onClick={() => onClick(notice)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = notice.type === 'URGENT' ? '#ff7875' : '#525252';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = notice.type === 'URGENT' ? '#ff4d4f' : '#404040';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >      
      {/* Header with Type and Scope */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: getTypeColor(notice.type) + '20',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            gap: '0.25rem'
          }}>
            <i className={getTypeIcon(notice.type)} style={{ 
              color: getTypeColor(notice.type), 
              fontSize: '14px' 
            }}></i>
            <span style={{
              color: getTypeColor(notice.type),
              fontSize: '0.75rem',
              fontWeight: '500',
              textTransform: 'capitalize'
            }}>
              {notice.type.toLowerCase()}
            </span>
          </div>

          {notice.isEdited && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#404040',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              gap: '0.25rem'
            }}>
              <i className="ri-pencil-line" style={{ 
                color: '#8c8c8c', 
                fontSize: '12px' 
              }}></i>
              <span style={{
                color: '#8c8c8c',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Edited
              </span>
            </div>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#404040',
          padding: '0.375rem 0.75rem',
          borderRadius: '0.375rem',
          gap: '0.375rem'
        }}>
          <i className={getScopeIcon(notice.scope)} style={{ 
            color: '#b3b3b3', 
            fontSize: '14px' 
          }}></i>
          <span style={{
            color: '#b3b3b3',
            fontSize: '0.8rem',
            fontWeight: '500',
            textTransform: 'capitalize'
          }}>
            {notice.scope.toLowerCase()}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Left Content */}
        <div style={{ flex: 1, paddingRight: '1rem' }}>
          {/* Notice Title */}
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
            lineHeight: '1.4'
          }}>
            {notice.title}
          </h3>

          {/* Notice Preview Content */}
          <p style={{
            color: '#cccccc',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            margin: '0 0 1.25rem 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {notice.content}
          </p>

          {/* Author, Batch/Group, and Time Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="ri-user-line" style={{ 
                color: '#8c8c8c', 
                fontSize: '14px'
              }}></i>
              <span style={{ 
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginRight: '0.5rem'
              }}>
                {notice.createdBy.name}
              </span>
              <span style={{
                backgroundColor: '#404040',
                color: '#b3b3b3',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {notice.createdBy.role}
              </span>
            </div>

            {(notice.batch || notice.group) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className={notice.batch ? "ri-team-line" : "ri-group-line"} style={{ 
                  color: '#8c8c8c', 
                  fontSize: '14px'
                }}></i>
                <span style={{ 
                  color: '#b3b3b3',
                  fontSize: '0.8rem'
                }}>
                  {notice.batch ? notice.batch.name : notice.group?.name}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="ri-time-line" style={{ 
                color: '#8c8c8c', 
                fontSize: '14px'
              }}></i>
              <span style={{ 
                color: '#8c8c8c',
                fontSize: '0.8rem'
              }}>
                {formatDate(notice.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Arrow */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '0.5rem',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          transition: 'all 0.2s ease'
        }}>
          <i className="ri-arrow-right-line" style={{ 
            color: '#8c8c8c', 
            fontSize: '20px' 
          }}></i>
        </div>
      </div>
    </div>
  );

  const NoticePopup = ({ notice, onClose }) => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
    >
      <div style={{
        backgroundColor: '#2d2d2d',
        border: '1px solid #404040',
        borderRadius: '1rem',
        padding: '2.5rem',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#8c8c8c',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#404040';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#8c8c8c';
          }}
        >
          <i className="ri-close-line"></i>
        </button>

        {/* Header */}
        <div style={{ marginBottom: '2rem', paddingRight: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: getTypeColor(notice.type) + '20',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              gap: '0.5rem'
            }}>
              <i className={getTypeIcon(notice.type)} style={{ 
                color: getTypeColor(notice.type), 
                fontSize: '18px' 
              }}></i>
              <span style={{
                color: getTypeColor(notice.type),
                fontSize: '0.95rem',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {notice.type}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#404040',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              gap: '0.5rem'
            }}>
              <i className={getScopeIcon(notice.scope)} style={{ 
                color: '#b3b3b3', 
                fontSize: '16px' 
              }}></i>
              <span style={{
                color: '#b3b3b3',
                fontSize: '0.9rem',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {notice.scope} Level
              </span>
            </div>

            {notice.isEdited && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#404040',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                gap: '0.5rem'
              }}>
                <i className="ri-pencil-line" style={{ 
                  color: '#8c8c8c', 
                  fontSize: '16px' 
                }}></i>
                <span style={{
                  color: '#8c8c8c',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  Edited
                </span>
              </div>
            )}
          </div>

          <h2 style={{
            color: '#ffffff',
            fontSize: '1.75rem',
            fontWeight: '800',
            margin: 0,
            lineHeight: '1.3'
          }}>
            {notice.title}
          </h2>
        </div>

        {/* Content */}
        <div style={{
          color: '#e6e6e6',
          fontSize: '1.1rem',
          lineHeight: '1.7',
          marginBottom: '2.5rem',
          whiteSpace: 'pre-wrap'
        }}>
          {notice.content}
        </div>

        {/* Metadata */}
        <div style={{
          borderTop: '1px solid #404040',
          paddingTop: '2rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Author Info */}
            <div>
              <h4 style={{
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: '700',
                margin: '0 0 0.75rem 0'
              }}>
                Created By
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="ri-user-line" style={{ color: '#8c8c8c', fontSize: '18px' }}></i>
                <span style={{ color: '#e6e6e6', fontSize: '0.95rem', fontWeight: '500' }}>
                  {notice.createdBy.name}
                </span>
                <span style={{
                  backgroundColor: '#404040',
                  color: '#b3b3b3',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {notice.createdBy.role}
                </span>
              </div>
            </div>

            {/* Scope Info */}
            {(notice.batch || notice.group) && (
              <div>
                <h4 style={{
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  margin: '0 0 0.75rem 0'
                }}>
                  {notice.batch ? 'Batch' : 'Group'}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <i className={notice.batch ? "ri-team-line" : "ri-group-line"} style={{ 
                    color: '#8c8c8c', 
                    fontSize: '18px' 
                  }}></i>
                  <span style={{ color: '#e6e6e6', fontSize: '0.95rem', fontWeight: '500' }}>
                    {notice.batch ? notice.batch.name : notice.group?.name}
                  </span>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div>
              <h4 style={{
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: '700',
                margin: '0 0 0.75rem 0'
              }}>
                Timeline
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <i className="ri-time-line" style={{ color: '#8c8c8c', fontSize: '16px' }}></i>
                  <span style={{ color: '#8c8c8c', fontSize: '0.85rem' }}>
                    Created: {formatDate(notice.createdAt)}
                  </span>
                </div>
                {notice.isEdited && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <i className="ri-pencil-line" style={{ color: '#8c8c8c', fontSize: '16px' }}></i>
                    <span style={{ color: '#8c8c8c', fontSize: '0.85rem' }}>
                      Updated: {formatDate(notice.updateAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      color: '#ffffff'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '2rem',
        padding: '2rem 2rem 0 2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 0.5rem 0'
          }}>
            Notice Board
          </h1>
          <p style={{
            color: '#b3b3b3',
            fontSize: '1rem',
            margin: 0
          }}>
            Stay updated with important announcements and notifications.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(255, 161, 22, 0.3)',
            height: '40px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e6940f';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 161, 22, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffa116';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 161, 22, 0.3)';
          }}
          >
            <i className="ri-add-line" style={{ fontSize: '16px' }}></i>
            Create Notice
          </button>

          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#2d2d2d',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '1px solid #404040',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#404040';
            e.currentTarget.style.borderColor = '#525252';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2d2d2d';
            e.currentTarget.style.borderColor = '#404040';
          }}
          >
            <i className="ri-moon-line" style={{ color: '#ffffff', fontSize: '16px' }}></i>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '0 2rem'
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
            placeholder="Search notices..."
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
              outline: 'none',
              transition: 'border-color 0.2s ease',
              height: '40px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#ffa116'}
            onBlur={(e) => e.target.style.borderColor = '#404040'}
          />
        </div>

        {/* Scope Filter */}
        <select
          value={selectedScope}
          onChange={(e) => setSelectedScope(e.target.value)}
          style={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #404040',
            color: '#ffffff',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            outline: 'none',
            minWidth: '150px',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
            height: '40px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#ffa116'}
          onBlur={(e) => e.target.style.borderColor = '#404040'}
        >
          <option>All Scopes</option>
          <option>Institute</option>
          <option>Batch</option>
          <option>Group</option>
        </select>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #404040',
            color: '#ffffff',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            outline: 'none',
            minWidth: '150px',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
            height: '40px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#ffa116'}
          onBlur={(e) => e.target.style.borderColor = '#404040'}
        >
          <option>All Types</option>
          <option>Normal</option>
          <option>Urgent</option>
          <option>Announcement</option>
        </select>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #404040',
        marginBottom: '2rem',
        padding: '0 2rem'
      }}>
        {[
          { key: 'all', label: 'All Notices', count: tabCounts.all },
          { key: 'urgent', label: 'Urgent', count: tabCounts.urgent },
          { key: 'recent', label: 'Recent', count: tabCounts.recent }
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
            onMouseEnter={(e) => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.color = '#e6e6e6';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.color = '#b3b3b3';
              }
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Notice Cards Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {filteredNotices.map(notice => (
          <NoticeCard key={notice.id} notice={notice} onClick={setSelectedNotice} />
        ))}
      </div>

      {/* Empty State */}
      {filteredNotices.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          color: '#8c8c8c',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <i className="ri-notification-line" style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem', 
            display: 'block',
            color: '#525252'
          }}></i>
          <h3 style={{ 
            fontSize: '1.125rem', 
            marginBottom: '0.5rem',
            color: '#b3b3b3',
            fontWeight: '600'
          }}>
            No notices found
          </h3>
          <p style={{ 
            fontSize: '0.875rem',
            color: '#8c8c8c',
            lineHeight: '1.5'
          }}>
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}

      {/* Notice Popup */}
      {selectedNotice && (
        <NoticePopup 
          notice={selectedNotice} 
          onClose={() => setSelectedNotice(null)} 
        />
      )}
    </div>
  );
};

export default NoticeBoard;