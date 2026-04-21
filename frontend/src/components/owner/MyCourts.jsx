import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios.js";
import { toast } from 'react-toastify';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MapPin, Clock, DollarSign } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MyCourts() {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // ------------------------------------
  // FETCH COURTS OF LOGGED-IN USER
  // ------------------------------------
  const fetchMyCourts = async () => {
    try {
      const res = await axiosInstance.get("/courts/byuser", {
        withCredentials: true
      });
      console.log(res.data.courts)

      const formatted = res.data.courts.map((c) => ({
        id: c.id,
        name: c.name,
        location: c.location,
        pricePerHour: c.hourly_rate,
        maintenance: c.maintenance,
        status: c.status,
        type: c.type,
        openingTime: c.opening_time,
        closingTime: c.closing_time,
        description: c.description,
        image: c.image_url,
      }));

      setCourts(formatted);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      toast.error("Failed to fetch courts");
    }
  };

  useEffect(() => {
    fetchMyCourts();
  }, []);

  // ------------------------------------
  // DELETE COURT
  // ------------------------------------
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/courts/${id}`, {
        withCredentials: true
      });
      setCourts(courts.filter((c) => c.id !== id));
      toast.success("Court deleted Successfully!");
    } catch (err) {
      console.error("DELETE ERROR:", err);
      toast.error("Failed to delete court");
    }
  };

  // ------------------------------------
  // EDIT COURT
  // ------------------------------------
  const handleEdit = (court) => {
    setSelectedCourt(court);
    setIsEditOpen(true);
  };

  // ------------------------------------
  // UPDATE COURT
  // ------------------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      name: selectedCourt.name,
      location: selectedCourt.location,
      hourly_rate: selectedCourt.pricePerHour,
      maintenance: selectedCourt.maintenance,
      type: selectedCourt.type,
      description: selectedCourt.description,
      opening_time: selectedCourt.openingTime,
      closing_time: selectedCourt.closingTime,
      image_url: selectedCourt.image,
    };

    try {
      await axiosInstance.put(`/courts/${selectedCourt.id}`, payload, {
        withCredentials: true
      });

      // update UI instantly
      setCourts((prev) =>
        prev.map((c) => (c.id === selectedCourt.id ? selectedCourt : c))
      );

      setIsEditOpen(false);
      toast.success("Court updated Successfully!");
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      toast.error("Failed to update court");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">My Courts</h2>
            <p className="text-green-50">Manage and monitor your sports facilities</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 py-3">
            <p className="text-black-50 text-sm font-medium">Total Courts</p>
            <p className="text-3xl font-bold text-black">{courts.length}</p>
          </div>
        </div>
      </div>

      {/* COURT CARDS */}
      {courts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-green-200 p-12 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏟️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Courts Yet</h3>
          <p className="text-gray-600">Start by adding your first court to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <Card key={court.id} className="border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
              {/* Court Image */}
              <div className="relative h-48 bg-gradient-to-br from-green-400 to-emerald-500 overflow-hidden">
                {court.image ? (
                  <img 
                    src={court.image} 
                    alt={court.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl opacity-50">🏟️</span>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                      court.status === "approved"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-400 text-gray-900"
                    }`}
                  >
                    {court.status === "approved" ? "✓ Approved" : "⏳ Pending"}
                  </span>
                </div>

                {/* Type Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-white bg-opacity-90 text-green-700 capitalize">
                    {court.type}
                  </span>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-gray-800 group-hover:text-green-600 transition-colors">
                  {court.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span className="text-sm truncate">{court.location}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <p className="text-xs text-green-700 font-medium mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Price per hour
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    Rs {court.pricePerHour}
                  </p>
                </div>

                {/* Timing Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{court.openingTime} - {court.closingTime}</span>
                </div>

                {/* Maintenance Status */}
                {court.maintenance && (
                  <div className="flex items-center gap-2 text-sm bg-orange-50 text-orange-700 rounded-lg p-2 border border-orange-200">
                    <span className="text-xs">🔧</span>
                    <span className="font-medium">Under Maintenance</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-400 transition-all"
                    onClick={() => handleEdit(court)}
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all"
                    onClick={() => handleDelete(court.id)}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl border-2 border-green-100 rounded-2xl">
          <DialogHeader className="border-b border-green-100 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Edit2 className="w-6 h-6 text-green-600" />
              Edit Court Details
            </DialogTitle>
          </DialogHeader>

          {selectedCourt && (
            <form onSubmit={handleUpdate} className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Court Name</Label>
                <Input
                  className="border-2 border-green-100 focus:border-green-400 rounded-lg"
                  value={selectedCourt.name}
                  onChange={(e) =>
                    setSelectedCourt({ ...selectedCourt, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Description</Label>
                <Textarea
                  className="border-2 border-green-100 focus:border-green-400 rounded-lg min-h-24"
                  value={selectedCourt.description}
                  onChange={(e) =>
                    setSelectedCourt({
                      ...selectedCourt,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Hourly Rate (Rs)</Label>
                  <Input
                    type="number"
                    className="border-2 border-green-100 focus:border-green-400 rounded-lg"
                    value={selectedCourt.pricePerHour}
                    onChange={(e) =>
                      setSelectedCourt({
                        ...selectedCourt,
                        pricePerHour: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Maintenance Status</Label>
                  <Select
                    value={selectedCourt.maintenance ? "true" : "false"}
                    onValueChange={(value) =>
                      setSelectedCourt({
                        ...selectedCourt,
                        maintenance: value === "true",
                      })
                    }
                  >
                    <SelectTrigger className="border-2 border-green-100 focus:border-green-400 rounded-lg">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>

                    <SelectContent className="rounded-lg">
                      <SelectItem value="true">Under Maintenance</SelectItem>
                      <SelectItem value="false">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Opening Time</Label>
                  <Input
                    type="time"
                    className="border-2 border-green-100 focus:border-green-400 rounded-lg"
                    value={selectedCourt.openingTime}
                    onChange={(e) =>
                      setSelectedCourt({
                        ...selectedCourt,
                        openingTime: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Closing Time</Label>
                  <Input
                    type="time"
                    className="border-2 border-green-100 focus:border-green-400 rounded-lg"
                    value={selectedCourt.closingTime}
                    onChange={(e) =>
                      setSelectedCourt({
                        ...selectedCourt,
                        closingTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Court Type</Label>
                  <Select
                    value={selectedCourt.type}
                    onValueChange={(value) =>
                      setSelectedCourt({ ...selectedCourt, type: value })
                    }
                  >
                    <SelectTrigger className="border-2 border-green-100 focus:border-green-400 rounded-lg">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>

                    <SelectContent className="rounded-lg">
                      <SelectItem value="badminton">Badminton</SelectItem>
                      <SelectItem value="tennis">Tennis</SelectItem>
                      <SelectItem value="futsal">Futsal</SelectItem>
                      <SelectItem value="volleyball">Volleyball</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Location (Map Link)</Label>
                  <Input
                    className="border-2 border-green-100 focus:border-green-400 rounded-lg"
                    value={selectedCourt.location}
                    onChange={(e) =>
                      setSelectedCourt({
                        ...selectedCourt,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <DialogFooter className="border-t border-green-100 pt-4">
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 rounded-xl shadow-lg" 
                  type="submit"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}