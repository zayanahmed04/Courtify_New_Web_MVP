import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center border-t-4 border-green-600">
        
        <CheckCircle className="mx-auto text-green-600" size={80} />

        <h1 className="text-2xl font-bold text-slate-900 mt-4">
          Payment Received 🎉
        </h1>

        <p className="text-slate-600 mt-2">
          Your payment has been successfully processed.
        </p>

        <p className="text-slate-600 mb-6">
          Thank you for booking with Courtify!
        </p>

        <Link
          to="/user/dashboard"
          className="block w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Go to Dashboard
        </Link>

        <Link
          to="/user/dashboard/bookings"
          className="block w-full mt-3 text-green-700 font-semibold hover:underline"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
