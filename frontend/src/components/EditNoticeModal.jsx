import React, { useState } from 'react';
import { noticeService } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function EditNoticeModal({ notice, onClose, onUpdate, onDelete }) {
  const [title, setTitle] = useState(notice.title);
  const [content, setContent] = useState(notice.content);
  const [type, setType] = useState(notice.type);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this notice? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    setError('');

    try {
      await noticeService.deleteNotice(notice.id);
      onDelete(notice.id);
      onClose();
    } catch (err) {
      setError('Failed to delete notice. Please try again.');
      console.error('Error deleting notice:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className={`relative w-full max-w-2xl p-6 rounded-xl shadow-lg ${
        darkMode ? 'bg-[#2b2d31] text-white' : 'bg-white text-black'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Notice</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-200 ${
              darkMode 
                ? 'hover:bg-white/10 text-white' 
                : 'hover:bg-black/10 text-black'
            }`}
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-[#1e1f22] border-[#3f4147] text-white' 
                      : 'bg-white border-gray-300 text-black'
                  } focus:outline-none focus:ring-2 focus:ring-[var(--chaiteam-orange)]`}
                  required
                  placeholder="Enter notice title"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-[#1e1f22] border-[#3f4147] text-white' 
                      : 'bg-white border-gray-300 text-black'
                  } focus:outline-none focus:ring-2 focus:ring-[var(--chaiteam-orange)] min-h-[120px] resize-none`}
                  required
                  placeholder="Enter notice content"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-[#1e1f22] border-[#3f4147] text-white' 
                      : 'bg-white border-gray-300 text-black'
                  } focus:outline-none focus:ring-2 focus:ring-[var(--chaiteam-orange)]`}
                >
                  <option value="NORMAL">Normal</option>
                  <option value="PINNED">Pinned</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Buttons - Same layout as EditBatchModal */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
            {/* Delete button on the left */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {deleteLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="ri-delete-bin-line"></i>
                  Delete Notice
                </>
              )}
            </button>

            {/* Cancel and Save buttons on the right */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg border transition-all font-medium ${
                  darkMode
                    ? 'bg-[#1e1f22] border-[#3f4147] hover:bg-[#313338] text-white'
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-black'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[var(--chaiteam-orange)] hover:bg-[var(--chaiteam-orange)]/90 text-white transition-all disabled:opacity-50 font-medium"
              >
                {loading ? 'Updating...' : 'Update Notice'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditNoticeModal;