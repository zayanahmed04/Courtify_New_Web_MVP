import { useEffect, useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Heart, Trophy, Sparkles } from "lucide-react";
import Header from "../components/User/Header.jsx";
import axiosInstance from "../utils/axios.js";
import { API_PATH } from './../utils/apiPath';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("/user/dashboard/search");
  const location = useLocation();

  // Sync active tab with URL
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  // Fire the API call directly
  useEffect(() => {
    axiosInstance
      .get(API_PATH.COURT.APPROVED_COURTS, { withCredentials: true })
      .then((response) => console.log("API response:", response.data))
      .catch((err) => console.error("API error:", err));
  }, []);

  const tabs = [
    { 
      id: "search", 
      label: "Search Courts", 
      icon: <Search className="w-5 h-5" />, 
      path: "/user/dashboard/search",
      color: "from-green-500 to-emerald-500"
    },
    { 
      id: "matches", 
      label: "Upcoming Matches", 
      icon: <Trophy className="w-5 h-5" />, 
      path: "/user/dashboard/matches",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      id: "bookings", 
      label: "My Bookings", 
      icon: <Calendar className="w-5 h-5" />, 
      path: "/user/dashboard/bookings",
      color: "from-purple-500 to-pink-500"
    },
    { 
      id: "favorites", 
      label: "Favorite Courts", 
      icon: <Heart className="w-5 h-5" />, 
      path: "/user/dashboard/favorites",
      color: "from-red-500 to-rose-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-96 h-96 bg-green-300 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl"
      />

      <Header />

      {/* Enhanced Tab Navigation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-16 z-40 backdrop-blur-xl bg-white/80 border-b border-green-200 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.path;
              
              return (
                <Link key={tab.id} to={tab.path}>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <motion.div
                      className={`px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-3 ${
                        isActive
                          ? "bg-gradient-to-r text-white shadow-lg"
                          : "bg-white/50 text-gray-600 hover:bg-white/80 hover:text-gray-900"
                      }`}
                      style={
                        isActive
                          ? { backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }
                          : {}
                      }
                    >
                      {/* Icon with animation */}
                      <motion.div
                        animate={isActive ? { rotate: [0, -10, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {tab.icon}
                      </motion.div>
                      
                      <span>{tab.label}</span>

                      {/* Active indicator sparkle */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{ scale: 1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Bottom active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r ${tab.color}`}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}

                    {/* Hover glow effect */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(16, 185, 129, 0.3)",
                            "0 0 30px rgba(16, 185, 129, 0.5)",
                            "0 0 20px rgba(16, 185, 129, 0.3)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Decorative gradient line */}
        <motion.div
          className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </motion.div>

      {/* Main Content with Animation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating decorative elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-10 right-10 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 blur-xl pointer-events-none"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-1/3 left-10 w-16 h-16 bg-gradient-to-br from-teal-400 to-green-500 rounded-full opacity-20 blur-xl pointer-events-none"
      />
    </div>
  );
}