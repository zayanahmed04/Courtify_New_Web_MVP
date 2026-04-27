import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { Upload, MapPin, DollarSign, Clock, FileText, Image, CheckCircle2, XCircle } from "lucide-react";
import axiosInstance from "../../utils/axios.js";
import { toast as reactToast } from "react-toastify";

export default function AddCourt() {
  const { toast } = useToast(); // keep if you use custom toast somewhere else
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    courtName: "",
    location: "",
    pricePerHour: "",
    openTime: "08:00",
    closeTime: "22:00",
    description: "",
    courtType: "tennis",
  });

  // ---------- Input Handler ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      courtType: value,
    }));
  };

  // ---------- Image Handler ----------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ---------- Cloudinary Upload ----------
  async function uploadToCloudinary(file) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: fd,
      }
    );

    if (!res.ok) throw new Error("Cloudinary upload failed");

    const data = await res.json();
    return data.secure_url;
  }

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!imageFile) {
        reactToast.error("Please upload a court image.");
        return;
      }

      if (!formData.courtName || !formData.location || !formData.pricePerHour) {
        reactToast.error("Please fill all required fields.");
        return;
      }

      // Upload Image
      const uploadedImageURL = await uploadToCloudinary(imageFile);

      const payload = {
        name: formData.courtName.trim(),
        location: formData.location.trim(),
        hourly_rate: Number(formData.pricePerHour),
        opening_time: formData.openTime,
        closing_time: formData.closeTime,
        description: formData.description.trim(),
        type: formData.courtType,
        image_url: uploadedImageURL,
      };

      const res = await axiosInstance.post("/courts/register", payload, {
        withCredentials: true,
      });

      if (res.status === 201) {
        reactToast.success(res.data.message);
      } else {
        reactToast.error(res.data.message || "Failed to add court.");
      }

      // Reset Form
      setFormData({
        courtName: "",
        location: "",
        pricePerHour: "",
        openTime: "08:00",
        closeTime: "22:00",
        description: "",
        courtType: "tennis",
      });
      setImageFile(null);
      setImagePreview(null);

    } catch (err) {
      if (err.response?.data?.message) {
        reactToast.error(err.response.data.message);
      } else {
        reactToast.error("Failed to add court. Please try again.");
      }
      console.error("SUBMIT ERROR:", err);
    }
  };

  const handleCancel = () => {
    setFormData({
      courtName: "",
      location: "",
      pricePerHour: "",
      openTime: "08:00",
      closeTime: "22:00",
      description: "",
      courtType: "tennis",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-3xl shadow-xl p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 drop-shadow-md">Add New Court</h1>
              <p className="text-emerald-100 text-lg">Create a new sports facility listing</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0 overflow-hidden rounded-3xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
            <CardTitle className="text-2xl text-emerald-900">Court Information</CardTitle>
            <CardDescription className="text-emerald-600">
              Fill in the details for your new court
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Court Name & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Court Name *
                  </Label>
                  <Input
                    name="courtName"
                    value={formData.courtName}
                    onChange={handleChange}
                    placeholder="e.g., Fireball Tennis Court"
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-12 rounded-xl transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    Location *
                  </Label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Lyari, Karachi"
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-12 rounded-xl transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Price & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    Price per Hour (Rs) *
                  </Label>
                  <Input
                    name="pricePerHour"
                    type="number"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    placeholder="e.g., 2000"
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-12 rounded-xl transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Court Type
                    <Input
                    name="courtType"
                    type="text"
                    value={formData.courtType}
                    onChange={handleChange}
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-12 rounded-xl transition-all duration-300"
                    placeholder="eg,multi-purpose,futsal,badminton (only one)"
                  />
                  </Label>
                  
                 
                </div>
              </div>

              {/* Opening & Closing Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    Opening Time
                  </Label>
                  <Input
                    name="openTime"
                    type="time"
                    value={formData.openTime}
                    onChange={handleChange}
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-12 rounded-xl transition-all duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    Closing Time
                  </Label>
                  <Input
                    name="closeTime"
                    type="time"
                    value={formData.closeTime}
                    onChange={handleChange}
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-12 rounded-xl transition-all duration-300"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Description
                </Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your court facilities, amenities, and special features..."
                  className="min-h-32 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl resize-none transition-all duration-300"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Image className="w-4 h-4 text-emerald-500" />
                  Court Photo *
                </Label>

                <div className="relative">
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-2xl p-12 text-center space-y-4 hover:border-emerald-300 transition-all duration-300 cursor-pointer group">
                      <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-10 h-10 text-emerald-600" />
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900 text-lg">Upload Court Photo</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Click to browse or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="courtImage"
                      />
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200">
                      <img
                        src={imagePreview}
                        alt="Court preview"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between p-6">
                        <div className="flex items-center gap-2 text-white">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span className="font-medium">{imageFile?.name}</span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="bg-red-500 hover:bg-red-600 rounded-lg"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Save Court
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-12 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 text-base font-semibold rounded-xl transition-all duration-300"
                  onClick={handleCancel}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Cancel
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tips for a great listing</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Upload high-quality photos that showcase your court</li>
                  <li>• Provide accurate pricing and availability information</li>
                  <li>• Write a detailed description highlighting unique features</li>
                  <li>• Keep your contact information up to date</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}