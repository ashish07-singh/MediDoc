import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const aToken = localStorage.getItem('aToken');

    useEffect(() => {
        const fetchDoctors = async () => {
            if (!aToken) {
                toast.error("Admin token not found. Please login again.");
                return;
            }

            try {
                const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
                    headers: { Authorization: `Bearer ${aToken}` }
                });
                
                if (data.success) {
                    setDoctors(data.doctors);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error("Failed to load doctors.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
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
                <h1 className='text-3xl font-bold text-gray-800'>Doctors List</h1>
                <span className="text-gray-500">Total: {doctors.length}</span>
            </div>
            
            <div className='bg-white rounded-lg shadow-md border overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Doctor
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Speciality
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Profile
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {doctors.length > 0 ? (
                                doctors.map((doctor) => (
                                    <tr key={doctor._id} className='hover:bg-gray-50'>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <div className='flex-shrink-0 h-10 w-10'>
                                                    {doctor.image ? (
                                                        <img 
                                                            className='h-10 w-10 rounded-full object-cover' 
                                                            src={doctor.image} 
                                                            alt={doctor.name} 
                                                        />
                                                    ) : (
                                                        <div className='h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center'>
                                                            <span className='text-teal-600 font-semibold text-sm'>
                                                                {doctor.name?.charAt(0) || 'D'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='ml-4'>
                                                    <div className='text-sm font-medium text-gray-900'>
                                                        {doctor.name}
                                                    </div>
                                                    <div className='text-sm text-gray-500'>
                                                        {doctor.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                            {doctor.speciality || 'Not specified'}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                doctor.available 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {doctor.available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                            {doctor.profileStatus || 'incomplete'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No doctors found
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

export default DoctorsList;
