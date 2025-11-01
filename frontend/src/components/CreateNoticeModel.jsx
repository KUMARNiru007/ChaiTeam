import React, { useState } from 'react';
import { noticeService } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function CreateNoticeModal({ batchId, userGroup, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [scope, setScope] = useState('BATCH');
  const [type, setType] = useState('NORMAL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Prepare notice data based on scope
    const noticeData = {
      title,
      content,
      scope,
      type
    };

    // Add scope-specific IDs
    if (scope === 'BATCH') {
      noticeData.batchId = batchId;
    } else if (scope === 'GROUP' && userGroup) {
      noticeData.groupId = userGroup.id;
    }
    // For GLOBAL scope, no additional IDs needed

    try {
      const newNotice = await noticeService.createNotice(noticeData);
      onCreate(newNotice);
      onClose();
    } catch (err) {
      setError('Failed to create notice. Please try again.');
      console.error('Error creating notice:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-lg ${
        darkMode ? 'bg-[#2b2d31] text-white' : 'bg-white text-black'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-all duration-200 ${
            darkMode 
              ? 'hover:bg-white/10 text-white' 
              : 'hover:bg-black/10 text-black'
          }`}
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        <h2 className="text-xl font-bold mb-4">Create New Notice</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-3 rounded-xl border ${
                darkMode 
                  ? 'bg-[#1e1f22] border-[#3f4147] text-white' 
                  : 'bg-white border-gray-300 text-black'
              } focus:outline-none focus:ring-2 focus:ring-[var(--chaihub-orange)]`}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full p-3 rounded-xl border ${
                darkMode 
                  ? 'bg-[#1e1f22] border-[#3f4147] text-white' 
                  : 'bg-white border-gray-300 text-black'
              } focus:outline-none focus:ring-2 focus:ring-[var(--chaihub-orange)] min-h-[100px]`}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Scope
            </label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className={`w-full p-3 rounded-xl border ${
                darkMode 
                  ? 'bg-[#1e1f22] border-[#3f4147] text-white' 
                  : 'bg-white border-gray-300 text-black'
              } focus:outline-none focus:ring-2 focus:ring-[var(--chaihub-orange)]`}
            >
              <option value="BATCH">Batch</option>
              <option value="GROUP" disabled={!userGroup}>
                {userGroup ? 'Group' : 'Group (Join a group first)'}
              </option>
              <option value="GLOBAL">Global</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {scope === 'BATCH' && 'Notice will be visible to all batch members'}
              {scope === 'GROUP' && 'Notice will be visible only to your group members'}
              {scope === 'GLOBAL' && 'Notice will be visible to all users'}
            </p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`w-full p-3 rounded-xl border ${
                darkMode 
                  ? 'bg-[#1e1f22] border-[#3f4147] text-white' 
                  : 'bg-white border-gray-300 text-black'
              } focus:outline-none focus:ring-2 focus:ring-[var(--chaihub-orange)]`}
            >
              <option value="NORMAL">Normal</option>
              <option value="PINNED">Pinned</option>
            </select>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                darkMode
                  ? 'bg-[#1e1f22] hover:bg-[#313338] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-black'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[var(--chaihub-orange)] text-white rounded-xl hover:bg-[var(--chaihub-orange)]/90 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNoticeModal;