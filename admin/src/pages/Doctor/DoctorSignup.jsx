import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DoctorSignup = () => {
    const [stage, setStage] = useState('Signup');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        speciality: '',
        degree: '',
        experience: '',
        about: ''
    });
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/register/request-otp`, formData);
            if (data.success) {
                toast.success(data.message);
                setStage('Verify OTP');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/register/verify-otp`, {
                email: formData.email,
                otp: otp
            });
            if (data.success) {
                toast.success("Registration successful! Please login to continue.");
                navigate('/doctor/login');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'OTP verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-[80vh] flex items-center justify-center bg-gray-50 p-4'>
            <div className='flex flex-col gap-5 m-auto items-start p-8 min-w-[340px] sm:min-w-[500px] border bg-white rounded-xl text-gray-700 shadow-lg'>
                <h1 className='text-3xl font-bold m-auto text-gray-800'>Doctor <span className='text-teal-600'>Signup</span></h1>
                
                {stage === 'Signup' ? (
                    <form onSubmit={handleSubmit} className='w-full space-y-4'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input 
                                    name="name" 
                                    onChange={handleInputChange} 
                                    value={formData.name} 
                                    className='border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-teal-500' 
                                    type="text" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input 
                                    name="email" 
                                    onChange={handleInputChange} 
                                    value={formData.email} 
                                    className='border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-teal-500' 
                                    type="email" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <div className="relative">
                                <input 
                                    name="password" 
                                    onChange={handleInputChange} 
                                    value={formData.password} 
                                    className='border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-teal-500 pr-12' 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <label className="block text-sm font-medium mb-1">Speciality</label>
                                <input 
                                    name="speciality" 
                                    onChange={handleInputChange} 
                                    value={formData.speciality} 
                                    className='border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-teal-500' 
                                    type="text" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Degree</label>
                                <input 
                                    name="degree" 
                                    onChange={handleInputChange} 
                                    value={formData.degree} 
                                    className='border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-teal-500' 
                                    type="text" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                                <input 
                                    name="experience" 
                                    onChange={handleInputChange} 
                                    value={formData.experience} 
                                    className='border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-teal-500' 
                                    type="text" 
                                    required 
                                />
                            </div>
                            <div className='sm:col-span-2'>
                                <label className="block text-sm font-medium mb-1">About</label>
                                <textarea 
                                    name="about" 
                                    onChange={handleInputChange} 
                                    value={formData.about} 
                                    className='border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-teal-500' 
                                    rows="3"
                                    required 
                                />
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className='bg-teal-600 text-white w-full py-2.5 rounded-lg text-base font-semibold hover:bg-teal-700 transition disabled:bg-teal-400'
                        >
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                        
                        <p className="text-center w-full text-sm">
                            Already have an account? <span onClick={() => navigate('/doctor/login')} className='text-teal-600 font-semibold underline cursor-pointer'>Login here</span>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerifySubmit} className='w-full space-y-4'>
                        <div>
                            <label className="block text-sm font-medium mb-1">Enter OTP</label>
                            <input 
                                onChange={(e) => setOtp(e.target.value)} 
                                value={otp} 
                                className='border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-teal-500' 
                                type="text" 
                                placeholder="Enter the OTP sent to your email"
                                required 
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className='bg-green-600 text-white w-full py-2.5 rounded-lg text-base font-semibold hover:bg-green-700 transition disabled:bg-green-400'
                        >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        
                        <p className="text-center w-full text-sm">
                            Didn't receive OTP? <span onClick={() => setStage('Signup')} className='text-teal-600 font-semibold underline cursor-pointer'>Go back</span>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DoctorSignup;