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
          You are not allowed to login to this app. As you are not a member of any batch
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[var(--chaiteam-orange)] text-white rounded-lg hover:bg-[var(--chaiteam-orange-hover)] transition-colors font-medium"
          >
            Return to Homepage
          </button>
          
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfJtBhW-dqKYAy6V218QQWLchbaUiLjEqxV3p1j9Yakrs1CiQ/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-transparent border border-[var(--chaiteam-orange)] text-[var(--chaiteam-orange)] rounded-lg hover:bg-[var(--chaiteam-orange)] hover:text-white transition-colors font-medium"
          >
            Request Access
          </a>
        </div>
      </div>
    </div>
  )
}

export default AccessDenied