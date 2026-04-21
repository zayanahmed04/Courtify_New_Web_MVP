import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Zap,
  Award,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axios";
import { API_PATH } from "@/utils/apiPath";
import { toast } from "react-toastify";

export default function CourtCard({
  court,
  isFav = false,
  onAddFavourite,
  onRemoveFavourite,
}) {
  const canBook = !court.maintenance;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(
    court.average_rating || 0
  );
  const [reviewsCount, setReviewsCount] = useState(
    court.reviews?.length || 0
  );
  const [isHovered, setIsHovered] = useState(false);
  const [showRatingTooltip, setShowRatingTooltip] = useState(false);

  // Fetch current user's rating
  const fetchMyRating = async () => {
    try {
      const res = await axiosInstance.get(
        API_PATH.REVIEWS.MY_REVIEWS,
        { withCredentials: true }
      );
      const myCourtReview = res.data.reviews.find(
        (r) => r.court_id === court.id
      );
      if (myCourtReview?.rating) setRating(myCourtReview.rating);
    } catch (err) {
      console.log("Error fetching user rating:", err);
    }
  };

  // Fetch updated average rating
  const fetchAverageRating = async () => {
    try {
      const res = await axiosInstance.get(
        API_PATH.REVIEWS.BY_COURT(court.id),
        { withCredentials: true }
      );
      setAverageRating(res.data.average_rating || 0);
      setReviewsCount(res.data.reviews?.length || 0);
    } catch (err) {
      console.log("Error fetching average rating:", err);
    }
  };

  useEffect(() => {
    fetchMyRating();
    fetchAverageRating();
  }, []);

  const handleRate = async (rate) => {
    try {
      setLoading(true);
      await axiosInstance.post(
        API_PATH.REVIEWS.GIVE_RATING,
        { court_id: court.id, rating: rate },
        { withCredentials: true }
      );

      setRating(rate);
      toast.success(`You rated ${court.name} ${rate} ⭐`);
      fetchAverageRating();
    } catch (err) {
      toast.error("Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  const handleFavouriteClick = () => {
    if (isFav) {
      onRemoveFavourite?.();
      toast.info("Removed from favorites");
    } else {
      onAddFavourite?.();
      toast.success("Added to favorites ❤️");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative group"
    >
      {/* Image */}
      <div className="relative h-56 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
        <motion.img
          src={court.image_url || "/placeholder.svg"}
          alt={court.name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Maintenance Badge */}
        <AnimatePresence>
          {court.maintenance && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
            >
              <Zap className="w-3 h-3" />
              Maintenance
            </motion.div>
          )}
        </AnimatePresence>

        {/* Favourite Button */}
        <motion.button
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavouriteClick}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isFav ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </motion.button>

        {/* Price */}
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: isHovered ? 0 : -100 }}
          className="absolute bottom-4 left-0 bg-green-600 text-white px-4 py-2 rounded-r-full shadow-lg flex items-center gap-2"
        >
          <DollarSign className="w-4 h-4" />
          <span className="font-bold text-lg">Rs {court.hourly_rate}</span>
          <span className="text-xs opacity-80">/hour</span>
        </motion.div>

        {/* Average Rating */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: isHovered ? 0 : -100 }}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-sm">{averageRating.toFixed(1)}</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <motion.h3 className="font-bold text-gray-900 text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          {court.name}
        </motion.h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <MapPin className="w-4 h-4 text-green-500" />
          <span>{court.location || "Location not available"}</span>
        </div>

        {/* Description */}
        {court.description && (
          <p className="text-gray-500 text-sm line-clamp-2">{court.description}</p>
        )}

        {/* Rating (User Interaction) */}
        <div className="relative">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div key={star} whileHover={{ scale: 1.3, rotate: 15 }}>
                <Star
                  className={`w-5 h-5 cursor-pointer ${
                    (hoverRating || rating) >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => {
                    setHoverRating(star);
                    setShowRatingTooltip(true);
                  }}
                  onMouseLeave={() => {
                    setHoverRating(0);
                    setShowRatingTooltip(false);
                  }}
                  onClick={() => handleRate(star)}
                />
              </motion.div>
            ))}

            {loading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full ml-2"
              />
            )}
          </div>

          {/* Tooltip */}
          <AnimatePresence>
            {showRatingTooltip && hoverRating > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded"
              >
                Rate {hoverRating} star{hoverRating > 1 ? "s" : ""}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Average Rating Display */}
        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
          <Award className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-semibold">{averageRating.toFixed(1)}</span>
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-gray-500">
            ({reviewsCount} reviews)
          </span>
        </div>

        {/* Hours */}
        <div className="flex justify-between text-sm text-slate-500 mt-1">
          <span>Open: {court.opening_time || "-"}</span>
          <span>Close: {court.closing_time || "-"}</span>
        </div>

        {/* Button */}
        <motion.div whileHover={{ scale: canBook ? 1.02 : 1 }}>
          <Link to={canBook ? `/courts/${court.id}` : "#"}>
            <button
              disabled={!canBook}
              className={`w-full py-3 rounded-xl font-bold ${
                canBook
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {canBook ? "Book Now" : "Under Maintenance"}
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
