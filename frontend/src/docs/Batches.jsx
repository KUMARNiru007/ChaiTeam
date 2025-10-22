import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { batchService } from '../services/api';
import { useTheme } from '../context/ThemeContext.jsx';

import CustomDropdown from '../components/CustomDropdown.jsx';

const Batches = () => {
  const [batchOptions, setBatchOptions] = useState([
    { id: 1, label: 'All Batches', value: 'all' },
  ]);
  
  const [statusOptions, setStatusOptions] = useState([
    { id: 1, label: 'All Status', value: 'all' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('live');
  const [batchesData, setBatchesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const data = await batchService.getAllBatches();
        console.log('DATA: ', data);
        const batches = Array.isArray(data) ? data : [];
        setBatchesData(batches);

        // Update batch options
        const uniqueBatches = batches.map((batch, index) => ({
          id: index + 2, // Start from 2 since 1 is "All Batches"
          label: batch.name,
          value: batch.id
        }));
        setBatchOptions([
          { id: 1, label: 'All Batches', value: 'all' },
          ...uniqueBatches
        ]);

        // status options
        setStatusOptions([
          { id: 1, label: 'All Status', value: 'all' },
          { id: 2, label: 'Active', value: 'ACTIVE' },
          { id: 3, label: 'Completed', value: 'COMPLETED' },
          { id: 4, label: 'Inactive', value: 'INACTIVE' }
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

  const tabCounts = {
    live: Array.isArray(batchesData)
      ? batchesData.filter((b) => b.status === 'ACTIVE').length
      : 0,
    upcoming: Array.isArray(batchesData)
      ? batchesData.filter((b) => b.status === 'PENDING').length
      : 0,
    past: Array.isArray(batchesData)
      ? batchesData.filter((b) => b.status === 'COMPLETED').length
      : 0,
  };

  const filteredBatches = batchesData.filter((batch) => {
    // Search filter
    const matchesSearch =
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (batch.description &&
        batch.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Tab filter (live/past)
    const matchesTab =
      activeTab === 'live'
        ? batch.status === 'ACTIVE'
        : activeTab === 'past'
        ? batch.status === 'COMPLETED'
        : false;

    // Batch dropdown filter
    const matchesBatch =
      selectedBatch === 'all' ||
      batch.name.toLowerCase().includes(selectedBatch.toLowerCase()) ||
      batch.id === selectedBatch;

    // Status filter
    const matchesCategory =
      selectedStatus === 'all' ||
      batch.status === selectedStatus;

    return matchesSearch && matchesTab && matchesBatch && matchesCategory;
  });

  const navigate = useNavigate();

  const BatchCard = ({ batch }) => {
    const [totalStudents, setTotalStudents] = useState(0);

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

    return (
      <div
        onClick={() => navigate(batch.id)}
        className={`relative rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group ${
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
              className={`font-semibold text-base  ${
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
              'Join this batch to learn and grow with fellow students. Get access to exclusive content and mentorship.'}
          </p>

          <div
            className={`flex items-center gap-4 text-xs ${
              darkMode ? 'text-[#b5bac1]' : 'text-gray-500'
            }`}
          >
            <div className='flex items-center gap-1.5'>
              <div className={`w-2 h-2 rounded-full ${
                batch.status === 'ACTIVE' ? 'bg-green-500' :
                batch.status === 'COMPLETED' ? 'bg-blue-500' :
                batch.status === 'INACTIVE' ? 'bg-red-500' : 'bg-gray-500'
              }`}></div>
              <span className='font-medium'>{
                batch.status === 'ACTIVE' ? 'Active' :
                batch.status === 'COMPLETED' ? 'Completed' :
                batch.status === 'INACTIVE' ? 'Inactive' :
                batch.status
              }</span>
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
    <div
      className='parkinsans-light transition-all duration-200'
      style={{ padding: '1rem' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            className={`${darkMode ? 'text-white' : 'text-black'}`}
            style={{
              fontSize: '22px',
              fontWeight: 'var(--font-weight-bold, 700)',
              margin: '0 0 0.5rem 0',
            }}
          >
            Batches
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--chaiteam-text-secondary, #a0a0a0)',
              margin: 0,
            }}
          >
            Full view of your all batches and batches you joined.
          </p>
        </div>

        <button
          className='fixed z-10 right-12'
          onClick={toggleTheme}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <i
            className={`ri-${darkMode ? 'sun' : 'moon'}-fill`}
            style={{
              color: `${darkMode ? '#ffffff' : '#000000'}`,
              fontSize: '18px',
            }}
          ></i>
        </button>
      </div>

      {/* Search Filters */}
      <div className='mt-6 flex flex-col gap-4 md:flex-row md:items-center'>
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
            onSelect={(option) => {
              setSelectedBatch(option.value);
            }}
          />
        </div>

        {/* Status Dropdown */}
        <div className='relative w-full md:w-1/4'>
          <CustomDropdown
            options={statusOptions}
            placeholder='Status'
            onSelect={(option) => {
              setSelectedStatus(option.value);
            }}
          />
        </div>
      </div>

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
          <p style={{ marginTop: '1rem', color: '#b3b3b3' }}>
            Loading batches...
          </p>
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem',
          }}
        >
          {filteredBatches.length > 0 ? (
            filteredBatches.map((batch) => (
              <BatchCard key={batch.id} batch={batch} />
            ))
          ) : (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '2rem',
                color: '#b3b3b3',
              }}
            >
              No batches found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Batches;
