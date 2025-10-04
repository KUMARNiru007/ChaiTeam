import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { batchService, groupService } from '../services/api';
import Groups from './Groups';

function BatchPage() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batchData, setBatchData] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        setLoading(true);
        const [batch, group] = await Promise.all([
          batchService.getBatchById(batchId),
          groupService.getUserGroup(batchId).catch(() => null)
        ]);
        setBatchData(batch);
        setUserGroup(group);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch batch details:', err);
        setError('Failed to load batch details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (batchId) {
      fetchBatchDetails();
    }
  }, [batchId]);

  const [showGroups, setShowGroups] = useState(true);

  return (
    <div className="parkinsans-light" style={{ padding: '1.5rem' }}>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : batchData ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{batchData.name}</h1>
              <p className="text-gray-400 mt-2">{batchData.description}</p>
            </div>
            <button
              onClick={() => setShowGroups(!showGroups)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {showGroups ? 'View Batch Details' : 'View Groups'}
            </button>
          </div>

          {userGroup && (
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Your Group</h3>
              <div 
                className="bg-blue-500 p-4 rounded-lg cursor-pointer hover:bg-blue-600"
                onClick={() => navigate(`/batches/${batchId}/groups/${userGroup.id}`)}
              >
                <h4 className="text-white font-medium">{userGroup.name}</h4>
                <p className="text-blue-100 text-sm mt-1">{userGroup.description}</p>
              </div>
            </div>
          )}
          
          {showGroups ? (
            <Groups batchId={batchId} userGroupId={userGroup?.id} />
          ) : (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-white">Status</h3>
                  <p className="text-gray-300">{batchData.status}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Members</h3>
                  <p className="text-gray-300">{batchData.batchMembers?.length || 0} students</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>No batch data found</div>
      )}
    </div>
  );
}

export default BatchPage;