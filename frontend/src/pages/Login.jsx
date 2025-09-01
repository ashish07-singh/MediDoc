import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Spinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const Login = () => {
    // --- FIX #1: Change 'state' to 'stage' to manage three views ---
    const [stage, setStage] = useState('Login'); // Can be 'Login', 'Sign Up', 'Verify OTP', 'Forgot Password'
    
    // --- Form states ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(''); // New state for OTP input
    const [loading, setLoading] = useState(false);
    
    // --- Password visibility states ---
    const [showPassword, setShowPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);

    const navigate = useNavigate();
    const { backendUrl, token, handleLogin } = useContext(AppContext);

    // --- FIX #2: Create separate handlers for each action ---

    // Handler for Login
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
            if (data.success) {
                handleLogin(data.token);
                toast.success(`Welcome back!`);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    // Handler for Requesting OTP
    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/register/request-otp`, { name, email, password });
            if (data.success) {
                toast.success(data.message);
                setStage('Verify OTP'); // Move to the next stage
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    // Handler for Verifying OTP
    const handleVerifySubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/register/verify-otp`, { email, otp });
            if (data.success) {
                toast.success("Registration successful! Please log in.");
                setStage('Login'); // Take user back to the login screen
                // Clear password and OTP fields for security/UX
                setPassword('');
                setOtp('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'OTP verification failed.');
        } finally {
            setLoading(false);
        }
    };

    // Handler for Forgot Password
    const handleForgotPassword = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
            if (data.success) {
                toast.success(data.message);
                setStage('Reset Password');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    };

    // Handler for Reset Password
    const handleResetPassword = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, { email, otp, password });
            if (data.success) {
                toast.success("Password reset successful! Please login with your new password.");
                setStage('Login');
                setPassword('');
                setOtp('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password reset failed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">
                <div className="p-8 md:p-12">

                    {/* --- FIX #3: Conditionally render the correct form based on the stage --- */}

                    {/* LOGIN FORM */}
                    {stage === 'Login' && (
                        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
                            <h1 className="text-3xl font-bold text-gray-800">Login</h1>
                            <p className="text-gray-500">Welcome back! Please login to your account.</p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                                <input id="email" onChange={(e) => setEmail(e.target.value)} value={email} className="w-full px-4 py-2 bg-gray-100 border rounded-lg" type="email" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                                <div className="relative">
                                    <input 
                                        id="password" 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        value={password} 
                                        className="w-full px-4 py-2 pr-12 bg-gray-100 border rounded-lg" 
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
                            <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3 my-2 rounded-lg font-semibold flex items-center justify-center disabled:bg-teal-400">
                                {loading ? <Spinner /> : 'Login'}
                            </button>
                            <div className="flex justify-between items-center text-sm">
                                <span onClick={() => setStage('Forgot Password')} className="text-teal-600 font-semibold underline cursor-pointer">Forgot Password?</span>
                                <span onClick={() => setStage('Sign Up')} className="text-teal-600 font-semibold underline cursor-pointer">Sign up</span>
                            </div>
                        </form>
                    )}

                    {/* SIGN UP FORM */}
                    {stage === 'Sign Up' && (
                        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
                            <h1 className="text-3xl font-bold text-gray-800">Sign Up</h1>
                            <p className="text-gray-500">Create an account to get started.</p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Full Name</label>
                                <input id="name" onChange={(e) => setName(e.target.value)} value={name} className="w-full px-4 py-2 bg-gray-100 border rounded-lg" type="text" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                                <input id="email" onChange={(e) => setEmail(e.target.value)} value={email} className="w-full px-4 py-2 bg-gray-100 border rounded-lg" type="email" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                                <div className="relative">
                                    <input 
                                        id="password" 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        value={password} 
                                        className="w-full px-4 py-2 pr-12 bg-gray-100 border rounded-lg" 
                                        type={showSignupPassword ? "text" : "password"} 
                                        required 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showSignupPassword ? (
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
                            <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3 my-2 rounded-lg font-semibold flex items-center justify-center disabled:bg-teal-400">
                                {loading ? <Spinner /> : 'Create Account'}
                            </button>
                            <p className="text-center text-sm text-gray-600">
                                Already have an account? <span onClick={() => setStage('Login')} className="text-teal-600 font-semibold underline cursor-pointer">Login here</span>
                            </p>
                        </form>
                    )}

                    {/* VERIFY OTP FORM */}
                    {stage === 'Verify OTP' && (
                        <form onSubmit={handleVerifySubmit} className="flex flex-col gap-5">
                            <h1 className="text-3xl font-bold text-gray-800">Verify Your Email</h1>
                            <p className="text-gray-500">An OTP has been sent to <strong>{email}</strong>. Please enter it below to complete your registration.</p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="otp">Enter OTP</label>
                                <input id="otp" onChange={(e) => setOtp(e.target.value)} value={otp} className="w-full px-4 py-2 bg-gray-100 border rounded-lg" type="text" required />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 my-2 rounded-lg font-semibold flex items-center justify-center disabled:bg-green-400">
                                {loading ? <Spinner /> : 'Verify & Complete'}
                            </button>
                        </form>
                    )}

                    {/* FORGOT PASSWORD FORM */}
                    {stage === 'Forgot Password' && (
                        <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
                            <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
                            <p className="text-gray-500">Enter your email address and we'll send you a reset code.</p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email Address</label>
                                <input id="email" onChange={(e) => setEmail(e.target.value)} value={email} className="w-full px-4 py-2 bg-gray-100 border rounded-lg" type="email" required />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3 my-2 rounded-lg font-semibold flex items-center justify-center disabled:bg-teal-400">
                                {loading ? <Spinner /> : 'Send Reset Code'}
                            </button>
                            <p className="text-center text-sm text-gray-600">
                                Remember your password? <span onClick={() => setStage('Login')} className="text-teal-600 font-semibold underline cursor-pointer">Login here</span>
                            </p>
                        </form>
                    )}

                    {/* RESET PASSWORD FORM */}
                    {stage === 'Reset Password' && (
                        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
                            <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
                            <p className="text-gray-500">Enter the reset code sent to <strong>{email}</strong> and your new password.</p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="otp">Reset Code</label>
                                <input id="otp" onChange={(e) => setOtp(e.target.value)} value={otp} className="w-full px-4 py-2 bg-gray-100 border rounded-lg" type="text" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">New Password</label>
                                <div className="relative">
                                    <input 
                                        id="password" 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        value={password} 
                                        className="w-full px-4 py-2 pr-12 bg-gray-100 border rounded-lg" 
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
                            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 my-2 rounded-lg font-semibold flex items-center justify-center disabled:bg-green-400">
                                {loading ? <Spinner /> : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
                <div className="hidden md:block">
                    <img src={assets.login_image} alt="Healthcare professional working" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
    );
};

export default Login;