import React, { useState, useEffect } from 'react';
import CreateBatchModal from '../components/CreateBatchModel.jsx';
import EditBatchModal from '../components/EditBatchModal.jsx';
import UploadCSVModal from '../components/UploadCSV.jsx';
import { useBatchStore } from '../store/useBatchStore.js';
import { batchService } from '../services/api.js';
import { useTheme } from '../context/ThemeContext.jsx';
import CustomDropdown from '../components/CustomDropdown.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminBatchPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [batchOptions, setBatchOptions] = useState([
    { id: 1, label: 'All Batches', value: 'all' },
  ]);

  const [statusOptions, setStatusOptions] = useState([
    { id: 1, label: 'All Status', value: 'all' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [batchesData, setBatchesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  const handleUpdateBatch = async (batchId, payload) => {
    try {
      if (!payload) {
        await handleDeleteBatch(batchId);
        return;
      }

      await batchService.updateBatch(batchId, payload);
      setBatchesData((prevBatches) =>
        prevBatches.map((batch) =>
          batch.id === batchId ? { ...batch, ...payload } : batch,
        ),
      );
      setShowEditModal(false);
      toast.success('Batch updated successfully!');
    } catch (err) {
      console.error('Update batch error:', err);
      toast.error('Failed to update batch');
    }
  };

  const handleCSVUpload = async (batchId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      await batchService.uploadBatchCSV(batchId, formData);
      toast.success('CSV uploaded successfully!');
      const updatedBatch = await batchService.getBatchById(batchId);
      setBatchesData((prevBatches) =>
        prevBatches.map((batch) =>
          batch.id === batchId ? updatedBatch : batch,
        ),
      );
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast.error('Error uploading CSV');
      throw error;
    }
  };

  // Fetch all batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const data = await batchService.getAllBatches();
        console.log('ALL Batches: ', data);
        
        // Filter out any null/undefined batches
        const batches = Array.isArray(data) ? data.filter(batch => batch != null) : [];
        setBatchesData(batches);

        // Update batch options dynamically
        const uniqueBatches = batches.map((batch, index) => ({
          id: index + 2,
          label: batch.name,
          value: batch.id,
        }));
        setBatchOptions([
          { id: 1, label: 'All Batches', value: 'all' },
          ...uniqueBatches,
        ]);

        setStatusOptions([
          { id: 1, label: 'All Status', value: 'all' },
          { id: 2, label: 'Active', value: 'ACTIVE' },
          { id: 3, label: 'Completed', value: 'COMPLETED' },
          { id: 4, label: 'Inactive', value: 'INACTIVE' },
        ]);

        setError(null);
      } catch (err) {
        console.error('Failed to fetch batches:', err);
        setError('Failed to load batches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  // Fixed: Safe filtering with null checks
  const filteredBatches = batchesData.filter((batch) => {
    // Skip undefined or null batches
    if (!batch) return false;

    const batchName = batch.name || '';
    const batchDescription = batch.description || '';

    const matchesSearch =
      batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batchDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBatch =
      selectedBatch === 'all' ||
      batchName.toLowerCase().includes(selectedBatch.toLowerCase()) ||
      batch.id === selectedBatch;

    const matchesStatus =
      selectedStatus === 'all' || batch.status === selectedStatus;

    return matchesSearch && matchesBatch && matchesStatus;
  });

  const handleSave = async (payload) => {
    try {
      const data = await batchService.createBatch(payload);
      toast.success('Batch created successfully!');
      setShowModal(false);
      setBatchesData((prev) => [...prev, data]); // Add new batch to list
    } catch (err) {
      console.error('Create batch error:', err);
      toast.error('Failed to create batch');
    }
  };

  const handleDeleteBatch = async (batchId) => {
    try {
      await batchService.deleteBatch(batchId);
      setBatchesData((prevBatches) =>
        prevBatches.filter((batch) => batch.id !== batchId),
      );
      toast.success('Batch deleted successfully!');
    } catch (error) {
      console.error('Error while Deleting Batch: ', error);
      toast.error(
        'Failed to delete batch. Maybe the batch has some active groups.',
      );
    }
  };

  const BatchCard = ({ batch }) => {
    // Fixed: Add null check at the beginning
    if (!batch) return null;

    const [totalStudents, setTotalStudents] = useState(0);
    const [showEditButton, setShowEditButton] = useState(false);

    useEffect(() => {
      const fetchBatchMembers = async () => {
        try {
          const response = await batchService.getBatchById(batch.id);
          setTotalStudents(response.batchMembers?.length || 0);
        } catch (error) {
          console.error('Error fetching batch members:', error);
        }
      };
      fetchBatchMembers();
    }, [batch.id]);

    const handleEditClick = (e) => {
      e.stopPropagation();
      setShowEditModal(true);
      setEditingBatch(batch);
    };

    return (
      <div
        onClick={handleEditClick}
        onMouseEnter={() => setShowEditButton(true)}
        onMouseLeave={() => setShowEditButton(false)}
        className={`relative rounded-2xl overflow-hidden transition-all duration-200 group ${
          darkMode
            ? 'bg-[#2b2d31] hover:bg-[#313338]'
            : 'bg-white hover:bg-gray-100 border-[1px] border-gray-300'
        } cursor-pointer`}
      >
        {showEditButton && (
          <div className='absolute top-2 right-2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200'>
            <i className='ri-edit-line text-gray-700'></i>
          </div>
        )}
        <div className='h-28 w-full overflow-hidden'>
          <img
            src={
              batch.bannerImageUrl ||
              'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80'
            }
            alt={batch.name}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 overflow-hidden'
          />
        </div>

        <div className='absolute top-17 left-4'>
          <div
            className={`w-19 h-18 z-10 rounded-2xl border-[6px] overflow-hidden ${
              darkMode
                ? 'border-[#2b2d31] bg-[#2b2d31]'
                : 'border-white bg-white'
            }`}
          >
            <img
              src={
                batch.logoImageUrl ||
                'https://ui-avatars.com/api/?name=' +
                  encodeURIComponent(batch.name) +
                  '&size=80&background=5865f2&color=fff&bold=true'
              }
              alt={batch.name}
              className='w-full h-full object-cover z-10'
            />
          </div>
        </div>

        <div className='pt-9 px-4 pb-4'>
          <div className='flex justify-start gap-1'>
            <span>
              <i className='ri-verified-badge-fill text-green-400 text-center'></i>
            </span>
            <h3
              className={`font-semibold text-base ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {batch.name}
            </h3>
          </div>

          <p
            className={`text-sm mb-4 line-clamp-2 leading-relaxed ${
              darkMode ? 'text-[#b5bac1]' : 'text-gray-600'
            }`}
          >
            {batch.description ||
              'Join this batch to learn and grow with fellow students.'}
          </p>

          <div
            className={`flex items-center gap-4 text-xs ${
              darkMode ? 'text-[#b5bac1]' : 'text-gray-500'
            }`}
          >
            <div className='flex items-center gap-1.5'>
              <div
                className={`w-2 h-2 rounded-full ${
                  batch.status === 'ACTIVE'
                    ? 'bg-green-500'
                    : batch.status === 'COMPLETED'
                    ? 'bg-blue-500'
                    : batch.status === 'INACTIVE'
                    ? 'bg-red-500'
                    : 'bg-gray-500'
                }`}
              ></div>
              <span className='font-medium'>
                {batch.status === 'ACTIVE'
                  ? 'Active'
                  : batch.status === 'COMPLETED'
                  ? 'Completed'
                  : batch.status === 'INACTIVE'
                  ? 'Inactive'
                  : batch.status}
              </span>
            </div>
            <div className='flex items-center gap-1.5'>
              <div
                className={`w-2 h-2 rounded-full ${
                  darkMode ? 'bg-[#80848e]' : 'bg-gray-400'
                }`}
              ></div>
              <span className='font-medium'>
                {totalStudents.toLocaleString()} Members
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen p-8'>
      {/* Create Batch Section */}
      <div
        className={`mx-auto shadow-md rounded-2xl p-8 mb-8 ${
          darkMode
            ? 'bg-[#222225] text-white'
            : 'border-gray-300 bg-gray-50 text-gray-600'
        }`}
      >
        <div className='flex justify-between items-center mb-1'>
          <h2
            className={`text-3xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-800'
            } mb-2`}
          >
            Manage Batches
          </h2>
          <div className='flex gap-3'>
            <button
              onClick={() => setShowCSVModal(true)}
              className='bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-all cursor-pointer flex items-center'
            >
              <i className='ri-file-upload-line mr-2'></i> Upload CSV
            </button>
            <button
              onClick={() => setShowModal(true)}
              className='bg-[var(--chaiteam-btn-start)] hover:bg-[var(--chaiteam-btn-primary-hover)] text-white px-5 py-2 rounded-lg transition-all cursor-pointer'
            >
              + Create New Batch
            </button>
          </div>
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

      <UploadCSVModal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        batches={batchesData}
        onUpload={handleCSVUpload}
      />

      {/* Search Filters */}
      <div className='mt-6 flex flex-col gap-4 md:flex-row md:items-center mb-6'>
        {/* Search Input */}
        <div className='flex-1 w-full md:w-2/4'>
          <div className='relative'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
              <i
                className={`ri-search-line ${
                  darkMode ? 'text-gray-50' : 'text-black'
                }`}
              ></i>
            </span>
            <input
              type='text'
              placeholder='Search Batches'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl border ${
                darkMode
                  ? 'bg-[#27272A] text-white placeholder-gray-50 border-white/30'
                  : 'border-gray-300 bg-gray-50 text-gray-600 placeholder-gray-400 focus:bg-gray-100'
              } py-2 pl-9 pr-2 focus:outline-none md:w-4/4`}
            />
          </div>
        </div>

        {/* Batch Dropdown */}
        <div className='relative w-full md:w-1/4'>
          <CustomDropdown
            options={batchOptions}
            placeholder='All Batches'
            onSelect={(option) => setSelectedBatch(option.value)}
          />
        </div>

        {/* Status Dropdown */}
        <div className='relative w-full md:w-1/4'>
          <CustomDropdown
            options={statusOptions}
            placeholder='Status'
            onSelect={(option) => setSelectedStatus(option.value)}
          />
        </div>
      </div>

      {/* Batch Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div
            className='spinner'
            style={{
              border: '4px solid rgba(255, 161, 22, 0.8)',
              borderLeft: '4px solid #ffffff',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '1rem auto',
            }}
          ></div>
          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
          <p style={{ marginTop: '1rem', color: '#b3b3b3' }}>Loading...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ff4d4f' }}>
          <i className='ri-error-warning-line' style={{ fontSize: '2rem' }}></i>
          <p style={{ marginTop: '1rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              marginTop: '1rem',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {filteredBatches.length > 0 ? (
            filteredBatches.map((batch) => (
              <BatchCard key={batch.id} batch={batch} />
            ))
          ) : (
            <div className='col-span-full text-center text-gray-500 py-8'>
              No batches found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* Edit Batch Modal */}
      {showEditModal && editingBatch && (
        <EditBatchModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingBatch(null);
          }}
          onSave={handleUpdateBatch}
          batch={editingBatch}
        />
      )}
    </div>
  );
};

export default AdminBatchPage;