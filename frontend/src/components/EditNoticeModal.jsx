import React, { useState } from 'react';
import { noticeService } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function EditNoticeModal({ notice, onClose, onUpdate }) {
  const [title, setTitle] = useState(notice.title);
  const [content, setContent] = useState(notice.content);
  const [type, setType] = useState(notice.type);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedNotice = await noticeService.updateNotice(notice.id, {
        title,
        content,
        type
      });
      onUpdate(updatedNotice);
      onClose();
    } catch (err) {
      setError('Failed to update notice. Please try again.');
      console.error('Error updating notice:', err);
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

        <h2 className="text-xl font-bold mb-4">Edit Notice</h2>

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
              } focus:outline-none focus:ring-2 focus:ring-[var(--chaiteam-orange)]`}
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
              } focus:outline-none focus:ring-2 focus:ring-[var(--chaiteam-orange)] min-h-[100px]`}
              required
            />
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
              } focus:outline-none focus:ring-2 focus:ring-[var(--chaiteam-orange)]`}
            >
              <option value="NORMAL">NORMAL</option>
              <option value="PINNED">PINNED</option>
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
              className="px-4 py-2 bg-[var(--chaiteam-orange)] text-white rounded-xl hover:bg-[var(--chaiteam-orange)]/90 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditNoticeModal;