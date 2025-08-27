import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('aToken');
        localStorage.removeItem('dToken');
        navigate('/admin-login');
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
        { id: 'doctors', label: 'Doctors', path: '/admin/doctors' },
        { id: 'consultations', label: 'Consultations', path: '/admin/consultations' },
    ];

    const handleTabClick = (tabId, path) => {
        setActiveTab(tabId);
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="text-gray-600 hover:text-gray-900 text-sm"
                            >
                                ← Back to Site
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id, tab.path)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-teal-500 text-teal-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
