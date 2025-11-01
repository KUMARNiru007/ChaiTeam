import React, { useState } from 'react';
import { useBatchStore } from '../store/useBatchStore.js';
import { uploadToCloudinary } from '../utils/cloudinaryImageUpload.js';
import { useTheme } from '../context/ThemeContext.jsx';

const CreateBatchModal = ({ isOpen, onClose, onSave }) => {
  const { name, description, logoImage, bannerImage, setField, resetForm } =
    useBatchStore();

  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOverLogo, setDragOverLogo] = useState(false);
  const [dragOverBanner, setDragOverBanner] = useState(false);
  const { darkMode } = useTheme();

  // Handle file selection (show preview only)
  const handleFileChange = (file, field) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (field === 'logoImage') setPreviewLogo(previewUrl);
    else if (field === 'bannerImage') setPreviewBanner(previewUrl);

    setField(field, file);
  };

  // Drag and drop handlers for logo
  const handleLogoDragOver = (e) => {
    e.preventDefault();
    setDragOverLogo(true);
  };

  const handleLogoDragLeave = (e) => {
    e.preventDefault();
    setDragOverLogo(false);
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    setDragOverLogo(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file, 'logoImage');
  };

  // Drag and drop handlers for banner
  const handleBannerDragOver = (e) => {
    e.preventDefault();
    setDragOverBanner(true);
  };

  const handleBannerDragLeave = (e) => {
    e.preventDefault();
    setDragOverBanner(false);
  };

  const handleBannerDrop = (e) => {
    e.preventDefault();
    setDragOverBanner(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file, 'bannerImage');
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

  const handleCancel = () => {
    resetForm();
    setPreviewLogo(null);
    setPreviewBanner(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/40 z-50'>
      <div
        className={`p-6 rounded-xl w-[700px] relative shadow-lg ${
          darkMode ? 'bg-[#18181B] text-white' : 'bg-white text-black'
        }`}
      >
        <h2 className='text-xl font-semibold mb-6 text-center'>
          Create New Batch
        </h2>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* Main content in two columns */}
          <div className='grid grid-cols-2 gap-6'>
            {/* Left Column - Text Fields */}
            <div className='space-y-4'>
              {/* Name */}
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Batch Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  placeholder='Enter batch name'
                  value={name}
                  onChange={(e) => setField('name', e.target.value)}
                  className={`w-full border p-3 rounded-lg ${
                    darkMode
                      ? 'bg-[#27272A] text-white border-white/30'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Batch Description <span className='text-red-500'>*</span>
                </label>
                <textarea
                  placeholder='Enter batch description'
                  value={description}
                  onChange={(e) => setField('description', e.target.value)}
                  className={`w-full border border-gray-300 p-3 rounded-lg h-32 resize-none ${
                    darkMode
                      ? 'bg-[#27272A] text-white border-white/30'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Right Column - Image Uploads */}
            <div className='space-y-4'>
              {/* Logo */}
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Logo Image <span className='text-red-500'>*</span>
                </label>

                {/* Drag and Drop Area for Logo */}
                <div
                  onDragOver={handleLogoDragOver}
                  onDragLeave={handleLogoDragLeave}
                  onDrop={handleLogoDrop}
                  onClick={() => document.getElementById('logoInput').click()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all h-40 flex items-center justify-center ${
                    dragOverLogo ? 'border-blue-500 bg-blue-50' : 'b'
                  } ${previewLogo ? 'border-green-500' : ''} ${
                    darkMode
                      ? 'border-white/30 hover:bg-[#27272A]'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {previewLogo ? (
                    <div className='text-green-600'>
                      <img
                        src={previewLogo}
                        alt='Logo Preview'
                        className='h-24 w-24 object-cover rounded-lg border mx-auto'
                      />
                      <p className='text-sm mt-2 font-semibold'>
                        {logoImage?.name || 'Logo Image Selected'}
                      </p>
                      <p className='text-xs mt-1 text-gray-600'>
                        Click or drag to change
                      </p>
                    </div>
                  ) : (
                    <div>
                      <i
                        className={`ri-upload-cloud-2-line text-3xl mb-2 block ${
                          dragOverLogo ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      ></i>
                      <p className='text-gray-600 font-medium'>Upload Logo</p>
                      <p className='text-xs mt-1 text-gray-500'>
                        Drag & drop or click to upload
                      </p>
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  type='file'
                  id='logoInput'
                  accept='image/*'
                  onChange={(e) =>
                    handleFileChange(e.target.files[0], 'logoImage')
                  }
                  className='hidden'
                  required
                />
              </div>

              {/* Banner */}
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Banner Image <span className='text-red-500'>*</span>
                </label>

                {/* Drag and Drop Area for Banner */}
                <div
                  onDragOver={handleBannerDragOver}
                  onDragLeave={handleBannerDragLeave}
                  onDrop={handleBannerDrop}
                  onClick={() => document.getElementById('bannerInput').click()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all h-40 flex items-center justify-center ${
                    dragOverBanner ? 'border-blue-500 bg-blue-50' : ''
                  } ${previewBanner ? 'border-green-500' : ''} ${
                    darkMode
                      ? 'border-white/30 hover:bg-[#27272A]'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {previewBanner ? (
                    <div className='text-green-600'>
                      <img
                        src={previewBanner}
                        alt='Banner Preview'
                        className='h-20 w-full object-cover rounded-lg border'
                      />
                      <p className='text-sm mt-2 font-semibold'>
                        {bannerImage?.name || 'Banner Image Selected'}
                      </p>
                      <p className='text-xs mt-1 text-gray-600'>
                        Click or drag to change
                      </p>
                    </div>
                  ) : (
                    <div>
                      <i
                        className={`ri-upload-cloud-2-line text-3xl mb-2 block ${
                          dragOverBanner ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      ></i>
                      <p className='text-gray-600 font-medium'>Upload Banner</p>
                      <p className='text-xs mt-1 text-gray-500'>
                        Drag & drop or click to upload
                      </p>
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  type='file'
                  id='bannerInput'
                  accept='image/*'
                  onChange={(e) =>
                    handleFileChange(e.target.files[0], 'bannerImage')
                  }
                  className='hidden'
                  required
                />
              </div>
            </div>
          </div>

          {/* Buttons - Aligned to the right with same style as UploadCSV */}
          <div className='mt-4 pt-4 border-t border-gray-200 flex justify-end gap-3'>
            <button
              type='button'
              onClick={handleCancel}
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
              {loading ? 'Uploading & Creating...' : 'Create Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBatchModal;
