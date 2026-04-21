// --- BookingPage.jsx (Enhanced Interactive UI) ---

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SlotGrid } from "../components/User/SlotGrid.jsx";
import { PageHeader } from "../components/User/PageHeader.jsx";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axios.js";
import { API_PATH } from "@/utils/apiPath";
import { generateTimeSlots, getNext7Days, getDateLabel } from "../lib/dummydata.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Heart, MapPin, DollarSign, ArrowLeft, Calendar, CheckCircle2, Zap, Clock } from "lucide-react";

export default function BookingPage() {
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextDays = getNext7Days();
  const [selectedDate, setSelectedDate] = useState(nextDays[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(API_PATH.COURT.COURT_BY_ID(id), { withCredentials: true });
        setCourt(res.data.court);

        if (res.data.court) {
          setSlots(generateTimeSlots(res.data.court.opening_time, res.data.court.closing_time));
        }
      } catch (err) {
        console.error("Failed to fetch court details:", err);
        toast.error("Failed to load court details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourt();
  }, [id]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!court) return;
      try {
        const res = await axiosInstance.get(API_PATH.BOOKINGS.GET_BOOKINGS_BY_COURT(court.id), { withCredentials: true });
        const booked = res.data.bookings.map(b => ({
          date: b.booking_date,
          startTime: b.start_time,
          endTime: b.end_time,
        }));
        setBookedSlots(booked);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        toast.error("Failed to load bookings");
      }
    };
    fetchBookings();
  }, [court]);

  useEffect(() => {
    if (court && selectedDate) {
      setSlots(generateTimeSlots(court.opening_time, court.closing_time));
      setSelectedSlot(null);
    }
  }, [court, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-green-700">Loading court details...</p>
        </motion.div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-red-600 mb-4">Court not found</p>
          <Link to="/">
            <Button className="bg-green-600 hover:bg-green-700">Go Back Home</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
    toast.info(`Selected slot: ${slot.startTime} - ${slot.endTime}`);
  };

  const handleConfirmBooking = async () => {
    if (isSubmitting || !selectedSlot) return;
    setIsSubmitting(true);

    try {
      await axiosInstance.post(
        API_PATH.BOOKINGS.CREATE_BOOKING,
        {
          court_id: court.id,
          booking_date: selectedDate,
          start_time: selectedSlot.startTime,
          end_time: selectedSlot.endTime,
        },
        { withCredentials: true }
      );

      toast.success("🎉 Booking created Successfully and is Pending Approval");
      setIsModalOpen(false);
      setSelectedSlot(null);

      const res = await axiosInstance.get(API_PATH.BOOKINGS.GET_BOOKINGS_BY_COURT(court.id), { withCredentials: true });
      const booked = res.data.bookings.map(b => ({
        date: b.booking_date,
        startTime: b.start_time,
        endTime: b.end_time,
      }));
      setBookedSlots(booked);

    } catch (err) {
      console.error("Failed to create booking:", err);
      toast.error("❌ Failed to book slot. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites ❤️");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-start mb-6">
            <Link to="/user/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </motion.button>
            </Link>

            <motion.button
              onClick={toggleFavorite}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full"
            >
              <Heart 
                className={`w-6 h-6 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
              />
            </motion.button>
          </div>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            {court.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 items-center text-sm sm:text-base"
          >
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4" />
              <span>{court.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <DollarSign className="w-4 h-4" />
              <span>Rs {court.hourly_rate}/hour</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Zap className="w-4 h-4" />
              <span>{court.type}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Court Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 border-none shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-green-700 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                Court Details
              </CardTitle>
              <CardDescription className="text-base">
                {court.description || "Premium futsal court with top-notch facilities"}
              </CardDescription>
            </CardHeader>
            {court.maintenance && (
              <CardContent>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg font-semibold flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  ⚠️ Court Under Maintenance
                </motion.div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Time Slots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-700 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Select Your Time Slot
              </CardTitle>
              <CardDescription className="text-base">
                Choose from available slots in the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedDate} onValueChange={setSelectedDate}>
                <TabsList className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6 bg-green-100/50 p-2 rounded-xl">
                  {nextDays.map((day, index) => (
                    <TabsTrigger
                      key={day}
                      value={day}
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white hover:bg-green-200 transition-all rounded-lg font-medium"
                    >
                      {getDateLabel(day, index)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {nextDays.map((day) => (
                  <TabsContent key={day} value={day}>
                    <SlotGrid
                      slots={slots}
                      onSlotSelect={handleSlotSelect}
                      selectedSlot={selectedSlot}
                      bookedSlots={bookedSlots}
                      selectedDate={day}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {selectedSlot && isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-t-8 border-green-500 relative overflow-hidden"
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-20 -right-20 w-40 h-40 bg-green-500 rounded-full blur-3xl"
              />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Confirm Your Booking
              </h2>

              <div className="space-y-4 mb-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500"
                >
                  <p className="text-sm text-gray-600 mb-1">Court</p>
                  <p className="font-bold text-lg text-gray-800">{court.name}</p>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500"
                >
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-bold text-lg text-gray-800">{selectedDate}</p>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-500"
                >
                  <p className="text-sm text-gray-600 mb-1">Time</p>
                  <p className="font-bold text-lg text-gray-800">
                    {selectedSlot.startTime} - {selectedSlot.endTime}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-500"
                >
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="font-bold text-2xl text-gray-800">Rs {court.hourly_rate}</p>
                </motion.div>
              </div>

              <div className="flex gap-3">
                <motion.div className="flex-1">
                  <Button
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Booking...
                      </span>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </motion.div>

                <motion.div className="flex-1">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition-all"
                  >
                    Cancel
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}