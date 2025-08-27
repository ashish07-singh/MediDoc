import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorDashboard = () => {
    const [dashData, setDashData] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const dToken = localStorage.getItem('dToken');

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!dToken) {
                toast.error("Doctor token not found. Please login again.");
                return;
            }

            try {
                // Fetch both dashboard stats and consultations
                const [dashResponse, chatsResponse] = await Promise.all([
                    axios.get(`${backendUrl}/api/doctor/dashboard`, { 
                        headers: { Authorization: `Bearer ${dToken}` } 
                    }),
                    axios.get(`${backendUrl}/api/doctor/chats`, { 
                        headers: { Authorization: `Bearer ${dToken}` } 
                    })
                ]);

                if (dashResponse.data.success) {
                    setDashData(dashResponse.data.dashData);
                }
                if (chatsResponse.data.success) {
                    setConsultations(chatsResponse.data.chats);
                }
            } catch (error) {
                toast.error("Failed to load dashboard data.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [dToken, backendUrl]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className='p-5 space-y-8'>
            <h1 className='text-3xl font-bold text-gray-800'>Doctor Dashboard</h1>
            
            {/* Statistics Cards */}
            {dashData && (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    <StatCard title="Total Consultations" value={dashData.totalConsultations || 0} />
                    <StatCard title="Today's Consultations" value={dashData.todayConsultations || 0} />
                    <StatCard title="Pending Consultations" value={dashData.pendingConsultations || 0} />
                </div>
            )}

            {/* Recent Consultations */}
            <div className='bg-white rounded-lg shadow-md border'>
                <div className='p-5 border-b'>
                    <h2 className='text-xl font-semibold text-gray-800'>Recent Consultations</h2>
                </div>
                <div className='p-5'>
                    {consultations && consultations.length > 0 ? (
                        <div className='space-y-3'>
                            {consultations.slice(0, 5).map((consultation, index) => (
                                <div key={consultation._id || index} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
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
                                                {consultation.userId?.email || 'No email'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            consultation.status === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : consultation.status === 'completed'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {consultation.status || 'unknown'}
                                        </span>
                                        <p className='text-sm text-gray-500 mt-1'>
                                            {consultation.createdAt ? new Date(consultation.createdAt).toLocaleDateString() : 'Unknown'}
                                        </p>
                                    </div>
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
            <p className='text-3xl font-bold text-teal-600'>{value}</p>
            <p className='text-gray-500 mt-1'>{title}</p>
        </div>
    </div>
);

export default DoctorDashboard;
