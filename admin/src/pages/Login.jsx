import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [state, setState] = useState('Doctor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    
    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const { handleDoctorLogin } = useContext(DoctorContext);
    const { handleAdminLogin } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            if (state === 'Admin') {
                // Admin login logic remains the same
                const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
                if (data.success) {
                    handleAdminLogin(data.token);
                    toast.success("Admin login successful!");
                    navigate('/admin/dashboard');
                } else {
                    toast.error(data.message);
                }
            } else { // Doctor Login
                
                // --- THIS IS THE SECTION TO CHANGE ---
                
                console.log('Attempting doctor login with:', { email, passwordLength: password?.length });
                console.log('Backend URL:', backendUrl);
                
                const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
                console.log('Login response:', data);
                
                if (data.success) {
                    handleDoctorLogin(data.token);
                    toast.success("Doctor login successful!");

                    // Check the profileStatus received from the backend.
                    if (data.profileStatus === 'incomplete') {
                        // If the profile is incomplete, redirect to the profile page.
                        toast.info("Please complete your profile to activate your account.");
                        navigate('/doctor/profile');
                    } else {
                        // Otherwise, redirect to the dashboard as usual.
                        navigate('/doctor/dashboard');
                    }
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const endpoint = state === 'Admin' ? 'admin' : 'doctor';
            const { data } = await axios.post(`${backendUrl}/api/${endpoint}/forgot-password`, { email });
            if (data.success) {
                toast.success(data.message);
                setShowForgotPassword(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset email.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const endpoint = state === 'Admin' ? 'admin' : 'doctor';
            const { data } = await axios.post(`${backendUrl}/api/${endpoint}/reset-password`, { email, otp, password: newPassword });
            if (data.success) {
                toast.success("Password reset successful! Please login with your new password.");
                setShowForgotPassword(false);
                setOtp('');
                setNewPassword('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password reset failed.');
        } finally {
            setIsLoading(false);
        }
    };

    if (showForgotPassword) {
        return (
            <div className='min-h-[80vh] flex items-center justify-center bg-gray-50'>
                <div className='flex flex-col gap-5 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border bg-white rounded-xl text-gray-700 shadow-lg'>
                    <h1 className='text-3xl font-bold m-auto text-gray-800'>Reset <span className='text-teal-600'>Password</span></h1>
                    <p className="text-gray-500 text-center w-full">Enter the reset code sent to <strong>{email}</strong> and your new password.</p>
                    
                    <form onSubmit={handleResetPassword} className='w-full space-y-4'>
                        <div>
                            <label className="block text-sm font-medium mb-1">Reset Code</label>
                            <input 
                                onChange={(e) => setOtp(e.target.value)} 
                                value={otp} 
                                className='border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-teal-500' 
                                type="text" 
                                placeholder="Enter the reset code"
                                required 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">New Password</label>
                            <div className="relative">
                                <input 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    value={newPassword} 
                                    className='border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-teal-500 pr-12' 
                                    type={showNewPassword ? "text" : "password"} 
                                    required 
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showNewPassword ? (
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
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className='bg-green-600 text-white w-full py-2.5 rounded-lg text-base font-semibold hover:bg-green-700 transition disabled:bg-green-400'
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                        
                        <p className="text-center w-full text-sm">
                            <span onClick={() => setShowForgotPassword(false)} className='text-teal-600 font-semibold underline cursor-pointer'>Back to Login</span>
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center bg-gray-50'>
            <div className='flex flex-col gap-5 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border bg-white rounded-xl text-gray-700 shadow-lg'>
                <h1 className='text-3xl font-bold m-auto text-gray-800'><span className='text-teal-600'>{state}</span> Login</h1>
                <div className='w-full'>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-gray-300 rounded-lg w-full p-2.5 mt-1 focus:ring-2 focus:ring-teal-500' type="email" required />
                </div>
                <div className='w-full'>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                        <input 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            className='border border-gray-300 rounded-lg w-full p-2.5 mt-1 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-12' 
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
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className='bg-teal-600 text-white w-full py-2.5 rounded-lg text-base font-semibold hover:bg-teal-700 transition disabled:bg-teal-400'
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                
                <div className="flex justify-between items-center text-sm w-full">
                    <span onClick={() => setShowForgotPassword(true)} className='text-teal-600 font-semibold underline cursor-pointer'>Forgot Password?</span>
                    {state === 'Admin' ? (
                        <span onClick={() => setState('Doctor')} className='text-teal-600 font-semibold underline cursor-pointer'>Doctor Login</span>
                    ) : (
                        <>
                            <Link to="/doctor/signup" className='text-teal-600 font-semibold underline cursor-pointer'>Sign Up</Link>
                            <span onClick={() => setState('Admin')} className='text-teal-600 font-semibold underline cursor-pointer'>Admin Login</span>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
};

export default Login;