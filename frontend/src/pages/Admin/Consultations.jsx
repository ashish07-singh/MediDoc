import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Consultations = () => {
    const [consultations, setConsultations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const aToken = localStorage.getItem('aToken');

    useEffect(() => {
        const fetchConsultations = async () => {
            if (!aToken) {
                toast.error("Admin token not found. Please login again.");
                return;
            }

            try {
                const { data } = await axios.get(`${backendUrl}/api/admin/consultations`, {
                    headers: { Authorization: `Bearer ${aToken}` }
                });
                
                if (data.success) {
                    setConsultations(data.chats);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error("Failed to load consultations.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConsultations();
    }, [aToken, backendUrl]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div className="flex justify-between items-center">
                <h1 className='text-3xl font-bold text-gray-800'>All Consultations</h1>
                <span className="text-gray-500">Total: {consultations.length}</span>
            </div>
            
            <div className='bg-white rounded-lg shadow-md border overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Patient
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Doctor
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {consultations.length > 0 ? (
                                consultations.map((consultation) => (
                                    <tr key={consultation._id} className='hover:bg-gray-50'>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <div className='flex-shrink-0 h-10 w-10'>
                                                    {consultation.userId?.image ? (
                                                        <img 
                                                            className='h-10 w-10 rounded-full object-cover' 
                                                            src={consultation.userId.image} 
                                                            alt={consultation.userId.name} 
                                                        />
                                                    ) : (
                                                        <div className='h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center'>
                                                            <span className='text-teal-600 font-semibold text-sm'>
                                                                {consultation.userId?.name?.charAt(0) || 'P'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='ml-4'>
                                                    <div className='text-sm font-medium text-gray-900'>
                                                        {consultation.userId?.name || 'Unknown Patient'}
                                                    </div>
                                                    <div className='text-sm text-gray-500'>
                                                        {consultation.userId?.email || 'No email'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900'>
                                                Dr. {consultation.doctorId?.name || 'Unknown Doctor'}
                                            </div>
                                            <div className='text-sm text-gray-500'>
                                                {consultation.doctorId?.speciality || 'No speciality'}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                consultation.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : consultation.status === 'completed'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {consultation.status || 'unknown'}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                            {consultation.createdAt ? new Date(consultation.createdAt).toLocaleDateString() : 'Unknown'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No consultations found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Consultations;
