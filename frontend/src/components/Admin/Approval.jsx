import  { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";
import { API_PATH } from "@/utils/apiPath";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  DollarSign, 
  Tag, 
  Clock,
  ClipboardCheck,
  Loader2,
  ImageOff
} from "lucide-react";
import { toast } from "react-toastify";

export default function AdminApprovals() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending courts
  useEffect(() => {
    const fetchPendingCourts = async () => {
      try {
        const res = await axiosInstance.get(API_PATH.ADMIN.GET_ALL_COURTS_PENDING);
        setCourts(res.data.courts || []);
      } catch (err) {
        console.error("Error fetching pending courts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCourts();
  }, []);

  // Approve court
  const handleApprove = async (courtId) => {
    try {
      await axiosInstance.put(API_PATH.ADMIN.UPDATE_COURT_STATUS(courtId), {
        status: "approved",
      });

      setCourts((prev) => prev.filter((c) => c.id !== courtId));
      toast.success("Court approved successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to approve court");
    }
  };

  // Reject court
  const handleReject = async (courtId) => {
    try {
      await axiosInstance.put(API_PATH.ADMIN.UPDATE_COURT_STATUS(courtId), {
        status: "rejected",
      });

      setCourts((prev) => prev.filter((c) => c.id !== courtId));
      toast.success("Court rejected successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to reject court");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-20 h-20 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
        <p className="text-gray-600 text-lg font-medium">Loading pending courts...</p>
      </div>
    );
  }

  // No Pending Courts
  if (courts.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-24 h-24 rounded-full flex items-center justify-center mb-4">
          <ClipboardCheck className="w-12 h-12 text-emerald-600" />
        </div>
        <p className="text-gray-900 text-xl font-bold mb-2">All caught up!</p>
        <p className="text-gray-500 text-sm">No pending court approvals at the moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Stats Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-400 to-orange-400 p-3 rounded-xl shadow-md">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Pending Approvals</p>
            <p className="text-2xl font-bold text-gray-900">{courts.length}</p>
          </div>
        </div>
      </div>

      {/* Court Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courts.map((court) => (
          <Card 
            key={court.id} 
            className="bg-white border-2 border-emerald-100 overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group hover:scale-[1.02]"
          >
            {/* Image */}
            <div className="relative w-full h-48 bg-gradient-to-br from-emerald-100 to-teal-100 overflow-hidden">
              {court.image_url ? (
                <img
                  src={court.image_url}
                  alt={court.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}

              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-emerald-300"
                style={{ display: court.image_url ? "none" : "flex" }}
              >
                <ImageOff className="w-16 h-16 mb-2" />
                <p className="text-sm font-medium">No Image</p>
              </div>

              <div className="absolute top-3 right-3">
                <Badge className="bg-amber-100 text-amber-700 border-2 border-amber-200 font-semibold px-3 py-1 shadow-lg">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending Review
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-xl text-gray-900 group-hover:text-emerald-700 transition-colors">
                {court.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="pb-4 flex-grow space-y-3">
              
              {/* Location */}
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-emerald-50/50 transition-colors">
                <div className="bg-emerald-100 p-2 rounded-lg mt-0.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Location</p>
                  <p className="text-sm text-gray-900 font-medium truncate">{court.location}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-emerald-50/50 transition-colors">
                <div className="bg-teal-100 p-2 rounded-lg mt-0.5">
                  <DollarSign className="w-4 h-4 text-teal-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Hourly Rate</p>
                  <p className="text-sm text-gray-900 font-bold">Rs {court.hourly_rate}</p>
                </div>
              </div>

              {/* Type */}
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-emerald-50/50 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg mt-0.5">
                  <Tag className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Court Type</p>
                  <p className="text-sm text-gray-900 font-medium capitalize">{court.type}</p>
                </div>
              </div>

            </CardContent>

            <CardFooter className="gap-3 flex p-4 bg-gradient-to-r from-gray-50 to-emerald-50/30 border-t border-emerald-100">
              <Button
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group/approve"
                onClick={() => handleApprove(court.id)}
              >
                <CheckCircle2 className="w-4 h-4 mr-2 group-hover/approve:scale-110 transition-transform" />
                Approve
              </Button>

              <Button
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group/reject"
                onClick={() => handleReject(court.id)}
              >
                <XCircle className="w-4 h-4 mr-2 group-hover/reject:scale-110 transition-transform" />
                Reject
              </Button>
            </CardFooter>

          </Card>
        ))}
      </div>
    </div>
  );
}
