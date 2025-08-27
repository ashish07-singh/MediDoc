import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [state, setState] = useState('Doctor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            if (state === 'Admin') {
                // Admin login logic
                const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
                if (data.success) {
                    // Store admin token
                    localStorage.setItem('aToken', data.token);
                    toast.success("Admin login successful!");
                    // Redirect to local admin dashboard
                    window.location.href = '/admin/dashboard';
                } else {
                    toast.error(data.message);
                }
            } else { // Doctor Login
                const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
                if (data.success) {
                    // Store doctor token
                    localStorage.setItem('dToken', data.token);
                    toast.success("Doctor login successful!");

                    // Check the profileStatus received from the backend.
                    if (data.profileStatus === 'incomplete') {
                        // If the profile is incomplete, redirect to the profile page.
                        toast.info("Please complete your profile to activate your account.");
                        window.location.href = '/admin/doctor/profile';
                    } else {
                        // Otherwise, redirect to the dashboard as usual.
                        window.location.href = '/admin/doctor/dashboard';
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="text-center">
                    <div className="mb-4">
                        <a 
                            href="/" 
                            className="text-teal-600 hover:text-teal-500 text-sm underline"
                        >
                            ← Back to main site
                        </a>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        <span className="text-teal-600">{state}</span> Login
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Access your {state.toLowerCase()} dashboard
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={onSubmitHandler}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setState(state === 'Admin' ? 'Doctor' : 'Admin')}
                            className="text-teal-600 hover:text-teal-500 text-sm underline cursor-pointer"
                        >
                            {state === 'Admin' 
                                ? 'Are you a Doctor? Login here' 
                                : 'Are you an Admin? Login here'
                            }
                        </button>
                        
                        {state === 'Doctor' && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <a 
                                        href="/doctor-signup" 
                                        className="text-teal-600 hover:text-teal-500 font-semibold underline cursor-pointer"
                                    >
                                        Sign up here
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
