import React, { useState, useEffect } from 'react';
import CreateBatchModal from '../components/CreateBatchModel.jsx';
import { useBatchStore } from '../store/useBatchStore.js';
import { batchService } from '../services/api.js';
import { useTheme } from '../context/ThemeContext.jsx';
import CustomDropdown from '../components/CustomDropdown.jsx';
import { useNavigate } from 'react-router-dom';

const batchOptions = [
  { id: 1, label: 'All Batches', value: 'all' },
  { id: 2, label: 'Batch A', value: 'batch-a' },
  { id: 3, label: 'Batch B', value: 'batch-b' },
];

const categoryOptions = [
  { id: 1, label: 'All Categories', value: 'all' },
  { id: 2, label: 'Frontend', value: 'frontend' },
  { id: 3, label: 'Backend', value: 'backend' },
];

const AdminBatchPage = () => {
  const { name, description, logoUrl, bannerUrl } = useBatchStore();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [batchesData, setBatchesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBatch, setDeletingBatch] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  // Fetch all batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const data = await batchService.getAllBatches();
        console.log('ALL Batches: ', data);
        setBatchesData(Array.isArray(data) ? data : []);
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

  // Filtered batches based on search, batch, category
  const filteredBatches = batchesData.filter((batch) => {
    const matchesSearch =
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (batch.description &&
        batch.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBatch =
      selectedBatch === 'all' ||
      batch.name.toLowerCase().includes(selectedBatch.toLowerCase()) ||
      batch.id === selectedBatch;

    const matchesCategory =
      selectedCategory === 'all' ||
      (batch.category &&
        batch.category.toLowerCase() === selectedCategory.toLowerCase()) ||
      (batch.tags &&
        batch.tags.some(
          (tag) => tag.toLowerCase() === selectedCategory.toLowerCase(),
        ));

    return matchesSearch && matchesBatch && matchesCategory;
  });

  const handleSave = async (payload) => {
    try {
      const data = await batchService.createBatch(payload);
      alert('Batch created successfully!');
      setShowModal(false);
      setBatchesData((prev) => [...prev, data]); // Add new batch to list
    } catch (err) {
      console.error('Create batch error:', err);
      alert('Failed to create batch');
    }
  };

  const handleOpenModal = (batch) => {
    setDeletingBatch(batch);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setDeletingBatch(null);
    setShowDeleteModal(false);
  };

  const handleDeleteBatch = async (batchId) => {
    setUpdating(true);
    try {
      const response = await batchService.deleteBatch(batchId);
      setBatchesData((prevBatches) =>
        prevBatches.filter((batch) => batch.id !== batchId),
      );

      setSuccessModal(true);
    } catch (error) {
      console.error('Error while Deleting Batch: ', error);
      setErrorModal(true);
    } finally {
      setUpdating(false);
      setShowDeleteModal(false);
    }
  };

  const BatchCard = ({ batch }) => {
    const onlineStudents = Math.floor(Math.random() * 500) + 100;
    const totalStudents =
      batch.batchMembers?.length || Math.floor(Math.random() * 2000) + 1000;

    return (
      <div
        onClick={() => handleOpenModal(batch)}
        className={`relative rounded-2xl overflow-hidden transition-all duration-200 group ${
          darkMode
            ? 'bg-[#2b2d31] hover:bg-[#313338]'
            : 'bg-white hover:bg-gray-100 border-[1px] border-gray-300'
        }`}
      >
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
              <div className='w-2 h-2 rounded-full bg-green-500'></div>
              <span className='font-medium'>{batch.status}</span>
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
      <div className='mx-auto bg-white shadow-md rounded-2xl p-8 mb-8'>
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

      {/* ===== Render All Batches with Filters ===== */}
      <div className='mt-8'>
        {/* Filters */}
        <div className='flex flex-col gap-4 md:flex-row md:items-center mb-6'>
          <div className='flex-1 w-full md:w-2/4 relative'>
            <input
              type='text'
              placeholder='Search Batches'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 ${
                darkMode
                  ? 'bg-[#27272A] text-white placeholder-gray-50 border-white/30'
                  : 'border-gray-300 bg-gray-50 text-gray-600 placeholder-gray-400'
              }`}
            />
          </div>

          <div className='md:w-1/4 relative'>
            <CustomDropdown
              options={batchOptions}
              placeholder='All Batches'
              onSelect={(option) => setSelectedBatch(option.value)}
            />
          </div>

          <div className='md:w-1/4 relative'>
            <CustomDropdown
              options={categoryOptions}
              placeholder='All Categories'
              onSelect={(option) => setSelectedCategory(option.value)}
            />
          </div>
        </div>

        {/* Batch Cards */}
        {loading ? (
          <div className='text-center py-8'>Loading batches...</div>
        ) : error ? (
          <div className='text-center text-red-500 py-8'>{error}</div>
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
      </div>

      {/* rendring Delete batch Modal */}
      {showDeleteModal && deletingBatch && (
        <div className='fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50'>
          <div
            className={`rounded-xl p-6 w-96 ${
              darkMode ? 'bg-[#18181B] text-white' : 'bg-white text-black'
            }`}
          >
            <h3 className='text-xl font-semibold text-center'>
              Wanted to Delete Batch?
            </h3>

            <div className='flex flex-col items-center mb-4 mt-4'>
              <img
                src={deletingBatch.logoImageUrl || '/default-avatar.png'}
                alt={deletingBatch.name}
                className='w-20 h-20 rounded-full mb-1 object-cover border-2 border-gray-300'
              />
              <p className='text-lg font-medium'>{deletingBatch.name}</p>
            </div>

            <button
              onClick={() => handleDeleteBatch(deletingBatch.id)}
              disabled={updating}
              className='w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition cursor-pointer'
            >
              {updating ? 'Deleting...' : 'Delete Batch'}
            </button>

            <button
              onClick={handleCloseModal}
              className='w-full mt-3 border border-gray-400 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer'
            >
              Close
            </button>
          </div>
        </div>
      )}

      {successModal && (
        <div className='fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50'>
          <div
            className={`rounded-xl p-6 w-96 ${
              darkMode ? 'bg-[#18181B] text-white' : 'bg-white text-black'
            }`}
          >
            <h2 className='text-lg font-semibold mb-3 text-center'>
              Batch Deleted Successfully!
            </h2>
            <button
              onClick={() => setSuccessModal(false)}
              className='w-full mt-3 border border-gray-400 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer'
            >
              Close
            </button>
          </div>
        </div>
      )}

      {errorModal && (
        <div className='fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50'>
          <div
            className={`rounded-xl p-6 w-96 ${
              darkMode ? 'bg-[#18181B] text-white' : 'bg-white text-black'
            }`}
          >
            <h2 className='text-lg font-semibold mb-3 text-center text-red-500'>
              Failed to Delete Batch
            </h2>
            <p className='text-sm mb-1 mt-3 text-center text-red-500'>
              *Maybe the Batch has some active Groups
            </p>
            <button
              onClick={() => setErrorModal(false)}
              className='w-full mt-3 border border-gray-400 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBatchPage;
