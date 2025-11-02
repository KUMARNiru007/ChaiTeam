import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import NoticeBoard from '../components/NoticeBoard.jsx';
import { batchService, groupService } from '../services/api.js';
import { useAuthStore } from '../store/useAuthStore.js';

function Dashboard() {
  const { darkMode, toggleTheme } = useTheme();
  const { checkAuth } = useAuthStore();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        checkAuth();

        // Get user's batches 
        const userBatches = await batchService.getAllBatches();

        // Get all batches to show total count 
        const allBatches = await batchService.getAllBatches();

        // Get user's groups and total groups across all batches
        let userGroupsCount = 0;
        let totalGroupsInBatches = 0;

        // Get groups for all batches to get total count
        for (const batch of allBatches) {
          try {
            const batchGroups = await groupService.getBatchGroups(batch.id);
            totalGroupsInBatches += batchGroups ? batchGroups.length : 0;
          } catch (err) {
            console.log(`No groups found for batch ${batch.id}:`, err.message);
          }
        }

        // Get user's groups from enrolled batches
        for (const batch of userBatches) {
          try {
            const userGroup = await groupService.getUserGroup(batch.id);
            if (userGroup) {
              userGroupsCount++;
            }
          } catch (err) {
            console.log(`No user group found for batch ${batch.id}:`, err.message);
          }
        }

       
        const totalBatches = allBatches.length;
        const enrolledBatches = userBatches.length;
        const availableGroups = totalGroupsInBatches;

        // Update stats
        const updatedStats = [
          {
            title: 'Total Batches',
            icon: 'ri-stack-line',
            value: totalBatches,
            total: `${totalBatches} Total`,
            pending: `${totalBatches} Available`,
            totalStatus: 'success',
            pendingStatus: 'info',
          },
          {
            title: 'My Groups',
            icon: 'ri-team-line',
            value: userGroupsCount,
            total: `${userGroupsCount} Joined`,
            pending: `${availableGroups > 0 ? availableGroups : 0} Available`,
            totalStatus: userGroupsCount > 0 ? 'success' : 'info',
            pendingStatus: availableGroups > 0 ? 'info' : 'error',
          },
          {
            title: 'Batch Enrolled',
            icon: 'ri-book-open-line',
            value: enrolledBatches,
            total: `${enrolledBatches} Enrolled`,
            pending: `${enrolledBatches} Active`,
            totalStatus: 'success',
            pendingStatus: 'success',
          },
        ];

        setStats(updatedStats);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');

      
        setStats([
          {
            title: 'Total Batches',
            icon: 'ri-grid-line',
            value: 0,
            total: '0 Total',
            pending: '0 Available',
            totalStatus: 'success',
            pendingStatus: 'info',
          },
          {
            title: 'My Groups',
            icon: 'ri-edit-line',
            value: 0,
            total: '0 Joined',
            pending: '0 Available',
            totalStatus: 'success',
            pendingStatus: 'error',
          },
          {
            title: 'Batch Enrolled',
            icon: 'ri-book-open-line',
            value: 0,
            total: '0 Enrolled',
            pending: '0 Active',
            totalStatus: 'success',
            pendingStatus: 'success',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [checkAuth]);

  const badges = [
    {
      label: 'Active Groups',
      icon: 'ri-team-fill',
      color: darkMode ? '#10b981' : '#059669',
      backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.1)',
    },
    {
      label: 'Group Leader',
      icon: 'ri-user-star-fill',
      color: darkMode ? '#f59e0b' : '#d97706',
      backgroundColor: darkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.1)',
    },
    {
      label: 'Batch Member',
      icon: 'ri-book-open-fill',
      color: darkMode ? '#3b82f6' : '#2563eb',
      backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
    },
    {
      label: 'Active Participant',
      icon: 'ri-user-voice-fill',
      color: darkMode ? '#8b5cf6' : '#7c3aed',
      backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(124, 58, 237, 0.1)',
    },
    {
      label: 'Project Contributor',
      icon: 'ri-git-repository-fill',
      color: darkMode ? '#ec4899' : '#db2777',
      backgroundColor: darkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(219, 39, 119, 0.1)',
    },
    {
      label: 'Community Member',
      icon: 'ri-community-fill',
      color: darkMode ? '#06b6d4' : '#0891b2',
      backgroundColor: darkMode ? 'rgba(6, 182, 212, 0.2)' : 'rgba(8, 145, 178, 0.1)',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div
            className='spinner'
            style={{
              border: '4px solid rgba(255, 161, 22, 0.8)',
              borderLeft: '4px solid #ffffff',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '1rem auto',
            }}
          ></div>
          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
          <p style={{ marginTop: '1rem', color: '#b3b3b3' }}>
            Loading...
          </p>
        </div>
    );
  }

  return (
    <>
      <div
        className={`${
          darkMode
            ? 'bg-[var(--chaihub-bg-primary)] text-white'
            : 'bg-white text-black'
        }`}
        style={{
          minHeight: '100vh',
          padding: '1rem',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1
              className={`${darkMode ? 'text-white' : 'text-black'}`}
              style={{
                fontSize: '30px',
                fontWeight: 'var(--font-weight-bold, 700)',
                margin: '0 0 0.5rem 0',
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--chaihub-border-secondary)',
                margin: 0,
              }}
            >
              Overview of your progress and upcoming deadlines.
            </p>
          </div>

          <button
            className='fixed z-10 right-12'
            onClick={toggleTheme}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: darkMode ? '1px solid #555' : '1px solid #ddd',
              backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
            }}
          >
            <i
              className={`ri-${darkMode ? 'sun' : 'moon'}-fill`}
              style={{
                color: `${darkMode ? '#ffffff' : '#000000'}`,
                fontSize: '18px',
              }}
            ></i>
          </button>
        </div>

        {error && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              darkMode
                ? 'bg-red-900/30 border border-red-700 text-red-300'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
          >
            <div className='flex items-center gap-2'>
              <i className='ri-error-warning-line'></i>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {stats.map((stat, index) => (
            <div
              className={`${
                darkMode
                  ? 'bg-[var(--chaihub-card-bg)] text-white hover:bg-[#313338]/50 hover:border-[#313338]/50'
                  : 'bg-white text-black border border-black/20 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
              }`}
              key={index}
              style={{
                borderRadius: '1.5rem',
                padding: '1.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--font-size-base, 1rem)',
                    fontWeight: 'var(--font-weight-medium, 500)',
                    margin: 0,
                  }}
                >
                  {stat.title}
                </h3>
                <i
                  className={stat.icon}
                  style={{
                    fontSize: '20px',
                    opacity: 0.8,
                  }}
                ></i>
              </div>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'var(--font-weight-light, 300)',
                  marginBottom: '0.5rem',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: 'var(--font-size-sm, 0.875rem)',
                    opacity: 0.8,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor:
                        stat.totalStatus === 'success'
                          ? '#00b8a3'
                          : stat.totalStatus === 'info'
                          ? '#1890ff'
                          : '#ff4d4f',
                    }}
                  ></span>
                  {stat.total}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: 'var(--font-size-sm, 0.875rem)',
                    opacity: 0.8,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor:
                        stat.pendingStatus === 'success'
                          ? '#00b8a3'
                          : stat.pendingStatus === 'info'
                          ? '#1890ff'
                          : '#ff4d4f',
                    }}
                  ></span>
                  {stat.pending}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Badges Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2
            className={`text-2xl underline underline-offset-3 ${
              darkMode
                ? 'decoration-[var(--chaihub-organe-dark)]'
                : 'decoration-[var(--chaihub-orange)]'
            }`}
            style={{
              fontWeight: 'var(--font-weight-bold, 700)',
              marginBottom: '1.5rem',
            }}
          >
            Activities
          </h2>

          {/* Badges */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            {badges.map((badge, index) => (
              <div
                key={index}
                style={{
                  padding: '0.75rem 1.25rem',
                  gap: '0.5rem',
                  fontSize: 'var(--font-size-sm, 0.875rem)',
                  fontWeight: 'var(--font-weight-medium, 500)',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '2rem',
                  backgroundColor: badge.backgroundColor,
                  color: badge.color,
                  border: `1px solid ${badge.color}20`,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <i 
                  className={badge.icon} 
                  style={{ 
                    fontSize: '16px',
                  }}
                ></i>
                {badge.label}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div style={{ marginBottom: '2rem' }}>
          <h2
            className={`text-2xl underline underline-offset-3 ${
              darkMode
                ? 'decoration-[var(--chaihub-organe-dark)]'
                : 'decoration-[var(--chaihub-orange)]'
            }`}
            style={{
              fontWeight: 'var(--font-weight-bold, 700)',
              marginBottom: '1.5rem',
            }}
          >
            Upcoming Deadlines
          </h2>

          <NoticeBoard />
        </div>
      </div>
    </>
  );
}

export default Dashboard;