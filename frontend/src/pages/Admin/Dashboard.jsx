import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [dashData, setDashData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const aToken = localStorage.getItem('aToken');

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!aToken) {
                toast.error("Admin token not found. Please login again.");
                return;
            }

            try {
                const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
                    headers: { Authorization: `Bearer ${aToken}` }
                });
                
                if (data.success) {
                    setDashData(data.dashData);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error("Failed to load dashboard data.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [aToken, backendUrl]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (!dashData) {
        return <div className="p-10 text-center">No dashboard data available</div>;
    }

    return (
        <div className='p-5 space-y-8'>
            <h1 className='text-3xl font-bold text-gray-800'>Admin Dashboard</h1>
            
            {/* Statistics Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <StatCard title="Total Doctors" value={dashData.doctors} />
                <StatCard title="Total Consultations" value={dashData.consultations} />
                <StatCard title="Total Patients" value={dashData.patients} />
            </div>

            {/* Latest Consultations */}
            <div className='bg-white rounded-lg shadow-md border'>
                <div className='p-5 border-b'>
                    <h2 className='text-xl font-semibold text-gray-800'>Latest Consultations</h2>
                </div>
                <div className='p-5'>
                    {dashData.latestConsultations && dashData.latestConsultations.length > 0 ? (
                        <div className='space-y-3'>
                            {dashData.latestConsultations.map((consultation, index) => (
                                <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center'>
                                            <span className='text-teal-600 font-semibold'>
                                                {consultation.userId?.name?.charAt(0) || 'P'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='font-medium text-gray-800'>
                                                {consultation.userId?.name || 'Unknown Patient'}
                                            </p>
                                            <p className='text-sm text-gray-500'>
                                                Dr. {consultation.doctorId?.name || 'Unknown Doctor'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className='text-sm text-gray-500'>
                                        {new Date(consultation.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='text-gray-500 text-center py-4'>No consultations found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper component for statistic cards
const StatCard = ({ title, value }) => (
    <div className='bg-white p-5 rounded-lg border shadow-sm'>
        <div className='text-center'>
            <p className='text-3xl font-bold text-teal-600'>{value || 0}</p>
            <p className='text-gray-500 mt-1'>{title}</p>
        </div>
    </div>
);

export default Dashboard;
