import React, { useState } from 'react';
import CreateBatchModal from '../components/CreateBatchModel.jsx';
import { useBatchStore } from '../store/useBatchStore.js';
import { batchService } from '../services/api.js';
import Batches from './Batches.jsx';

const AdminBatchPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { name, description, logoUrl, bannerUrl } = useBatchStore();

  const handleSave = async (payload) => {
    try {
      // Example: call backend API
      // console.log('Creating batch with payload:', payload);
      const data = await batchService.createBatch(payload);
      alert('Batch created successfully!');
      setShowModal(false);
    } catch (err) {
      console.error('Create batch error:', err);
      alert('Failed to create batch');
    }
  };

  return (
    <div className='min-h-screen p-8'>
      <div className='mx-auto bg-white shadow-md rounded-2xl p-8'>
        <div className='flex justify-between items-center mb-1'>
          <h1 className='text-3xl font-bold text-gray-800'>Manage Batches</h1>
          <button
            onClick={() => setShowModal(true)}
            className='bg-[var(--chaiteam-btn-start)] hover:bg--[var(--chaiteam-btn-primary-hover)] text-white px-5 py-2 rounded-lg transition-all cursor-pointer'
          >
            + Create New Batch
          </button>
        </div>

        <p className='text-gray-500'>
          You can create new batches and upload related images here.
        </p>
      </div>

      <CreateBatchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default AdminBatchPage;
