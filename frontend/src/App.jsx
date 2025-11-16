import react, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import {Toaster} from "sonner";
import Layout from './Layout/Layout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Batches from './docs/Batches';
import BatchPage from './docs/BatchPage';
import Groups from './docs/Groups';
import GroupPage from './docs/GroupPage';
import Profile from './pages/Profile';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import Dashboard from './docs/Dashboard';
import Announcement from './docs/Announcement.jsx';
import AllApplications from './docs/AllApplications.jsx';
import UserProfile from './components/UserProfile.jsx'
import GroupPageWrapper from './components/GroupPageWrapper.jsx';
import AdminBatchPage from './docs/AdminBatchesPage.jsx';
import AdminAllUsersPage from './docs/AdminAllUsersPage.jsx';
import AdminAllGroups from './docs/AdminAllGroups.jsx';

import { useAuthStore } from './store/useAuthStore.js';
import AccessDenied from './pages/AccessDenied.jsx';

function App() {
  const { authUser, checkAuth, refreshToken } = useAuthStore();
  const [authError, setAuthError] = useState(false);
  useEffect(() => {
    const runAuthCheck = async () => {
      try {
        await checkAuth();
      } catch (err) {
        console.error('Auth check failed:', err);
        setAuthError(true);
      }
    };

    runAuthCheck();

    const interval = setInterval(() => {
      refreshToken().catch(() => setAuthError(true));
    }, 1000 * 60 * 3);

    return () => clearInterval(interval);
  }, [checkAuth, refreshToken]);

  return (
    <>
    <Toaster/>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<AboutUs />} />
      <Route path='/login' element={<LoginPage />} />

      <Route element={<Layout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/batches' element={<Batches />} />
        <Route path='/batches/:batchId' element={<BatchPage />} />
        <Route path='/batches/:batchId/groups' element={<Groups />} />
        <Route path='/groups/:groupId' element={<GroupPageWrapper />} />
        <Route path='/applications' element={<AllApplications />} />
        <Route path='/create-batch' element={<AdminBatchPage />} />
        <Route path='/allUsers' element={<AdminAllUsersPage />} />
        <Route path='/allGroups' element={<AdminAllGroups />} />
        <Route path='/announcement' element={<Announcement />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/user-profile/:userId' element={<UserProfile />} />
      </Route>

      <Route path='/access-denied' element={<AccessDenied />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
    </>
  );
}

export default App;