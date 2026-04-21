import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import axiosInstance from '../../utils/axios';
import { API_PATH } from '../../utils/apiPath';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


export default function Header() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(API_PATH.USER.GET_USER);
        setUserData(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚽</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Courtify</h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 px-3 py-2 hover:bg-green-50 rounded-lg transition-all duration-200">
                  {/* User Avatar */}
                  <div className="w-9 h-9 bg-linear-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shrink-0 overflow-hidden border-2 border-white shadow-md">
                    {userData?.img_url ? (
                      <img
                        src={userData.img_url}
                        alt={userData.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {userData?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>

                  {/* User Name */}
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900">
                      {userData?.username || 'User'}
                    </span>
                    <span className="text-xs text-gray-500">Profile</span>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 bg-white border border-green-100 rounded-lg shadow-xl">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-green-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {userData?.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userData?.email || 'No email'}
                  </p>
                </div>

                {/* Profile Link */}
                <Link to="/profile">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-green-50">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Edit Profile</span>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator className="bg-green-100" />

                {/* Logout */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
      </div>
    </header>
  );
}
