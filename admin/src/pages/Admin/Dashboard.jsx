import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { dashData, getDashData } = useContext(AdminContext);
    const navigate = useNavigate();

    useEffect(() => {
        // The getDashData function is now called automatically from the context
        // when the admin token is available, but we can call it here for an explicit refresh if needed.
        getDashData();
    }, []);

    if (!dashData) {
        return (
            <div className="p-10 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard data...</p>
            </div>
        );
    }

    // Safety check for required data
    if (!dashData.doctors && !dashData.patients && !dashData.consultations) {
        return (
            <div className="p-10 text-center">
                <p className="text-red-600">Failed to load dashboard data. Please refresh the page.</p>
            </div>
        );
    }

    return (
        <div className='m-5 space-y-8'>
            {/* --- STATISTICS CARDS (Updated for the new system) --- */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <StatCard icon={assets.doctor_icon} title="Total Doctors" value={dashData.doctors} />
                <StatCard icon={assets.appointments_icon} title="Total Consultations" value={dashData.consultations} />
                <StatCard icon={assets.patients_icon} title="Total Patients" value={dashData.patients} />
            </div>

            {/* --- LATEST CONSULTATIONS LIST --- */}
            <div className='bg-white rounded-lg shadow-md border'>
                <div className='flex items-center justify-between px-6 py-4 border-b'>
                    <h2 className='font-semibold text-lg text-gray-800'>Latest Consultations</h2>
                    {/* <button 
                        onClick={() => navigate('/admin/consultations')}
                        className="text-sm text-teal-600 font-semibold hover:underline"
                    >
                        View All
                    </button> */}
                </div>

                <div className='divide-y divide-gray-200'>
                    {dashData.latestConsultations && Array.isArray(dashData.latestConsultations) && dashData.latestConsultations.length > 0 ? (
                        dashData.latestConsultations.map((chat) => (
                            <div className='grid grid-cols-3 gap-4 items-center px-6 py-4' key={chat._id}>
                                {/* Patient Info */}
                                <div className='flex items-center gap-3'>
                                    <div className='relative'>
                                        <img 
                                            className='rounded-full w-10 h-10 object-cover bg-gray-200 transition-all duration-200' 
                                            src={chat.userId?.image || assets.default_user} 
                                            alt="Patient" 
                                            onError={(e) => {
                                                if (e.target.src !== assets.default_user) {
                                                    e.target.src = assets.default_user;
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p className='text-gray-800 font-semibold'>{chat.userId?.name || 'Unknown Patient'}</p>
                                    </div>
                                </div>
                                {/* Doctor Info */}
                                <div className='flex items-center gap-3'>
                                    <div className='relative'>
                                        <img 
                                            className='rounded-full w-10 h-10 object-cover bg-gray-200 transition-all duration-200' 
                                            src={chat.doctorId?.image || assets.default_doctor} 
                                            alt="Doctor" 
                                            onError={(e) => {
                                                if (e.target.src !== assets.default_doctor) {
                                                    e.target.src = assets.default_doctor;
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p className='text-gray-800 font-semibold'>{chat.doctorId?.name || 'Unknown Doctor'}</p>
                                    </div>
                                </div>
                                {/* Date */}
                                <p className="text-gray-500 text-sm text-right">
                                    {chat.createdAt ? new Date(chat.createdAt).toLocaleString() : 'Unknown Date'}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="p-6 text-center text-gray-500">No recent consultations found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper component for the statistic cards
const StatCard = ({ icon, title, value }) => (
    <div className='flex items-center gap-4 bg-white p-5 rounded-lg border shadow-sm'>
        <img className='w-12' src={icon} alt={title} />
        <div>
            <p className='text-2xl font-bold text-gray-700'>{value}</p>
            <p className='text-gray-500'>{title}</p>
        </div>
    </div>
);

export default Dashboard;