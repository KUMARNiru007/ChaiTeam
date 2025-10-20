import React, { useState } from 'react';
import { useBatchStore } from '../store/useBatchStore.js';
import { uploadToCloudinary } from '../utils/cloudinaryImageUpload.js';

const CreateBatchModal = ({ isOpen, onClose, onSave }) => {
  const { name, description, logoImage, bannerImage, setField, resetForm } =
    useBatchStore();

  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection (show preview only)
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    if (field === 'logoImage') setPreviewLogo(previewUrl);
    else if (field === 'bannerImage') setPreviewBanner(previewUrl);

    setField(field, file);
  };

  // Upload both images when submitting
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !logoImage || !bannerImage) {
      alert('Please fill all required fields!');
      return;
    }

    setLoading(true);
    try {
      // Upload images using Cloudinary signed upload
      const [uploadedLogo, uploadedBanner] = await Promise.all([
        uploadToCloudinary(logoImage),
        uploadToCloudinary(bannerImage),
      ]);

      // console.log('Uploaded Image: ', uploadedLogo);
      // console.log('uploaded Image 1: ', uploadedBanner);

      const payload = {
        name,
        description,
        logoImageUrl: uploadedLogo,
        bannerImageUrl: uploadedBanner,
      };

      // Call parent save function
      await onSave(payload);

      alert('Batch created successfully!');
      resetForm();
      setPreviewLogo(null);
      setPreviewBanner(null);
      onClose();
    } catch (err) {
      console.error('Error creating batch:', err);
      alert('Failed to create batch.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/40 z-50'>
      <div className='bg-white p-6 rounded-xl w-[420px] relative shadow-lg'>
        <button
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl'
          onClick={onClose}
        >
          <i className='ri-close-large-line cursor-pointer'></i>
        </button>

        <h2 className='text-xl font-semibold mb-4 text-center'>
          Create New Batch
        </h2>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* Name */}
          <input
            type='text'
            placeholder='Batch Name *'
            value={name}
            onChange={(e) => setField('name', e.target.value)}
            className='border border-gray-300 p-2 rounded focus:outline-none '
            required
          />

          {/* Description */}

          <textarea
            placeholder='Batch Description *'
            value={description}
            onChange={(e) => setField('description', e.target.value)}
            className='border border-gray-300 p-2 rounded focus:outline-none'
            rows={3}
            required
          />

          {/* Logo */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Logo Image <span className='text-red-500'>*</span>
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => handleFileChange(e, 'logoImage')}
              className='w-full'
              required
            />
            {previewLogo && (
              <img
                src={previewLogo}
                alt='Logo Preview'
                className='mt-2 h-24 w-24 object-cover rounded border'
              />
            )}
          </div>

          {/* Banner */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Banner Image <span className='text-red-500'>*</span>
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => handleFileChange(e, 'bannerImage')}
              className='w-full'
              required
            />
            {previewBanner && (
              <img
                src={previewBanner}
                alt='Banner Preview'
                className='mt-2 h-24 w-full object-cover rounded border'
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className='bg-[var(--chaiteam-btn-start)] hover:bg--[var(--chaiteam-btn-primary-hover)]  text-white py-2 rounded mt-3 transition-all disabled:bg-gray-400 cursor-pointer'
          >
            {loading ? 'Uploading & Creating...' : 'Create Batch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBatchModal;
