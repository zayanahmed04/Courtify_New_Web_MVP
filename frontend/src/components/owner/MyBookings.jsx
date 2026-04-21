"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { API_PATH } from "@/utils/apiPath";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { Calendar, Clock, User, CheckCircle2, XCircle } from "lucide-react";

/**
 * MyBookings (Owner view)
 * - Fetch bookings for owner's courts
 * - Approve bookings
 * - Reject bookings (with reason)
 * - Nice UI + modal for rejection reason
 */

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [rejectReason, setRejectReason] = useState("");
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // --------------------------------
  // 1) GET BOOKINGS FROM BACKEND
  // --------------------------------
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATH.BOOKINGS.OWNER_COURT_BOOKINGS, {
        withCredentials: true,
      });
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // --------------------------------
  // 2) APPROVE BOOKING
  // --------------------------------
  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      await axiosInstance.put(API_PATH.BOOKINGS.APPROVE_BOOKING(id), {}, { withCredentials: true });

      // UI Update
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, booking_status: "approved" } : b))
      );
    } catch (error) {
      console.error("Approve Error:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // --------------------------------
  // 3) OPEN REJECT MODAL
  // --------------------------------
  const openReject = (id) => {
    setSelectedBookingId(id);
    setRejectReason("");
    setOpenRejectModal(true);
  };

  // --------------------------------
  // 4) REJECT BOOKING (with reason)
  // --------------------------------
  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) return;

    try {
      setProcessingId(selectedBookingId);
      await axiosInstance.put(
        API_PATH.BOOKINGS.REJECT_BOOKING(selectedBookingId),
        { cancellation_reason: rejectReason },
        { withCredentials: true }
      );

      // UI Update
      setBookings((prev) =>
        prev.map((b) => (b.id === selectedBookingId ? { ...b, booking_status: "rejected" } : b))
      );

      setOpenRejectModal(false);
      setSelectedBookingId(null);
      setRejectReason("");
    } catch (error) {
      console.error("Reject Error:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // --------------------------------
  // 5) Badge color based on status
  // --------------------------------
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-700 border-gray-200";

    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Stats calculation
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.booking_status?.toLowerCase() === "pending").length,
    approved: bookings.filter((b) => b.booking_status?.toLowerCase() === "approved").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-3xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 drop-shadow-md">My Bookings</h1>
              <p className="text-emerald-100 text-lg">Manage and monitor your court reservations</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30">
              <div className="text-center">
                <p className="text-emerald-100 text-sm font-medium">Total Bookings</p>
                <p className="text-5xl font-bold mt-1">{stats.total}</p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="bg-amber-400/30 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-100" />
                </div>
                <div>
                  <p className="text-emerald-100 text-sm">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="bg-green-400/30 p-3 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-100" />
                </div>
                <div>
                  <p className="text-emerald-100 text-sm">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table Card */}
        <Card className="shadow-xl border-0 overflow-hidden rounded-3xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
            <CardTitle className="text-2xl text-emerald-900">Booking Requests</CardTitle>
            <CardDescription className="text-emerald-600">
              Recent reservations for your sports facilities
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-12 h-12 text-emerald-400" />
                </div>
                <p className="text-gray-500 text-lg">No bookings yet</p>
                <p className="text-gray-400 text-sm mt-2">When customers book your courts, they'll appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-emerald-100">
                      <th className="text-left py-4 px-4 font-semibold text-emerald-900">Court</th>
                      <th className="text-left py-4 px-4 font-semibold text-emerald-900">Customer</th>
                      <th className="text-left py-4 px-4 font-semibold text-emerald-900">Date</th>
                      <th className="text-left py-4 px-4 font-semibold text-emerald-900">Time Slot</th>
                      <th className="text-left py-4 px-4 font-semibold text-emerald-900">Status</th>
                      <th className="text-left py-4 px-4 font-semibold text-emerald-900">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-300 group"
                      >
                        <td className="py-5 px-4">
                          <div className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {booking.court?.name || "-"}
                          </div>
                        </td>

                        <td className="py-5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-emerald-400 to-teal-400 w-8 h-8 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-gray-700">{booking.user?.name || booking.user?.username || "-"}</span>
                          </div>
                        </td>

                        <td className="py-5 px-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            {booking.booking_date || booking.date || "-"}
                          </div>
                        </td>

                        <td className="py-5 px-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-emerald-500" />
                            {`${booking.start_time || booking.time || "-"}${booking.end_time ? ` - ${booking.end_time}` : ""}`}
                          </div>
                        </td>

                        <td className="py-5 px-4">
                          <Badge className={`${getStatusColor(booking.booking_status)} border font-medium px-3 py-1`}>
                            {booking.booking_status ? booking.booking_status.toLowerCase() : "unknown"}
                          </Badge>
                        </td>

                        <td className="py-5 px-4">
                          <div className="flex gap-2">
                            {booking.booking_status?.toLowerCase() === "pending" ? (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300 border-0"
                                  onClick={() => handleApprove(booking.id)}
                                  disabled={processingId === booking.id}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  {processingId === booking.id ? "Approving..." : "Approve"}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                                  onClick={() => openReject(booking.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <span className="text-gray-400 text-sm italic px-2">No action required</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reject Modal */}
        <Dialog open={openRejectModal} onOpenChange={setOpenRejectModal}>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-gray-900 flex items-center gap-2">
                <div className="bg-red-100 p-2 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                Reject Booking
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ This action will notify the customer about the rejection
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Reason for rejection *</label>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a clear reason for rejecting this booking..."
                  className="min-h-[120px] resize-none border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setOpenRejectModal(false)} className="rounded-xl border-gray-200 hover:bg-gray-50">
                Cancel
              </Button>

              <Button
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim() || processingId === selectedBookingId}
              >
                <XCircle className="w-4 h-4 mr-2" />
                {processingId === selectedBookingId ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
