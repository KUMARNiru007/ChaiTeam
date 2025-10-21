import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './pages/Home';
import Batches from './docs/Batches';
import BatchPage from './docs/BatchPage';
import Groups from './docs/Groups';
import GroupPage from './docs/GroupPage';
import Docs from './Layout/Docs';
import Profile from './pages/Profile';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import NoticeBoard from './docs/NoticeBoard';
import Dashboard from './docs/Dashboard';
import GroupPageWrapper from './components/GroupPageWrapper.jsx';
import AdminBatchPage from './docs/AdminBatchesPage.jsx';
import AddStudents from './components/AddStudents.jsx';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<LoginPage />} />

      <Route element={<Layout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/batches' element={<Batches />} />
        <Route path='/batches/:batchId' element={<BatchPage />} />
        <Route path='/batches/:batchId/groups' element={<Groups />} />
        <Route
          path='/batches/:batchId/groups/:groupId'
          element={<GroupPageWrapper />}
        />
        <Route path='/create-batch' element={<AdminBatchPage />} />
        <Route path='/add-students' element={<AddStudents />} />
        <Route path='/noticeboard' element={<NoticeBoard />} />
        <Route path='/profile' element={<Profile />} />
      </Route>

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
