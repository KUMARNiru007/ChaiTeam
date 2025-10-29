import React, { useState } from 'react';
import { groupService } from '../services/api.js';
import { uploadToCloudinary } from '../utils/cloudinaryImageUpload.js';

const CreateGroupModal = ({ isOpen, onClose, batchId, batchName, onCreateGroup }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    status: 'ACTIVE'
  });
  const [logoImage, setLogoImage] = useState(null);
  const [groupImage, setGroupImage] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewGroupImage, setPreviewGroupImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOverLogo, setDragOverLogo] = useState(false);
  const [dragOverGroupImage, setDragOverGroupImage] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (file, field) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (field === 'logoImage') {
      setPreviewLogo(previewUrl);
      setLogoImage(file);
    } else if (field === 'groupImage') {
      setPreviewGroupImage(previewUrl);
      setGroupImage(file);
    }
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

  // Drag and drop handlers for group image
  const handleGroupImageDragOver = (e) => {
    e.preventDefault();
    setDragOverGroupImage(true);
  };

  const handleGroupImageDragLeave = (e) => {
    e.preventDefault();
    setDragOverGroupImage(false);
  };

  const handleGroupImageDrop = (e) => {
    e.preventDefault();
    setDragOverGroupImage(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file, 'groupImage');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.tags) {
      alert('Please fill all required fields!');
      return;
    }

    setLoading(true);
    try {
      // Upload images if provided
      let logoImageUrl = null;
      let groupImageUrl = null;

      if (logoImage) {
        logoImageUrl = await uploadToCloudinary(logoImage);
      }

      if (groupImage) {
        groupImageUrl = await uploadToCloudinary(groupImage);
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        batchId: batchId,
        logoImageUrl: logoImageUrl,
        groupImageUrl: groupImageUrl,
        status: formData.status
      };

      // Call the API to create group
      await groupService.createGroup(payload);
      
      // Call the parent callback
      onCreateGroup();
      
      alert('Group created successfully!');
      handleClose();
    } catch (err) {
      console.error('Error creating group:', err);
      alert('Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      tags: '',
      status: 'ACTIVE'
    });
    setLogoImage(null);
    setGroupImage(null);
    setPreviewLogo(null);
    setPreviewGroupImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/40 z-50'>
      <div className='bg-white p-6 rounded-xl w-[700px] max-h-[90vh] overflow-y-auto relative shadow-lg'>
        <h2 className='text-xl font-semibold mb-6 text-center'>
          Create New Group
        </h2>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* Main content in two columns */}
          <div className='grid grid-cols-2 gap-6'>
            {/* Left Column - Text Fields */}
            <div className='space-y-4'>
              {/* Group Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Group Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='name'
                  placeholder='Enter group name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Group Description <span className='text-red-500'>*</span>
                </label>
                <textarea
                  name='description'
                  placeholder='Enter group description'
                  value={formData.description}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none'
                  rows={4}
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Tags <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='tags'
                  placeholder='Enter tags separated by commas (e.g., react, node, mongodb)'
                  value={formData.tags}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Status
                </label>
                <select
                  name='status'
                  value={formData.status}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='ACTIVE'>Active</option>
                  <option value='PRIVATE'>Private</option>
                </select>
              </div>

              {/* Batch Info (read-only) */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Batch
                </label>
                <input
                  type='text'
                  value={batchName}
                  disabled
                  className='w-full border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed'
                />
              </div>
            </div>

            {/* Right Column - Image Uploads */}
            <div className='space-y-4'>
              {/* Logo Image */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Logo Image
                </label>
                
                {/* Drag and Drop Area for Logo */}
                <div
                  onDragOver={handleLogoDragOver}
                  onDragLeave={handleLogoDragLeave}
                  onDrop={handleLogoDrop}
                  onClick={() => document.getElementById('logoInput').click()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all h-40 flex items-center justify-center ${
                    dragOverLogo 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:bg-gray-50'
                  } ${
                    previewLogo ? 'border-green-500' : ''
                  }`}
                >
                  {previewLogo ? (
                    <div className="text-green-600">
                      <img
                        src={previewLogo}
                        alt='Logo Preview'
                        className='h-24 w-24 object-cover rounded-lg border mx-auto'
                      />
                      <p className="text-sm mt-2 font-semibold">{logoImage?.name || 'Logo Image Selected'}</p>
                      <p className="text-xs mt-1 text-gray-600">Click or drag to change</p>
                    </div>
                  ) : (
                    <div>
                      <i className={`ri-upload-cloud-2-line text-3xl mb-2 block ${
                        dragOverLogo ? 'text-blue-500' : 'text-gray-400'
                      }`}></i>
                      <p className="text-gray-600 font-medium">
                        Upload Logo
                      </p>
                      <p className="text-xs mt-1 text-gray-500">
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
                  onChange={(e) => handleFileChange(e.target.files[0], 'logoImage')}
                  className='hidden'
                />
              </div>

              {/* Group Image */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Group Image
                </label>
                
                {/* Drag and Drop Area for Group Image */}
                <div
                  onDragOver={handleGroupImageDragOver}
                  onDragLeave={handleGroupImageDragLeave}
                  onDrop={handleGroupImageDrop}
                  onClick={() => document.getElementById('groupImageInput').click()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all h-40 flex items-center justify-center ${
                    dragOverGroupImage 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:bg-gray-50'
                  } ${
                    previewGroupImage ? 'border-green-500' : ''
                  }`}
                >
                  {previewGroupImage ? (
                    <div className="text-green-600">
                      <img
                        src={previewGroupImage}
                        alt='Group Image Preview'
                        className='h-20 w-full object-cover rounded-lg border'
                      />
                      <p className="text-sm mt-2 font-semibold">{groupImage?.name || 'Group Image Selected'}</p>
                      <p className="text-xs mt-1 text-gray-600">Click or drag to change</p>
                    </div>
                  ) : (
                    <div>
                      <i className={`ri-upload-cloud-2-line text-3xl mb-2 block ${
                        dragOverGroupImage ? 'text-blue-500' : 'text-gray-400'
                      }`}></i>
                      <p className="text-gray-600 font-medium">
                        Upload Group Image
                      </p>
                      <p className="text-xs mt-1 text-gray-500">
                        Drag & drop or click to upload
                      </p>
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  type='file'
                  id='groupImageInput'
                  accept='image/*'
                  onChange={(e) => handleFileChange(e.target.files[0], 'groupImage')}
                  className='hidden'
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className='mt-4 pt-4 border-t border-gray-200 flex justify-end gap-3'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all font-medium'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='px-4 py-2 rounded-lg bg-[var(--chaiteam-orange)] hover:bg-[var(--chaiteam-orange)]/90 text-white transition-all disabled:bg-gray-400 cursor-pointer font-medium'
            >
              {loading ? 'Creating Group...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;