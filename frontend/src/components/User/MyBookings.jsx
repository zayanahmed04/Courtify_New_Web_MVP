"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { API_PATH } from "@/utils/apiPath";
import { checkUserRole } from "@/utils/auth";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Loader2,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  MapPin,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelData, setCancelData] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [processingPayment, setProcessingPayment] = useState(null);

  // check role
  useEffect(() => {
    checkUserRole("user", navigate, setLoading);
  }, [navigate]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get(API_PATH.BOOKINGS.GET_BOOKINGS_BY_USER, {
        withCredentials: true,
      });
      setBookings(res.data.bookings || []);
    } catch {
      toast.error("Could not load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePayAdvance = async (booking) => {
    try {
      setProcessingPayment(booking.id);

      const res = await axiosInstance.post(
        API_PATH.PAYMENTS.CREATE,
        {
          booking_id: booking.id,
          court_name: booking.court_name || booking.court?.name,
          amount: 500,
          currency: "PKR",
          payment_method: "card",
        },
        { withCredentials: true }
      );

      if (res.data.url) {
        toast.success("Redirecting to payment...");
        window.location.href = res.data.url;
      } else toast.error("Payment URL missing");
    } catch {
      toast.error("Payment failed");
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    try {
      await axiosInstance.put(
        API_PATH.BOOKINGS.CANCEL_BOOKING(cancelData.id),
        { cancellation_reason: cancelReason },
        { withCredentials: true }
      );
      toast.success("Booking cancelled");
      fetchBookings();
    } catch {
      toast.error("Failed to cancel booking");
    } finally {
      setCancelData(null);
      setCancelReason("");
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: <AlertCircle className="w-4 h-4" />,
        label: "Pending Approval",
      },
      approved: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: <Clock className="w-4 h-4" />,
        label: "Awaiting Payment",
      },
      confirmed: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: "Confirmed ✓",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: <XCircle className="w-4 h-4" />,
        label: "Cancelled",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: <XCircle className="w-4 h-4" />,
        label: "Rejected",
      },
      completed:{
        bg: "bg-green-100",
        text: "text-green-700",
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: "Completed ✓",

      }
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
        <p className="text-gray-600 mt-3">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-green-700">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No bookings yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence>
            {bookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.booking_status);

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white shadow-md rounded-2xl border overflow-hidden"
                >
                  {/* Status Banner */}
                  <div className={`${statusConfig.bg} px-6 py-3 flex items-center gap-2`}>
                    {statusConfig.icon}
                    <span className={`${statusConfig.text} font-semibold`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Court Name */}
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                      <MapPin className="w-6 h-6 text-green-600" />
                      {booking.court_name || booking.court?.name}
                    </h2>

                    {/* Date + Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-bold text-gray-900">{booking.booking_date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-xl">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="font-bold text-gray-900">
                            {booking.start_time} - {booking.end_time}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Box */}
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-700" />
                        <span className="font-bold text-gray-800">Payment</span>
                      </div>
                      <p className="flex justify-between text-sm">
                        <span>Total:</span>
                        <span className="font-semibold">
                          Rs {booking.total_amount || booking.amount}
                        </span>
                      </p>

                      {(booking.booking_status === "approved" ||
                        booking.booking_status === "confirmed") && (
                        <p className="flex justify-between text-sm mt-1">
                          <span>Remaining Cash:</span>
                          <span className="font-semibold text-orange-600">
                            Rs {booking.remaining_cash ?? 0}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {booking.booking_status === "approved" && (
                      <div className="flex gap-3 pt-2">
                        <button
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
                          onClick={() => handlePayAdvance(booking)}
                          disabled={processingPayment === booking.id}
                        >
                          {processingPayment === booking.id ? "Processing..." : "Pay Advance"}
                        </button>

                        <button
                          className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
                          onClick={() => setCancelData(booking)}
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                    
{booking.booking_status === "completed" && (
  <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-semibold">
    Thank you for playing! Book more now 🎉
  </div>
)}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setCancelData(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-2">Cancel Booking</h2>
              <p className="text-gray-600 mb-3">
                Provide a reason for cancelling this booking
              </p>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border p-2 rounded-lg h-24"
                placeholder="Cancellation reason..."
              />

              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 py-2 bg-gray-200 rounded-lg"
                  onClick={() => setCancelData(null)}
                >
                  Close
                </button>
                <button
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg"
                  onClick={handleConfirmCancel}
                >
                  Confirm Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;
