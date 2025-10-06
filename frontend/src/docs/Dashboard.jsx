import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

function Dashboard() {
  const { darkMode, toggleTheme } = useTheme();

  const stats = [
    {
      title: 'Projects',
      icon: 'ri-grid-line',
      value: 0,
      total: '39 Total',
      pending: '39 Pending',
      totalStatus: 'success',
      pendingStatus: 'error',
    },
    {
      title: 'Blogs',
      icon: 'ri-edit-line',
      value: 8,
      total: '37 Total',
      pending: '29 Pending',
      totalStatus: 'success',
      pendingStatus: 'error',
    },
    {
      title: 'Batch Enrolled',
      icon: 'ri-book-open-line',
      value: 1,
      total: '1 Completed',
      pending: '0 Ongoing',
      totalStatus: 'success',
      pendingStatus: 'error',
    },
  ];

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

  return (
    <>
      <link
        href='https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css'
        rel='stylesheet'
      />
      <div
        className={`${
          darkMode
            ? 'bg-[var(--chaiteam-bg-primary)] text-white'
            : 'bg-white text-black'
        }`}
        style={{
          // backgroundColor: 'var(--chaiteam-bg-primary, #1a1a1a)',
          minHeight: '100vh',
          padding: '1rem',
          // color: 'var(--chaiteam-text-primary, #ffffff)',
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
              // backgroundColor: "#2d2d2d",
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
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
                // backgroundColor: 'var(--chaiteam-bg-secondary, #2a2a2a)',
                // border: '1px solid',
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
                  // marginBottom: '1rem',
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--font-size-base, 1rem)',
                    fontWeight: 'var(--font-weight-medium, 500)',
                    // color: 'var(--chaiteam-text-secondary, #a0a0a0)',
                    margin: 0,
                  }}
                >
                  {stat.title}
                </h3>
                <i
                  className={stat.icon}
                  style={{
                    fontSize: '20px',
                    // color: 'var(--chaiteam-text-secondary, #a0a0a0)',
                  }}
                ></i>
              </div>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'var(--font-weight-light, 300)',
                  // color: 'var(--chaiteam-text-primary, #ffffff)',
                  // marginBottom: '0.2rem',
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
                    // color: 'var(--chaiteam-text-secondary, #a0a0a0)',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor:
                        stat.totalStatus === 'success' ? '#00b8a3' : '#ff4d4f',
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
                    // color: 'var(--chaiteam-text-secondary, #a0a0a0)',
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
              className={`text-${badge.color} bg-${badge.backgroundColor} rounded-lg flex justify-center items-center`}
              key={index}
              style={{
                // backgroundColor: 'rgba(0, 0, 0, 0.3)',
                // border: `1px solid ${badge.color}`,
                // borderRadius: '0.375rem',
                padding: '0.3rem 1rem',
                // display: 'flex',
                // alignItems: 'center',
                gap: '0.5rem',
                // color: badge.color,
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
            className='text-2xl underline underline-offset-4 decoration-[var(--chaiteam-organe-dark)]'
            style={{
              // fontSize: 'var(--font-size-h2, 1.5rem)',
              fontWeight: 'var(--font-weight-bold, 700)',
              marginBottom: '1.5rem',
            }}
          >
            Upcoming Deadlines
          </h2>

          <div
            className={`${
              darkMode
                ? 'bg-[var(--chaiteam-card-bg)] text-white border border-gray-400/20'
                : 'bg-white text-black border border-black/20'
            }`}
            style={{
              // backgroundColor: 'var(--chaiteam-bg-secondary, #2a2a2a)',
              // border: '1px solid var(--chaiteam-border-primary, #3a3a3a)',
              borderRadius: '1rem',
              padding: '1.5rem',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-xl, 1.25rem)',
                fontWeight: 'var(--font-weight-semibold, 600)',
                marginBottom: '0.75rem',
              }}
            >
              Team Builder SaaS
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                // color: 'var(--chaiteam-text-secondary, #a0a0a0)',
                fontSize: 'var(--font-size-sm, 0.875rem)',
                marginBottom: '1rem',
              }}
            >
              <i className='ri-grid-line' style={{ fontSize: '16px' }}></i>
              <span>Web Dev Cohort</span>
            </div>
            <p
              style={{
                // color: 'var(--chaiteam-text-secondary, #a0a0a0)',
                lineHeight: '1.6',
                marginBottom: '1rem',
              }}
            >
              Requirements as shared by Hitesh Choudhary sir on Live Class
              session for Group formation for a given batch of students.
            </p>
            <div
              style={{
                // color: 'var(--chaiteam-text-secondary, #a0a0a0)',
                fontSize: 'var(--font-size-sm, 0.875rem)',
              }}
            >
              <strong>Start:</strong>{' '}
              <span className='text-green-400'>May 29, 2025, 12:30 PM</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
