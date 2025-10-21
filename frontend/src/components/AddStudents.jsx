import React, { useState, useEffect } from 'react';
import { batchService } from '../services/api.js';

const AddStudents = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await batchService.getAllBatches();
        setBatches(data || []);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };
    fetchBatches();
  }, []);

  // Handling file drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
    } else {
      openModal('Please upload a valid CSV file.', true);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      openModal('Please select a valid CSV file.', true);
    }
  };

  const openModal = (message, isError = false) => {
    setModalMessage(message);
    setIsError(isError);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleUpload = async () => {
    if (!file || !selectedBatch) {
      openModal('Please select a batch and upload a CSV file.', true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await batchService.uploadBatchCSV(
        selectedBatch,
        formData,
      );
      openModal(response?.data?.message || 'File uploaded successfully!');
      setFile(null);
      setSelectedBatch('');
    } catch (error) {
      console.error('Error uploading CSV:', error);
      openModal('Failed to upload CSV file.', true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='p-6 max-w-3xl mx-auto relative'>
      <h2 className='text-3xl font-semibold mb-6 text-center text-gray-800'>
        Add Students to Batch
      </h2>

      {/* Batch Dropdown */}
      <div className='mb-6'>
        <label className='block text-gray-700 mb-2 cursor-pointer'>
          Select Batch:
        </label>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className='w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--chaiteam-btn-start)] cursor-pointer'
        >
          <option value=''>-- Select a Batch --</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </select>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className='border-2 border-dashed border-gray-400 rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 transition'
        onClick={() => document.getElementById('csvInput').click()}
      >
        {file ? (
          <p className='text-green-600 font-semibold'>{file.name}</p>
        ) : (
          <>
            <i className='ri-upload-cloud-2-line text-6xl text-gray-600'></i>
            <p className='text-gray-600 mt-2'>
              Drag & Drop or Click to Upload CSV file
            </p>
            <p className='text-red-500 mt-2 text-sm'>
              *Only CSV file is accepted.
            </p>
          </>
        )}
        <input
          type='file'
          id='csvInput'
          accept='.csv'
          className='hidden'
          onChange={handleFileChange}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className='mt-6 w-full bg-[var(--chaiteam-btn-start)] hover:bg-[var(--chaiteam-btn-primary-hover)] text-white py-3 rounded-lg transition-all disabled:opacity-60 cursor-pointer'
      >
        {uploading ? 'Uploading...' : 'Upload CSV'}
      </button>

      {modalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-40 z-50'>
          <div className='bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center'>
            <h3
              className={`text-xl font-semibold mb-3 ${
                isError ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {isError ? 'Error' : 'Success'}
            </h3>
            <p className='text-gray-700 mb-6'>{modalMessage}</p>
            <button
              onClick={closeModal}
              className={`w-full py-2 rounded-lg font-medium ${
                isError
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white transition-all cursor-pointer`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStudents;
