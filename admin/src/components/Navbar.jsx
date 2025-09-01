import React, { useContext } from 'react'; // <-- THIS IS THE FIX
import { assets } from '../assets/assets';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
    const navigate = useNavigate();

    // Now that 'useContext' is imported, these lines will work correctly.
    const { dToken, handleDoctorLogout } = useContext(DoctorContext);
    const { aToken, handleAdminLogout } = useContext(AdminContext);

    const onLogout = () => {
        if (aToken) {
            handleAdminLogout();
        } else if (dToken) {
            handleDoctorLogout();
        }
        // Redirect to the login page after logging out
        navigate('/');
    };

    // Determine the current role for display
    const currentRole = aToken ? 'Admin' : dToken ? 'Doctor' : null;

    return (
        <div className='w-full h-16 flex justify-between items-center px-4 sm:px-10 py-2 border-b bg-white shadow-sm z-10 relative'>
            <div className='flex items-center gap-3'>
                {/* Hamburger Menu Button - Only visible on mobile */}
                <button 
                    onClick={onMenuClick}
                    className='md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors'
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                
                <div className='flex items-center gap-2'>
                    <img 
                        className='w-12 h-12 object-contain' 
                        src={assets.logo} 
                        alt="Logo" 
                    />
                    
                </div>
                
                {currentRole && (
                    <p className='border px-2.5 py-0.5 rounded-full border-gray-400 text-gray-600 text-xs font-semibold'>
                        {currentRole} Panel
                    </p>
                )}
            </div>
            
            {(aToken || dToken) && (
                <button 
                    onClick={onLogout} 
                    className='bg-teal-600 text-white text-sm px-6 py-2 rounded-full hover:bg-teal-700 transition-all'
                >
                    Logout
                </button>
            )}
        </div>
    );
};

export default Navbar;