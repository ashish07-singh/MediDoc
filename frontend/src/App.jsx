import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import DoctorSignup from './pages/DoctorSignup';
import About from './pages/About';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import MyProfile from './pages/MyProfile';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';
import MyConsultations from './pages/MyConsultations';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

// Admin components
import AdminDashboard from './pages/Admin/Dashboard';
import DoctorsList from './pages/Admin/DoctorsList';
import Consultations from './pages/Admin/Consultations';

// Doctor components
import DoctorDashboard from './pages/Doctor/Dashboard';


const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <main className="py-6">
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin-login' element={<AdminLogin />} />
          <Route path='/doctor-signup' element={<DoctorSignup />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/terms-and-conditions' element={<TermsAndConditions />} />

          {/* Admin Routes */}
          <Route path='/admin/*' element={
            <AdminLayout>
              <Routes>
                <Route path='dashboard' element={<AdminDashboard />} />
                <Route path='doctors' element={<DoctorsList />} />
                <Route path='consultations' element={<Consultations />} />
              </Routes>
            </AdminLayout>
          } />

          {/* Doctor Routes */}
          <Route path='/doctor/*' element={
            <AdminLayout>
              <Routes>
                <Route path='dashboard' element={<DoctorDashboard />} />
              </Routes>
            </AdminLayout>
          } />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='/appointment/:docId' element={<Appointment />} />
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='/chat/:chatId' element={<ChatPage />} />
            <Route path='/my-consultations' element={<MyConsultations />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
