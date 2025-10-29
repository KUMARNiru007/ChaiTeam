import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const UploadCSVModal = ({ isOpen, onClose, batches, onUpload }) => {
  const { darkMode } = useTheme();
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (file) => {
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setError('');
    } else {
      setSelectedFile(null);
      setError('Please select a valid CSV file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedBatch) {
      setError('Please select a batch');
      return;
    }
    if (!selectedFile) {
      setError('Please select a CSV file');
      return;
    }

    try {
      await onUpload(selectedBatch, selectedFile);
      onClose();
    } catch (err) {
      setError('Failed to upload CSV file', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50'>
      <div
        className={`rounded-xl p-6 w-[480px] ${
          darkMode ? 'bg-[#18181B] text-white' : 'bg-white text-black'
        }`}
      >
        <h3 className='text-xl font-semibold mb-4'>Upload Members CSV</h3>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>
              Select Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className={`w-full rounded-lg border p-2 ${
                darkMode
                  ? 'bg-[#27272A] text-white border-white/30'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value=''>Select a batch</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>
              Upload CSV File
            </label>

            {/* Drag and Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('csvInput').click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                darkMode
                  ? 'border-white/30 hover:bg-[#27272A]'
                  : 'border-gray-300 hover:bg-gray-50'
              } ${selectedFile ? 'border-green-500' : ''}`}
            >
              {selectedFile ? (
                <div className='text-green-600'>
                  <i className='ri-file-text-line text-2xl mb-2 block'></i>
                  <p className='font-semibold'>{selectedFile.name}</p>
                  <p className='text-sm mt-1'>Click or drag to change file</p>
                </div>
              ) : (
                <>
                  <i
                    className={`ri-upload-cloud-2-line text-3xl mb-3 block ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  ></i>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Drag & Drop or Click to Upload CSV file
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      darkMode ? 'text-red-400' : 'text-red-500'
                    }`}
                  >
                    *Only CSV files are allowed
                  </p>
                </>
              )}
            </div>

            {/* Hidden file input */}
            <input
              type='file'
              id='csvInput'
              accept='.csv'
              onChange={handleFileChange}
              className='hidden'
            />
          </div>

          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

          <div className='flex justify-end gap-3'>
            <button
              type='button'
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border ${
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
              className='px-4 py-2 rounded-lg bg-[var(--chaiteam-btn-start)] hover:bg-[var(--chaiteam-btn-primary-hover)] text-white disabled:bg-gray-400'
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadCSVModal;
