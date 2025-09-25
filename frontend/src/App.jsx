import './App.css'
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './pages/Home';
import Batches from './docs/Batches';
import BatchPage from './docs/BatchPage';
import Groups from './docs/Groups';
import Docs from './Layout/Docs';
import Profile from './pages/Profile';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import NoticeBoard from './docs/NoticeBoard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Batches />} />
        <Route path="batches" element={<Batches />} />
        <Route path="batches/:id" element={<BatchPage />} />
        <Route path="groups" element={<Groups />} />
        <Route path="noticeboard" element={<NoticeBoard />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
