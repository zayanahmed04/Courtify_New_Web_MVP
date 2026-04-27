import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { API_PATH } from '../utils/apiPath';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: fd,
    }
  );

  if (!res.ok) throw new Error('Cloudinary upload failed');

  const data = await res.json();
  return data.secure_url;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    gender: 'not_specified',
    img_url: '',
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_PATH.AUTH.CURRENT_USER);
        const userData = response.data.user;
        console.log(userData)

        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
          gender: userData.gender || 'not_specified',
          img_url: userData.img_url || '',
        });

        setImagePreview(userData.img_url || null);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      let imgUrl = formData.img_url;

      // Upload image if a new file was selected
      if (imageFile) {
        try {
          imgUrl = await uploadToCloudinary(imageFile);
        } catch (error) {
          console.error('Image upload failed:', error);
          toast.error('Failed to upload image');
          setSubmitting(false);
          return;
        }
      }

      // Prepare data for backend
      const updateData = {
        username: formData.username,
        email: formData.email,
        phone_number: formData.phone_number,
        gender: formData.gender,
        img_url: imgUrl,
      };

      // Send update request
      await axiosInstance.put(
        API_PATH.USER.UPDATE_USER,
        updateData
      );

      setFormData((prev) => ({
        ...prev,
        img_url: imgUrl,
      }));

      setImageFile(null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(
        error.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <Card className="shadow-lg border-green-100 bg-white/90 backdrop-blur-sm overflow-hidden">
          {/* Profile Header with User Info */}
          <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {imagePreview || formData.img_url ? (
                    <img
                      src={imagePreview || formData.img_url}
                      alt={formData.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-green-600">
                      {formData.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold mb-1">
                  {formData.username || 'User Profile'}
                </h1>
                <p className="text-green-100 text-sm sm:text-base truncate">
                  {formData.email || 'No email set'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {formData.gender === 'not_specified' ? 'Not Specified' : formData.gender?.charAt(0).toUpperCase() + formData.gender?.slice(1)}
                  </span>
                  {formData.phone_number && (
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                      {formData.phone_number}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-gray-900">
                    Change Profile Picture
                  </Label>
                </div>

                {/* Circular Image Preview */}
                <div className="flex flex-col items-center gap-4">
                  {/* Small Circular Preview */}
                  <div className="relative group">
                    <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-green-300 hover:border-green-500 transition-colors cursor-pointer">
                      {imagePreview || formData.img_url ? (
                        <>
                          <img
                            src={imagePreview || formData.img_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-xs font-medium text-center">
                              Click to change
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                          <p className="text-gray-500 text-xs text-center">Add image</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Upload Button */}
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 cursor-pointer transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                    <Upload className="w-4 h-4" />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {imageFile && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ {imageFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 pt-6" />

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-900 font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="border-green-200 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="border-green-200 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-gray-900 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="border-green-200 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-900 font-medium">
                  Gender
                </Label>
                <Select value={formData.gender} onValueChange={handleGenderChange}>
                  <SelectTrigger className="border-green-200 focus:ring-green-500">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_specified">Not Specified</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
