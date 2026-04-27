import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  BarChart3,
  PlusCircle,
  Calendar,
  TrendingUp,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import axiosInstance from "../utils/axios";
import { API_PATH } from "../utils/apiPath";

export default function DashboardLayout() {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("/owner/dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setActiveTab(location.pathname);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(API_PATH.USER.GET_USER);
        console.log(response.data)
        setUserData(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const navItems = [
    { id: "courts", label: "My Courts", icon: BarChart3, path: "/owner/dashboard" },
    { id: "add-court", label: "Add Court", icon: PlusCircle, path: "/owner/dashboard/add-court" },
    { id: "bookings", label: "My Bookings", icon: Calendar, path: "/owner/dashboard/bookings" },
  ];

  // ⭐ GET ACTIVE ITEM ONCE (no repeated .find())

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-green-100 shadow-sm">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
              Courtify
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-md scale-105"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Profile + Mobile Menu */}
          <div className="flex items-center gap-2">

            {/* Desktop Profile Dropdown */}
            <div className="hidden sm:block relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Link to="/profile">
                  <Button className="flex items-center gap-2 px-2 py-1.5 border-2 border-green-200 hover:border-green-400 hover:bg-green-50 rounded-lg transition-all duration-200 bg-white">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden border-2 border-green-300">
                      <img
                        src={userData?.img_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || 'user'}`}
                        alt={userData?.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <span className="font-medium text-gray-700 text-sm">{userData?.username || 'Owner'}</span>
                  </Button>
                  </Link>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56 bg-white border border-green-100 rounded-lg shadow-xl overflow-hidden">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-green-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {userData?.username || 'Owner'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userData?.email || 'No email'}
                    </p>
                  </div>

                  <Link to="/profile">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 cursor-pointer">
                      <User className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700 text-sm">Edit Profile</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="border-green-100" />

                  <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-green-100 shadow-lg flex flex-col px-4 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-green-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Profile Section */}
            <div className="border-t border-green-100 mt-2 pt-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Edit Profile</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl mx-auto">


        <Outlet />
      </main>
    </div>
  );
}
