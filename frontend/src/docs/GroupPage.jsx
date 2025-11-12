import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { groupService } from '../services/api.js';
import { useAuthStore } from '../store/useAuthStore.js';
import EditNoticeModal from '../components/EditNoticeModal.jsx';
import CreateNoticeModal from '../components/CreateNoticeModel.jsx';
import EditGroupModal from '../components/EditGroupModal.jsx';

const GroupsPage = ({ group, userGroupId, onJoin, onLeave, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [groupActivity, setGroupActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [acitvityError, setActivityError] = useState(null);
  const [notices, setNotices] = useState([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [noticesError, setNoticeserror] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [joinGroupModal, setJoinGroupModal] = useState(false);
  const [reasonToJoin, setReasonToJoin] = useState('');
  const [reasonTokick, setReasonToKick] = useState('');
  const [joinApplications, setJoinApplications] = useState([]);
  const [joinApplicationsError, setJoinApplicationsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [openKickMemberModal, setOpenKickMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [leaveGroupModal, setLeaveGroupModal] = useState(false);
  const [reasonToleave, setReasonToleave] = useState('');
  const [editGroupModal, setEditGroupModal] = useState(false);

  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  if (!group) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'activity', label: 'Group Activity' },
  ];
  const groupMemberTabs = [{ id: 'Noticeboard', label: 'Noticeboard' }];
  const adminTabs = [{ id: 'Join Appications', label: 'Join Applications' }];

  const isAdmin = group.member.find((mem) => mem.role === 'ADMIN');
  const leader = group.member.find((mem) => mem.role === 'LEADER');
  const groupMember = group.member.find((mem) => mem.userId === authUser.id);

  const handleEditNotice = (notice) => {
    setSelectedNotice(notice);
    setShowEditModal(true);
  };

  const handleUpdateNotice = (updatedNotice) => {
    setNotices(
      notices.map((notice) =>
        notice.id === updatedNotice.id ? updatedNotice : notice,
      ),
    );
  };

  const handleDeleteNotice = (noticeId) => {
    setNotices(notices.filter((notice) => notice.id !== noticeId));
  };

  const handleCreateNotice = (newNotice) => {
    setNotices([newNotice, ...notices]);
  };
  const viewProfile = (id) => () => navigate(`/user-profile/${id}`);

  useEffect(() => {
    const fetchGroupActivity = async () => {
      if (!group.id) return;
      try {
        setActivityLoading(true);
        const response = await groupService.getGroupActivity(group.id);
        setGroupActivity(response);
      } catch (error) {
        console.error('Error while fethcing the Group Activity: ', error);
        setActivityError(error);
      } finally {
        setActivityLoading(false);
      }
    };

    const fetchGroupNotices = async () => {
      if (!group.id) return;
      try {
        setNoticesLoading(true);
        const response = await groupService.getGroupNotices(group.id);
        // console.log('GROUP NOTICES: ', response);
        setNotices(response);
      } catch (error) {
        console.error('Error while fetching the Group Notices: ', error);
        setNoticeserror(error);
      } finally {
        setNoticesLoading(false);
      }
    };

    const fetchGroupJoinApplications = async () => {
      if (!group.id) return;
      try {
        const response = await groupService.getAllJoinApplications(group.id);
        // console.log('Applications: ', response);
        setJoinApplications(response || []);
      } catch (error) {
        console.error('error while fethcing group applications: ', error);
        setJoinApplicationsError(error);
      }
    };

    fetchGroupActivity();
    fetchGroupNotices();
    fetchGroupJoinApplications();
  }, [group.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reasonToJoin) {
      alert('Reason to join group is Required');
      return;
    }

    setLoading(true);
    try {
      const response = await groupService.applyToJoinGroup(
        group.id,
        reasonToJoin,
      );
      console.log('Application response: ', response);
      alert('Application sent Successfully');
      handleOnClose();
    } catch (error) {
      console.error(
        'erro while send the join Application: ',
        error.response.data.errors[0],
      );
      alert(error.response.data.errors[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    setJoinGroupModal(false);
    setReasonToJoin('');
  };

  const handleKickMember = async (e) => {
    e.preventDefault();

    if (!selectedMember) {
      alert('Member is not selected ');
      return;
    }

    if (!reasonTokick.trim()) {
      alert('Reason is required');
      return;
    }

    setLoading(true);
    try {
      await groupService.kickMemberFromGroup(
        group.id,
        selectedMember,
        reasonTokick,
      );
      alert('Memeber has been kicked Sucessfully');
      setOpenKickMemberModal(false);
      setSelectedMember(null);
      setReasonToKick('');
    } catch (error) {
      console.error('Error while kicking the member from group: ', error);
      alert('failed to kick the member from group');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseKickModal = () => {
    setOpenKickMemberModal(false);
    setReasonToKick('');
    setSelectedMember(null);
  };

  const handleleaveGroup = async (e) => {
    e.preventDefault();

    if (!selectedMember) {
      alert('Member is not selected.');
      return;
    }

    if (!reasonToleave) {
      alert('Reason to leave group is required');
      return;
    }

    setLoading(true);
    try {
      await groupService.leaveGroup(group.id, selectedMember, reasonToleave);
      alert('Group left Successfully');
      setLeaveGroupModal(false);
      setSelectedMember(null);
      setReasonToleave('');
    } catch (error) {
      console.error('Error while leaving the group ', error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseLeaveGroupModal = () => {
    setLeaveGroupModal(false);
    setReasonToleave('');
    setSelectedMember(null);
  };

  const handleAcceptApplication = async (userId, name, email) => {
    if (!group.id) return;
    try {
      setApplicationLoading(true);
      const response = await groupService.addMemberToGroup(
        group.id,
        userId,
        name,
        email,
      );
      alert('Member added to the Group Successfully');
    } catch (error) {
      console.error('Error while adding member to group: ', error);
      alert('Failed to add memebr to group');
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleRejectApplication = async (userId) => {
    if (!group.id) return;
    try {
      setLoading(true);
      await groupService.rejectApplication(group.id, userId);
      alert('Application Rejected Successfully');
    } catch (error) {
      console.error('Error while rejecting the join application: ', error);
      alert('Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupUpdate = async (groupId, payload) => {
    try {
      if (!payload) {
        await handleDeleteGroup(groupId);
        return;
      }

      await groupService.updateGroup(groupId, payload);
      setEditGroupModal(false);
      alert('Group updated successfully');
    } catch (error) {
      console.error('Error while Deleting the group: ', error);
      alert('failed to update Batch.');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!groupId) return;
    try {
      await groupService.disbannedGroup(groupId);
      alert('Group Deleted Successfully');
    } catch (error) {
      console.log('Error while delteing the Group: ', error);
      alert('Error in deleting the batch: ', error);
    }
  };

  return (
    <div
      style={{ padding: '0rem 1.5rem 1.5rem 1.5rem' }}
      className='parkinsans-light'
    >
      {/* Nav/Header */}
      <div
        className={`sticky top-0 w-full p-2 flex items-center justify-between shadow-sm z-50 ${
          darkMode
            ? 'bg-[#1e1f22] text-white border-b border-gray-700'
            : 'bg-white text-black border-b border-gray-200'
        }`}
      >
        <div className='flex gap-1'>
          <button
            onClick={() => navigate(-1)}
            className={`rounded-md p-1 text-xl pl-2 pr-2 cursor-pointer transition-all duration-200 ${
              darkMode
                ? 'bg-[#313338] hover:bg-[#3b3d44] text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-black'
            }`}
          >
            <i className='ri-arrow-left-line'></i>
          </button>
        </div>

        <div className='w-full h-full text-center flex flex-col items-center font-semibold text-xl'>
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>
            {group.name}
          </span>
        </div>
      </div>

      {/* Header / Banner Section */}
      <div className='max-w-7xl mx-auto mt-0.5'>
        <div
          className={`relative mb-16 ${
            darkMode ? 'bg-[#2b2d31]' : 'bg-white border border-gray-200'
          }`}
        >
          <div className='h-52 w-full overflow-hidden relative'>
            <img
              src={
                group.groupImageUrl ||
                'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80'
              }
              alt={group.name}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 '></div>
          </div>

          <div className='absolute -bottom-16 left-0 right-0 p-6'>
            <div className='flex items-end gap-6'>
              <div
                className={`w-24 h-24 rounded-2xl border-4 overflow-hidden shadow-xl ${
                  darkMode ? 'border-[#2b2d31]' : 'border-white'
                }`}
              >
                <img
                  src={
                    group.logoImageUrl ||
                    'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(group.name) +
                      '&size=96&background=5865f2&color=fff&bold=true'
                  }
                  alt={group.name}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Name + Actions */}
      <div className='w-full p-4 pl-6 pr-6 flex justify-between items-center'>
        <div className='text-2xl font-semibold flex flex-col'>
          {group.name}{' '}
          <span className='text-xs'>{group.member.length} Members</span>
        </div>
        <div className='flex gap-3'>
          {groupMember ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className='px-4 py-2 bg-[var(--chaihub-orange)] text-white rounded-xl hover:bg-[var(--chaihub-orange)]/90 
                      cursor-pointer transition-all duration-200 flex items-center gap-2'
            >
              <i className='ri-add-line'></i>
              Add Notice
            </button>
          ) : (
            <button
              onClick={() => setJoinGroupModal(true)}
              className='p-2 px-4 rounded-md text-sm bg-green-500 hover:bg-green-400 cursor-pointer'
            >
              Apply to Join
            </button>
          )}

          {groupMember === leader && groupMember ? (
            <button
              onClick={() => setEditGroupModal(true)}
              className='p-2 px-4 rounded-md text-sm bg-[var(--chaihub-orange)] hover:bg-[var(--chaihub-orange-hover)] cursor-pointer'
            >
              Edit Group
            </button>
          ) : (
            ''
          )}

          {groupMember !== leader && groupMember ? (
            <button
              onClick={() => {
                setSelectedMember(groupMember.userId);
                setLeaveGroupModal(true);
              }}
              className='p-2 px-4 rounded-md text-sm text-white bg-red-500 hover:bg-red-600 cursor-pointer'
            >
              Leave Group
            </button>
          ) : (
            ''
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-4 mb-4 mt-4 border-b border-gray-200'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold transition rounded-t-lg ${
              activeTab === tab.id
                ? 'border-b-2 border-[var(--chaihub-orange)] text-[var(--chaihub-orange)]'
                : darkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
        {groupMember &&
          groupMemberTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-semibold transition rounded-t-lg ${
                activeTab === tab.id
                  ? 'border-b-2 border-[var(--chaihub-orange)] text-[var(--chaihub-orange)]'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        {groupMember &&
          groupMember === leader &&
          adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-semibold transition rounded-t-lg ${
                activeTab === tab.id
                  ? 'border-b-2 border-[var(--chaihub-orange)] text-[var(--chaihub-orange)]'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
      </div>

      {/* Tab Content */}
      <div
        className={`p-4 rounded-lg border ${
          darkMode
            ? 'bg-[#111111] text-white border-white/60'
            : 'bg-white text-black border-gray-400'
        }`}
      >
        {activeTab === 'overview' && (
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col gap-1'>
              <span className='text-xl font-semibold'>About</span>
              <span className='text-sm'>{group.description}</span>
            </div>

            <div className='flex flex-col gap-1'>
              <span className='text-xl font-semibold'>Categories</span>
              <div className='text-sm flex gap-3'>
                {group.tags.map((tag) => (
                  <div
                    kay={tag}
                    className={`py-1 px-2 rounded-lg border w-auto ${
                      darkMode
                        ? 'bg-[#18181B] border-[#545454] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                        : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                    }`}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className='text-xl font-semibold'>Details</span>
              <div className='mt-1'>
                <div
                  className={`flex justify-between border border-b-0 rounded-t-lg p-2 px-2 ${
                    darkMode
                      ? 'bg-[#18181B] border-[#545454] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                      : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                  }`}
                >
                  <span>Group Leader</span>
                  <span>{leader.name}</span>
                </div>
                <div
                  className={`flex justify-between border border-b-0 p-2 px-2 ${
                    darkMode
                      ? 'bg-[#18181B] border-[#545454] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                      : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                  }`}
                >
                  <span>Total Members</span>
                  <span>{group.member.length} Members</span>
                </div>
                <div
                  className={`flex justify-between border border-b-0 p-2 px-2 ${
                    darkMode
                      ? 'bg-[#18181B] border-[#545454] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                      : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                  }`}
                >
                  <span>Last Updated</span>
                  <span>
                    {new Date(group.updatedAT).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div
                  className={`flex justify-between border rounded-b-lg p-2 px-2 ${
                    darkMode
                      ? 'bg-[#18181B] border-[#545454] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                      : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                  }`}
                >
                  <span>Group ID</span>
                  <span>{group.id}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'members' && (
          <div className='space-y-8'>
            {/* Leader Section */}
            {leader && (
              <div>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Group Leader
                </h3>
                <div
                  className={`flex items-center gap-4 p-4 rounded-xl border ${
                    darkMode
                      ? 'bg-[#18181B] border-[#343434] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                      : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                  } shadow-sm mt-2`}
                >
                  <div className='w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center text-xl font-bold text-white'>
                    {leader.name?.charAt(0).toUpperCase() || 'L'}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div
                      className={`font-semibold text-base ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {leader.name || 'Unknown'}
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {leader.email || 'leader@example.com'}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                        darkMode
                          ? 'bg-orange-900/30 text-orange-400'
                          : 'bg-orange-50 text-orange-700'
                      }`}
                    >
                      Leader
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Members Section */}
            <div>
              <h3
                className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Members ({group.member.length})
              </h3>

              {group.member.length === 0 ? (
                <div
                  className={`flex flex-col items-center justify-center p-12 rounded-xl ${
                    darkMode ? 'bg-[#2b2d31]' : 'bg-white'
                  } border ${
                    darkMode ? 'border-[#3a3b40]' : 'border-gray-200'
                  }`}
                >
                  <i
                    className={`ri-group-line text-5xl mb-3 ${
                      darkMode ? 'text-gray-400' : 'text-gray-300'
                    }`}
                  ></i>
                  <p
                    className={`${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    No members yet
                  </p>
                </div>
              ) : (
                <div className='flex flex-col gap-3 mt-2'>
                  {group.member.map((member, index) => (
                    <div
                      key={member.id}
                      className={`relative flex items-center gap-3 p-4 rounded-xl border shadow-sm ${
                        darkMode
                          ? 'bg-[#18181B] border-[#343434] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                          : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                      }`}
                    >
                      <div className='w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-lg font-bold text-white'>
                        {member.name?.charAt(0).toUpperCase() || 'M'}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div
                          className={`font-medium text-sm ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {member.name || `Member ${index + 1}`}
                        </div>
                        <div
                          className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          } truncate`}
                        >
                          {member.email || 'member@example.com'}
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        {/* View Profile Button */}
                        <button
                          onClick={viewProfile(member.userId)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                            darkMode
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          } transition-colors cursor-pointer`}
                        >
                          <i className='ri-user-line text-xs'></i>
                          View Profile
                        </button>

                        {/* Kick Button - Only for leader and non-leader members */}
                        {leader === groupMember && member.role !== 'LEADER' && (
                          <button
                            onClick={() => {
                              setSelectedMember(member.userId);
                              setOpenKickMemberModal(true);
                            }}
                            className='px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 cursor-pointer transition-colors flex items-center gap-2'
                            title='Kick Member'
                          >
                            <i className='ri-user-minus-fill'></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'activity' && (
          <div className='w-full px-4 py-6'>
            {activityLoading ? (
              <div className='flex justify-center py-4'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500'></div>
              </div>
            ) : groupActivity.length === 0 ? (
              <p className='text-gray-400 text-center py-4'>{acitvityError}</p>
            ) : (
              <div className='flex flex-col gap-4'>
                {groupActivity.map((activity, index) => {
                  const actionMap = {
                    GROUP_CREATED: {
                      color: 'bg-green-500',
                      title: 'Group Created',
                      desc: `${
                        activity.description ||
                        'The group was successfully created.'
                      }`,
                    },
                    GROUP_UPDATED: {
                      color: 'bg-blue-500',
                      title: 'Group Updated',
                      desc: `${
                        activity.description || 'Group details were updated.'
                      }`,
                    },
                    GROUP_DISBANDED: {
                      color: 'bg-red-500',
                      title: 'Group Disbanded',
                      desc: `${
                        activity.description ||
                        'The group was permanently deleted.'
                      }`,
                    },
                    MEMBER_JOINED: {
                      color: 'bg-emerald-500',
                      title: 'New Member Joined',
                      desc: `${
                        activity.description || 'A new member joined the group.'
                      }`,
                    },
                    MEMBER_LEFT: {
                      color: 'bg-orange-500',
                      title: 'Member Left',
                      desc: `${
                        activity.description || 'A member left the group.'
                      }`,
                    },
                    NOTICE_CREATED: {
                      color: 'bg-purple-500',
                      title: 'Notice Created',
                      desc: `${
                        activity.description || 'A new notice was created.'
                      }`,
                    },
                    NOTICE_UPDATED: {
                      color: 'bg-cyan-500',
                      title: 'Notice Updated',
                      desc: `${
                        activity.description || 'A notice was updated.'
                      }`,
                    },
                    NOTICE_DELETED: {
                      color: 'bg-pink-500',
                      title: 'Notice Deleted',
                      desc: `${
                        activity.description || 'A notice was deleted.'
                      }`,
                    },
                    MEMBER_KICKED: {
                      color: 'bg-red-600',
                      title: 'Member Removed',
                      desc: `${
                        activity.description ||
                        'A member was removed from the group.'
                      }`,
                    },
                  };

                  const { color, title, desc } = actionMap[activity.action] || {
                    color: 'bg-gray-400',
                    title: 'Unknown Activity',
                    desc: activity.description || 'An action was performed.',
                  };

                  return (
                    <div
                      key={activity.id || index}
                      className={`flex items-start gap-3 rounded-xl p-4 border transition-all duration-200 shadow-sm ${
                        darkMode
                          ? 'bg-[#1f1f1f] border-[#2b2b2b] hover:bg-[#2a2a2a]'
                          : 'bg-white border-gray-200 hover:shadow-md'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 ${color}`}
                      ></div>

                      <div className='flex-1'>
                        <div className='flex justify-between items-center'>
                          <h3
                            className={`text-sm font-semibold ${
                              darkMode ? 'text-gray-100' : 'text-gray-800'
                            }`}
                          >
                            {title}
                          </h3>
                          <span className='text-xs'>
                            {activity.createdAT
                              ? new Date(activity.createdAT).toLocaleString(
                                  'en-IN',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                  },
                                )
                              : 'Date not available'}
                          </span>
                        </div>
                        <p
                          className={`text-sm mt-1 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {groupMember && activeTab === 'Noticeboard' && (
          <div
            className={`p-2 ${
              darkMode ? 'bg-[#111111] text-white' : 'bg-white text-black'
            }`}
          >
            {notices
              .sort((a, b) =>
                a.type === 'PINNED' && b.type !== 'PINNED' ? -1 : 1,
              ) // sort once
              .map((notice, index) => (
                <div
                  key={notice.id || index}
                  className={`relative border rounded-xl p-4 flex flex-col gap-2 mb-3  ${
                    darkMode
                      ? 'bg-[#18181B] border-[#343434] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                      : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                  } transition-all duration-200`}
                >
                  <span className='text-lg font-semibold'>{notice.title}</span>
                  <span className='text-sm'>{notice.content}</span>
                  <span className='text-sm font-semibold flex items-center gap-1'>
                    <i className='ri-user-line'></i>
                    <span className='font-normal text-xs flex items-center gap-1'>
                      {notice.createdBy?.name || 'Unknown User'}
                      <span>,</span>
                      <i className='ri-time-line'></i>
                      {notice.updateAt
                        ? new Date(notice.updateAt).toLocaleDateString(
                            'en-IN',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            },
                          )
                        : 'Date not available'}
                    </span>
                  </span>

                  {/* Type Badge */}
                  <div
                    className={`absolute top-2 right-6 rounded-md px-2 py-1 text-xs font-semibold flex items-center gap-1 ${
                      notice.type === 'PINNED'
                        ? 'bg-green-200 text-green-700'
                        : ''
                    }`}
                  >
                    {notice.type === 'PINNED' && (
                      <>
                        <i className='ri-pushpin-fill'></i>
                        <span>PINNED</span>
                      </>
                    )}
                  </div>

                  {/* Edit Button*/}
                  {isAdmin ||
                    (leader && (
                      <button
                        onClick={() => handleEditNotice(notice)}
                        className={`absolute bottom-2 right-4 p-2 rounded-xl transition-opacity duration-200 ${
                          darkMode
                            ? 'hover:bg-white/10 text-white'
                            : 'hover:bg-black/10 text-black'
                        }`}
                      >
                        <i className='ri-edit-line'></i>
                      </button>
                    ))}
                </div>
              ))}
          </div>
        )}
        {activeTab === 'Join Appications' && (
          <div className='flex flex-col gap-4'>
            <h2 className='text-lg font-semibold mb-2'>Join Applications</h2>

            {/* Loading / Error / Empty States */}
            {joinApplicationsError ? (
              <p className='text-red-500 text-sm'>
                {joinApplicationsError.message || 'Failed to load applications'}
              </p>
            ) : joinApplications.length === 0 ? (
              <div
                className={`flex flex-col items-center justify-center p-12 rounded-xl ${
                  darkMode ? 'bg-[#2b2d31]' : 'bg-gray-50'
                } border ${
                  darkMode ? 'border-[#3a3b40]' : 'border-gray-200'
                } text-gray-500`}
              >
                <i className='ri-mail-close-line text-5xl mb-3'></i>
                No join applications yet.
              </div>
            ) : (
              joinApplications.map((app, index) => (
                <div
                  key={app.id || index}
                  className={`border rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 ${
                    darkMode
                      ? 'bg-[#18181B] border-[#343434] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                      : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                  }`}
                >
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-lg font-bold text-white'>
                        {app.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className='font-semibold text-sm'>
                          {app.name || 'Unknown User'}
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {app.email || 'No email provided'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-3 py-2 rounded-md font-semibold ${
                        app.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : app.status === 'APPROVED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className='mt-1 text-sm'>
                    <p>
                      <span className='font-semibold'>Reason:</span>{' '}
                      {app.reason || 'No reason provided'}
                    </p>
                  </div>

                  <div className='mt-1 text-xs text-gray-500'>
                    Applied on:{' '}
                    {app.createdAT
                      ? new Date(app.createdAT).toLocaleString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : 'Date not available'}
                  </div>

                  {/* Action Buttons */}
                  {app.status === 'PENDING' && (
                    <div className='mt-3 flex gap-3'>
                      <button
                        disabled={applicationLoading}
                        onClick={() =>
                          handleAcceptApplication(
                            app.userId,
                            app.name,
                            app.email,
                          )
                        }
                        className='px-3 py-1 rounded-md text-sm bg-green-500 hover:bg-green-400 text-white cursor-pointer'
                      >
                        {applicationLoading ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleRejectApplication(app.userId)}
                        disabled={loading}
                        className='px-3 py-1 rounded-md text-sm bg-red-500 hover:bg-red-400 text-white cursor-pointer'
                      >
                        {loading ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Join group Modal */}
      {joinGroupModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/40 z-50'>
          <div
            className={`p-6 rounded-xl relative shadow-lg w-[500px] ${
              darkMode ? 'bg-[#18181B] text-white' : 'bg-white text-black'
            }`}
          >
            <h2 className='text-xl font-semibold mb-6 text-center'>
              Wanted to Join?
            </h2>

            <form onSubmit={handleSubmit} className='flex flex-col mt-3'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Why should we Add You? <span className='text-red-500'>*</span>
                </label>
                <textarea
                  type='text'
                  placeholder='Give us Reason'
                  value={reasonToJoin}
                  onChange={(e) => setReasonToJoin(e.target.value)}
                  className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-blue-500'
                  rows={4}
                  required
                />
              </div>

              <div className='mt-4 text-right'>
                <div className='flex gap-3 justify-end'>
                  <button
                    type='button'
                    onClick={handleOnClose}
                    className={`px-4 py-2 rounded-lg border transition-all font-medium ${
                      darkMode
                        ? 'border-white/30 hover:bg-[#27272A]'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={loading}
                    className='px-4 py-2 rounded-lg bg-[var(--chaihub-btn-start)] hover:bg-[var(--chaihub-btn-primary-hover)] text-white transition-all disabled:bg-gray-400 cursor-pointer font-medium'
                  >
                    {loading ? 'Sending...' : 'Send Application'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Group Modal */}
      {leaveGroupModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/40 z-50'>
          <div
            className={`p-6 rounded-xl relative shadow-lg w-[500px] ${
              darkMode ? 'bg-[#18181B] text-white' : 'bg-white text-black'
            }`}
          >
            <h2 className='text-xl font-semibold mb-6 text-center'>
              Leave Group
            </h2>

            <form onSubmit={handleleaveGroup} className='flex flex-col mt-3'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Why do you wanted to Leave?{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <textarea
                  type='text'
                  placeholder='Give Reason'
                  value={reasonToleave}
                  onChange={(e) => setReasonToleave(e.target.value)}
                  className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-blue-500'
                  rows={4}
                  required
                />
              </div>

              <div className='mt-4 text-right'>
                <div className='flex gap-3 justify-end'>
                  <button
                    type='button'
                    onClick={() => handleCloseLeaveGroupModal()}
                    className={`px-4 py-2 rounded-lg border transition-all font-medium ${
                      darkMode
                        ? 'border-white/30 hover:bg-[#27272A]'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={loading}
                    className='px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all disabled:bg-gray-400 cursor-pointer font-medium'
                  >
                    {loading ? 'leaving...' : 'Leave Group'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* kick Memeber Modal */}
      {openKickMemberModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/40 z-50'>
          <div
            className={`p-6 rounded-xl relative shadow-lg w-[500px] ${
              darkMode ? 'bg-[#18181B] text-white' : 'bg-white text-black'
            }`}
          >
            <h2 className='text-xl font-semibold mb-6 text-center'>
              Kick Member
            </h2>

            <form onSubmit={handleKickMember} className='flex flex-col mt-3'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Why do you wanted to Kick?{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <textarea
                  type='text'
                  placeholder='Give Reason'
                  value={reasonTokick}
                  onChange={(e) => setReasonToKick(e.target.value)}
                  className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-blue-500'
                  rows={4}
                  required
                />
              </div>

              <div className='mt-4 text-right'>
                <div className='flex gap-3 justify-end'>
                  <button
                    type='button'
                    onClick={() => handleCloseKickModal()}
                    className={`px-4 py-2 rounded-lg border transition-all font-medium ${
                      darkMode
                        ? 'border-white/30 hover:bg-[#27272A]'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={loading}
                    className='px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all disabled:bg-gray-400 cursor-pointer font-medium'
                  >
                    {loading ? 'Kicking...' : 'Kick Member'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Notice Modal */}
      {showCreateModal && (
        <CreateNoticeModal
          groupId={userGroupId}
          userGroup={group}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateNotice}
        />
      )}

      {/* Edit Notice Modal */}
      {showEditModal && selectedNotice && (
        <EditNoticeModal
          notice={selectedNotice}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateNotice}
          onDelete={handleDeleteNotice}
        />
      )}

      {/* Edit group Modal */}
      {editGroupModal && (
        <EditGroupModal
          group={group}
          onClose={() => setEditGroupModal(false)}
          onSave={handleGroupUpdate}
        />
      )}
    </div>
  );
};

export default GroupsPage;
