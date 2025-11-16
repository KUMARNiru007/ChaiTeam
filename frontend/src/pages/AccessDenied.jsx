import React from 'react'
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
      const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[var(--chaiteam-bg-primary)] flex items-center justify-center p-4">
      <div className="text-center">
        {/* Error Code */}
        <div className="text-8xl font-bold text-[var(--chaiteam-orange)] mb-4 parkinsans-bold">
          401
        </div>
        
        {/* Message */}
        <h1 className="text-2xl text-[var(--chaiteam-text-primary)] mb-4 parkinsans-bold">
          Access Denied
        </h1>
        
        <p className="text-[var(--chaiteam-text-secondary)] mb-8 max-w-md">
          You are not alowed to login in this app. As, you are not a memebr of any batch
        </p>

        {/* Action Button */}
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[var(--chaiteam-orange)] text-white rounded-lg hover:bg-[var(--chaiteam-orange-hover)] transition-colors font-medium"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  )
}

export default AccessDenied