import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { dToken } = useContext(DoctorContext);
    const { aToken } = useContext(AdminContext);

    // This component will render the correct set of links based on the user's role.
    const role = aToken ? 'admin' : dToken ? 'doctor' : null;

    if (!role) {
        return null; // Don't render a sidebar on the login page
    }

    // Define the links for each role
    const adminLinks = [
        { path: '/admin/dashboard', icon: assets.home_icon, label: 'Dashboard' },
        // { path: '/admin/consultations', icon: assets.appointment_icon, label: 'Consultations' },
        // { path: '/admin/add-doctor', icon: assets.add_icon, label: 'Add Doctor' },
        { path: '/admin/doctors', icon: assets.people_icon, label: 'Doctors List' },
    ];

    const doctorLinks = [
        { path: '/doctor/dashboard', icon: assets.home_icon, label: 'Dashboard' },
        { path: '/doctor/profile', icon: assets.people_icon, label: 'My Profile' },
    ];

    const linksToRender = role === 'admin' ? adminLinks : doctorLinks;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <div className={`
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                transform transition-transform duration-300 ease-in-out
                md:static md:translate-x-0
                fixed inset-y-0 left-0 z-30 md:z-auto
                min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-64px)] bg-gray-50 border-r border-gray-200
                w-64 md:w-auto
            `}>
                {/* Close button for mobile */}
                <div className="flex justify-between items-center p-4 border-b md:hidden">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {role === 'admin' ? 'Admin Panel' : 'Doctor Panel'}
                    </h2>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-md hover:bg-gray-200 transition-colors"
                        aria-label="Close menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <ul className='text-gray-600 font-medium space-y-2 pt-4'>
                    {linksToRender.map((link) => (
                        <li key={link.path}>
                            <NavLink 
                                to={link.path} 
                                onClick={() => setIsOpen(false)} // Close sidebar on mobile when link is clicked
                                className={({ isActive }) => 
                                    `flex items-center gap-3 py-3 px-6 cursor-pointer transition-colors duration-200 hover:bg-teal-50 hover:text-teal-600 ${
                                        isActive 
                                            ? 'bg-teal-100 text-teal-700 border-r-4 border-teal-600 font-semibold' 
                                            : ''
                                    }`
                                }
                            >
                                <img className='w-5' src={link.icon} alt={`${link.label} icon`} />
                                <p className='block'>{link.label}</p>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Sidebar;