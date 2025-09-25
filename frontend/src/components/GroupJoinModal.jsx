import React from 'react';

const GroupJoinModal = ({ isOpen, onClose, onJoin, batchId, groupId }) => {
  if (!isOpen) return null;

  const handleJoin = () => {
    onJoin(batchId, groupId);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Join Group</h2>
        <p>Do you want to join this group?</p>
        <div className="modal-actions">
          <button onClick={handleJoin}>Join</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default GroupJoinModal;