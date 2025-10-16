import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

const GroupsPage = ({
  group,
  isOpen,
  onClose,
  userGroupId,
  onJoin,
  onLeave,
}) => {
  const [modalTab, setModalTab] = useState('overview');
  const { darkMode } = useTheme();

  if (!isOpen || !group) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.3s ease-in-out',
        }}
      />

      {/* Modal Content */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '93vh',
          backgroundColor: darkMode ? '#18181B' : '#ffffff',
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header with Handle Bar */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            backgroundColor: darkMode ? '#18181B' : '#ffffff',
            zIndex: 10,
            borderBottom: `1px solid ${darkMode ? '#27272A' : '#e5e7eb'}`,
          }}
        >
          {/* Handle Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '0.75rem',
              cursor: 'pointer',
            }}
            onClick={onClose}
          >
            <div
              style={{
                width: '40px',
                height: '4px',
                backgroundColor: darkMode ? '#404040' : '#d1d5db',
                borderRadius: '2px',
              }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: darkMode ? '#27272A' : '#f3f4f6',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              zIndex: 11,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode
                ? '#404040'
                : '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = darkMode
                ? '#27272A'
                : '#f3f4f6';
            }}
          >
            <i
              className='ri-close-line'
              style={{
                fontSize: '1.25rem',
                color: darkMode ? '#ffffff' : '#111827',
              }}
            ></i>
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {/* Banner with Logo Overlay */}
          <div style={{ position: 'relative', marginBottom: '3rem' }}>
            <div
              style={{
                width: '100%',
                height: '200px',
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
                bottom: '-50px',
                left: '1.5rem',
                width: '100px',
                height: '100px',
                backgroundColor: darkMode ? '#18181B' : '#ffffff',
                border: `4px solid ${darkMode ? '#18181B' : '#ffffff'}`,
                borderRadius: '1.25rem',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
                    fontSize: '2.5rem',
                    fontWeight: '700',
                  }}
                >
                  {group.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Group Header Info */}
          <div style={{ padding: '0 1.5rem 1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem',
              }}
            >
              <div style={{ flex: 1 }}>
                <h1
                  style={{
                    color: darkMode ? '#ffffff' : '#111827',
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                  }}
                >
                  {group.name}
                </h1>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      color: darkMode ? '#9ca3af' : '#6b7280',
                      fontSize: '0.938rem',
                      fontWeight: '500',
                    }}
                  >
                    {group.batchName || 'Games'}
                  </span>
                  <span style={{ color: darkMode ? '#404040' : '#d1d5db' }}>
                    •
                  </span>
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
                      fontSize: '0.813rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.5rem',
                      textTransform: 'capitalize',
                      fontWeight: '600',
                    }}
                  >
                    {group.status.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}
            >
              {userGroupId === group.id ? (
                <button
                  onClick={onLeave}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    backgroundColor: 'transparent',
                    border: `2px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
                    borderRadius: '0.75rem',
                    color: darkMode ? '#ffffff' : '#111827',
                    fontSize: '0.938rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode
                      ? '#F03F1D'
                      : '#F03F1D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Leave Group
                </button>
              ) : (
                <button
                  onClick={onJoin}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    backgroundColor: '#1890ff',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: 'white',
                    fontSize: '0.938rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  Join Group
                </button>
              )}
              <button
                style={{
                  padding: '0.875rem 1rem',
                  backgroundColor: 'transparent',
                  border: `2px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
                  borderRadius: '0.75rem',
                  color: darkMode ? '#ffffff' : '#111827',
                  fontSize: '0.938rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode
                    ? '#27272A'
                    : '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <i
                  className='ri-share-line'
                  style={{ fontSize: '1.125rem' }}
                ></i>
              </button>
            </div>

            {/* Stats Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: darkMode ? '#27272A' : '#f9fafb',
                borderRadius: '1rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: darkMode ? '#ffffff' : '#111827',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '0.25rem',
                  }}
                >
                  {group.member?.length || 0}
                </div>
                <div
                  style={{
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    fontSize: '0.813rem',
                  }}
                >
                  Members
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: darkMode ? '#ffffff' : '#111827',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '0.25rem',
                  }}
                >
                  {group.capacity || 4}
                </div>
                <div
                  style={{
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    fontSize: '0.813rem',
                  }}
                >
                  Capacity
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: darkMode ? '#ffffff' : '#111827',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '0.25rem',
                  }}
                >
                  {group.tags?.length || 0}
                </div>
                <div
                  style={{
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    fontSize: '0.813rem',
                  }}
                >
                  Tags
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                borderBottom: `2px solid ${darkMode ? '#27272A' : '#e5e7eb'}`,
                overflowX: 'auto',
              }}
            >
              {['overview', 'members', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: `3px solid ${
                      modalTab === tab ? '#1890ff' : 'transparent'
                    }`,
                    color:
                      modalTab === tab
                        ? darkMode
                          ? '#ffffff'
                          : '#111827'
                        : darkMode
                        ? '#9ca3af'
                        : '#6b7280',
                    fontSize: '0.938rem',
                    fontWeight: modalTab === tab ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {modalTab === 'overview' && (
              <OverviewTab group={group} darkMode={darkMode} />
            )}

            {modalTab === 'members' && (
              <MembersTab group={group} darkMode={darkMode} />
            )}

            {modalTab === 'activity' && (
              <ActivityTab group={group} darkMode={darkMode} />
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};

// Overview Tab Component
const OverviewTab = ({ group, darkMode }) => (
  <div>
    {/* Description Section */}
    <div style={{ marginBottom: '2rem' }}>
      <h3
        style={{
          color: darkMode ? '#ffffff' : '#111827',
          fontSize: '1.125rem',
          fontWeight: '600',
          marginBottom: '0.75rem',
        }}
      >
        About
      </h3>
      <p
        style={{
          color: darkMode ? '#b3b3b3' : '#6b7280',
          fontSize: '0.938rem',
          lineHeight: '1.6',
        }}
      >
        {group.description || 'No description available for this group.'}
      </p>
    </div>

    {/* Tags Section */}
    {group.tags && Array.isArray(group.tags) && group.tags.length > 0 && (
      <div style={{ marginBottom: '2rem' }}>
        <h3
          style={{
            color: darkMode ? '#ffffff' : '#111827',
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
          }}
        >
          Tags
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {group.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                backgroundColor: darkMode ? '#27272A' : '#f3f4f6',
                color: darkMode ? '#e5e7eb' : '#4b5563',
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                border: `1px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Group Leader Section */}
    <div style={{ marginBottom: '2rem' }}>
      <h3
        style={{
          color: darkMode ? '#ffffff' : '#111827',
          fontSize: '1.125rem',
          fontWeight: '600',
          marginBottom: '0.75rem',
        }}
      >
        Group Leader
      </h3>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: darkMode ? '#27272A' : '#f9fafb',
          borderRadius: '1rem',
          border: `1px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
        }}
      >
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: darkMode ? '#404040' : '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: darkMode ? '#ffffff' : '#111827',
          }}
        >
          {(group.leader?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: darkMode ? '#ffffff' : '#111827',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.25rem',
            }}
          >
            {group.leader?.name || 'Unknown'}
          </div>
          <div
            style={{
              color: darkMode ? '#9ca3af' : '#6b7280',
              fontSize: '0.875rem',
            }}
          >
            Group Leader
          </div>
        </div>
        <button
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: `2px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
            borderRadius: '0.5rem',
            color: darkMode ? '#ffffff' : '#111827',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          View Profile
        </button>
      </div>
    </div>

    {/* Group Info */}
    <div style={{ marginBottom: '2rem' }}>
      <h3
        style={{
          color: darkMode ? '#ffffff' : '#111827',
          fontSize: '1.125rem',
          fontWeight: '600',
          marginBottom: '0.75rem',
        }}
      >
        Group Information
      </h3>
      <div
        style={{
          backgroundColor: darkMode ? '#27272A' : '#f9fafb',
          borderRadius: '1rem',
          padding: '1rem',
          border: `1px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            borderBottom: `1px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
          }}
        >
          <span
            style={{
              color: darkMode ? '#9ca3af' : '#6b7280',
              fontSize: '0.938rem',
            }}
          >
            Created
          </span>
          <span
            style={{
              color: darkMode ? '#ffffff' : '#111827',
              fontSize: '0.938rem',
              fontWeight: '500',
            }}
          >
            {new Date(group.createdAT).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            borderBottom: `1px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
          }}
        >
          <span
            style={{
              color: darkMode ? '#9ca3af' : '#6b7280',
              fontSize: '0.938rem',
            }}
          >
            Batch
          </span>
          <span
            style={{
              color: darkMode ? '#ffffff' : '#111827',
              fontSize: '0.938rem',
              fontWeight: '500',
            }}
          >
            {group.batchName || 'N/A'}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
          }}
        >
          <span
            style={{
              color: darkMode ? '#9ca3af' : '#6b7280',
              fontSize: '0.938rem',
            }}
          >
            Group ID
          </span>
          <span
            style={{
              color: darkMode ? '#ffffff' : '#111827',
              fontSize: '0.938rem',
              fontWeight: '500',
              fontFamily: 'monospace',
            }}
          >
            #{group.id}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Members Tab Component
const MembersTab = ({ group, darkMode }) => (
  <div>
    <h3
      style={{
        color: darkMode ? '#ffffff' : '#111827',
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '1rem',
      }}
    >
      Members ({group.member?.length || 0}/{group.capacity || 4})
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {group.member && group.member.length > 0 ? (
        group.member.map((member, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: darkMode ? '#27272A' : '#f9fafb',
              borderRadius: '1rem',
              border: `1px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
            }}
          >
            <div
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                backgroundColor: darkMode ? '#404040' : '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem',
                fontWeight: '700',
                color: darkMode ? '#ffffff' : '#111827',
              }}
            >
              {(member.name || member.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: darkMode ? '#ffffff' : '#111827',
                  fontSize: '0.938rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                }}
              >
                {member.name || 'Member ' + (index + 1)}
              </div>
              <div
                style={{
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  fontSize: '0.813rem',
                }}
              >
                {member.email || 'member@example.com'}
              </div>
            </div>
            {member.id === group.leader?.id && (
              <span
                style={{
                  backgroundColor: '#1890ff33',
                  color: '#1890ff',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.625rem',
                  borderRadius: '0.375rem',
                  fontWeight: '600',
                }}
              >
                Leader
              </span>
            )}
          </div>
        ))
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: darkMode ? '#9ca3af' : '#6b7280',
          }}
        >
          <i
            className='ri-group-line'
            style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}
          ></i>
          <p style={{ fontSize: '0.938rem' }}>No members yet</p>
        </div>
      )}
    </div>
  </div>
);

// Activity Tab Component
const ActivityTab = ({ group, darkMode }) => (
  <div>
    <h3
      style={{
        color: darkMode ? '#ffffff' : '#111827',
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '1rem',
      }}
    >
      Recent Activity
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Group Created Activity */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: darkMode ? '#27272A' : '#f9fafb',
          borderRadius: '1rem',
          border: `1px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#52c41a33',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <i
            className='ri-user-add-line'
            style={{ color: '#52c41a', fontSize: '1.125rem' }}
          ></i>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: darkMode ? '#ffffff' : '#111827',
              fontSize: '0.938rem',
              marginBottom: '0.25rem',
            }}
          >
            <strong>{group.leader?.name || 'Leader'}</strong> created the group
          </div>
          <div
            style={{
              color: darkMode ? '#9ca3af' : '#6b7280',
              fontSize: '0.813rem',
            }}
          >
            {new Date(group.createdAT).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Members Joined Activity */}
      {group.member && group.member.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: darkMode ? '#27272A' : '#f9fafb',
            borderRadius: '1rem',
            border: `1px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#1890ff33',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <i
              className='ri-team-line'
              style={{ color: '#1890ff', fontSize: '1.125rem' }}
            ></i>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: darkMode ? '#ffffff' : '#111827',
                fontSize: '0.938rem',
                marginBottom: '0.25rem',
              }}
            >
              <strong>{group.member.length}</strong> member
              {group.member.length !== 1 ? 's' : ''} joined
            </div>
            <div
              style={{
                color: darkMode ? '#9ca3af' : '#6b7280',
                fontSize: '0.813rem',
              }}
            >
              Group is growing
            </div>
          </div>
        </div>
      )}

      {/* Tags Added Activity */}
      {group.tags && group.tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: darkMode ? '#27272A' : '#f9fafb',
            borderRadius: '1rem',
            border: `1px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#faad1433',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <i
              className='ri-price-tag-3-line'
              style={{ color: '#faad14', fontSize: '1.125rem' }}
            ></i>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: darkMode ? '#ffffff' : '#111827',
                fontSize: '0.938rem',
                marginBottom: '0.25rem',
              }}
            >
              Tags added to group
            </div>
            <div
              style={{
                color: darkMode ? '#9ca3af' : '#6b7280',
                fontSize: '0.813rem',
              }}
            >
              {group.tags.slice(0, 3).join(', ')}
              {group.tags.length > 3 && ` and ${group.tags.length - 3} more`}
            </div>
          </div>
        </div>
      )}

      {/* Settings Configured Activity */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: darkMode ? '#27272A' : '#f9fafb',
          borderRadius: '1rem',
          border: `1px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#722ed133',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <i
            className='ri-settings-3-line'
            style={{ color: '#722ed1', fontSize: '1.125rem' }}
          ></i>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: darkMode ? '#ffffff' : '#111827',
              fontSize: '0.938rem',
              marginBottom: '0.25rem',
            }}
          >
            Group settings configured
          </div>
          <div
            style={{
              color: darkMode ? '#9ca3af' : '#6b7280',
              fontSize: '0.813rem',
            }}
          >
            Capacity set to {group.capacity || 4} members
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default GroupsPage;
