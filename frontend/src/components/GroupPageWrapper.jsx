import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupService } from '../services/api';
import GroupsPage from '../docs/GroupPage.jsx';

const GroupPageWrapper = () => {
  const { groupId } = useParams();
  console.log('GroupId: ', groupId);
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);

        const data = await groupService.getGroupById(groupId);
        console.log('group fetched Data: ', data);
        setGroup(data);
        setError(null);
      } catch (error) {
        console.log('Failed to fetch data: ', error);
        setError('Failed to load group details');
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroup();
    }
  }, [groupId]);

  const handleJoin = async () => {
    try {
      await groupService.joinGroup(groupId);
      // Refresh group data after joining
      const data = await groupService.getGroupById(groupId);
      setGroup(data);
    } catch (err) {
      console.error('Failed to join group:', err);
    }
  };

  const handleLeave = async () => {
    try {
      await groupService.leaveGroup(groupId);
      // Refresh group data after leaving
      const data = await groupService.getGroupById(groupId);
      setGroup(data);
    } catch (err) {
      console.error('Failed to leave group:', err);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
    // Or navigate to specific route: navigate('/groups');
  };

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
        <p style={{ marginTop: '1rem', color: '#b3b3b3' }}>Loading...</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-5xl text-red-500'></i>
          <p className='mt-4 text-red-500'>{error || 'Group not found'}</p>
          <button
            onClick={handleBack}
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <GroupsPage
      group={group}
      onJoin={handleJoin}
      onLeave={handleLeave}
      onBack={handleBack}
    />
  );
};

export default GroupPageWrapper;
