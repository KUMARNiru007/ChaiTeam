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

        // Calculate statistics
        const totalBatches = allBatches.length;
        const enrolledBatches = userBatches.length;
        const availableGroups = totalGroupsInBatches;

        // Update stats with real data
        const updatedStats = [
          {
            title: 'Total Batches',
            icon: 'ri-grid-line',
            value: totalBatches,
            total: `${totalBatches} Total`,
            pending: `${totalBatches} Available`,
            totalStatus: 'success',
            pendingStatus: 'info',
          },
          {
            title: 'My Groups',
            icon: 'ri-edit-line',
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

        // Fallback to empty stats
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
      label: '0 Marks Earned',
      icon: 'ri-close-line',
      color: 'green-600',
      backgroundColor: 'green-200',
    },
    {
      label: '0 Peer Evaluations',
      icon: 'ri-checkbox-circle-line',
      color: 'green-600',
      backgroundColor: 'green-200',
    },
    {
      label: '0.0/5 Code Quality Rating',
      icon: 'ri-award-line',
      color: 'orange-600',
      backgroundColor: 'orange-200',
    },
    {
      label: '0.0/5 Writing Rating',
      icon: 'ri-award-line',
      color: 'orange-600',
      backgroundColor: 'orange-200',
    },
    {
      label: '0.0/5 Evaluation Rating',
      icon: 'ri-award-line',
      color: 'orange-600',
      backgroundColor: 'orange-200',
    },
    {
      label: '0 Penalty Marks',
      icon: 'ri-alert-line',
      color: 'red-600',
      backgroundColor: 'red-200',
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
            Loading dashboard...
          </p>
        </div>
    );
  }

  return (
    <>
      <div
        className={`${
          darkMode
            ? 'bg-[var(--chaiteam-bg-primary)] text-white'
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
                fontSize: '22px',
                fontWeight: 'var(--font-weight-bold, 700)',
                margin: '0 0 0.5rem 0',
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--chaiteam-text-secondary, #a0a0a0)',
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
                  ? 'bg-[var(--chaiteam-card-bg)] text-white hover:bg-[#313338]/50 hover:border-[#313338]/50'
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

        {/* Badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`rounded-lg flex justify-center items-center px-3 py-2 ${
                darkMode
                  ? `bg-${badge.backgroundColor.replace(
                      '200',
                      '900',
                    )} text-${badge.color.replace('600', '300')}`
                  : `bg-${badge.backgroundColor} text-${badge.color}`
              }`}
              style={{
                padding: '0.5rem 1rem',
                gap: '0.5rem',
                fontSize: 'var(--font-size-sm, 0.875rem)',
                fontWeight: 'var(--font-weight-medium, 500)',
              }}
            >
              <i className={badge.icon} style={{ fontSize: '14px' }}></i>
              {badge.label}
            </div>
          ))}
        </div>

        {/* Upcoming Deadlines */}
        <div style={{ marginBottom: '2rem' }}>
          <h2
            className={`text-2xl underline underline-offset-4 ${
              darkMode
                ? 'decoration-[var(--chaiteam-organe-dark)]'
                : 'decoration-[var(--chaiteam-orange)]'
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
