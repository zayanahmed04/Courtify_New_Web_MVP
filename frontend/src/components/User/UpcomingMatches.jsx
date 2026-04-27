"use client";

import { useState, useEffect } from "react";
import { MatchCard } from "./MatchCard";
import { MatchForm } from "./MatchForm";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Trophy, Users, Sparkles, X, AlertTriangle } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { API_PATH } from "@/utils/apiPath";
import { toast } from "react-toastify";

// ------------------------------------
// Enhanced Confirm Modal
// ------------------------------------
function ConfirmModal({ open, onClose, onConfirm, message }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 relative">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </motion.button>
            <AlertTriangle className="w-12 h-12 mb-3" />
            <h2 className="text-2xl font-bold">Confirm Deletion</h2>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <p className="text-gray-700 text-lg">{message || "Are you sure?"}</p>
            
            <div className="flex gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-xl font-bold hover:from-red-700 hover:to-rose-700 transition-all shadow-lg"
              >
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ------------------------------------
// UpcomingMatches Component
// ------------------------------------
const SPORT_ICONS = {
  Football: "⚽",
  Tennis: "🎾",
  Cricket: "🏏",
  Basketball: "🏀",
  Badminton: "🏸",
  Volleyball: "🏐",
  Swimming: "🏊",
  Running: "🏃",
};

export default function UpcomingMatches() {
  const [matches, setMatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);

  // Current user
  const [currentUserId, setCurrentUserId] = useState(null);

  // ------------------------------------
  // Fetch current user
  // ------------------------------------
  const fetchCurrentUser = async () => {
    try {
      const res = await axiosInstance.get("/users/current", { withCredentials: true });
      setCurrentUserId(res.data.user.id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to get current user");
    }
  };

  // ------------------------------------
  // Fetch matches
  // ------------------------------------
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATH.MatchMaking.GET_MATCHES, { withCredentials: true });
      setMatches(res.data.matches || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch matches");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchMatches();
  }, []);

  // ------------------------------------
  // Add new match
  // ------------------------------------
  const handleAddMatch = async (matchData) => {
    try {
      const res = await axiosInstance.post(API_PATH.MatchMaking.CREATE_MATCH, matchData, {
        withCredentials: true,
      });
      toast.success("🎉 Match created successfully!");
      setMatches((prev) => [
        ...prev,
        { id: res.data.match_id, ...matchData, user_id: currentUserId },
      ]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create match");
    }
  };

  // ------------------------------------
  // Open modal before deletion
  // ------------------------------------
  const confirmDeleteMatch = (id) => {
    setMatchToDelete(id);
    setModalOpen(true);
  };

  // ------------------------------------
  // Delete match after confirming
  // ------------------------------------
  const handleDeleteMatch = async () => {
    if (!matchToDelete) return;

    try {
      const res = await axiosInstance.delete(
        API_PATH.MatchMaking.DELETE_MATCH(matchToDelete),
        { withCredentials: true }
      );
      toast.success("Match deleted successfully");
      setMatches((prev) => prev.filter((m) => m.id !== matchToDelete));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to delete match");
    } finally {
      setModalOpen(false);
      setMatchToDelete(null);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div className="space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full"
              >
                <Trophy className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">
                  Find Your Next Game
                </span>
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Community Matches
              </h1>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5" />
                <p className="text-lg">
                  Connect with {matches.length} local sports enthusiasts
                </p>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
              >
                <motion.div
                  animate={showForm ? { rotate: 45 } : { rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="w-6 h-6" />
                </motion.div>
                <span>{showForm ? "Close Form" : "Post a Match"}</span>
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Form Section with Animation */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto mb-12"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-2 border-purple-200"
              >
                <MatchForm
                  onSubmit={handleAddMatch}
                  onCancel={() => setShowForm(false)}
                  sports={Object.keys(SPORT_ICONS)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Matches Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
              />
              <p className="text-xl font-semibold text-gray-600">Loading matches...</p>
            </motion.div>
          ) : matches.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {matches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="relative group"
                  >
                    <MatchCard match={match} />
                    
                    {/* Delete Button with Animation */}
                    {match.user_id === currentUserId && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => confirmDeleteMatch(match.id)}
                        className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-rose-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-10 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    )}

                    {/* Glow Effect on Hover */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{
                        boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-8"
              >
                <Trophy className="w-24 h-24 mx-auto text-gray-300" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No Matches Yet
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Be the first to post a match and start the community!
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Post First Match
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Confirm Delete Modal */}
        <ConfirmModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDeleteMatch}
          message="Are you sure you want to delete this match? This action cannot be undone."
        />
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-30 blur-xl pointer-events-none"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-1/4 left-10 w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-30 blur-xl pointer-events-none"
      />
    </div>
  );
}