// Updated AuthPage.jsx with green theme, strong password check, inline error, no redirect on wrong credentials

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserCircle,Phone } from 'lucide-react';
import { toast } from 'react-toastify';
import {useRole} from "@/Context/RoleContext"
import { API_PATH } from '../utils/apiPath.js';
import axiosInstance from '../utils/axios.js';

export default function AuthPage() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const {updateRole}=useRole()

  const [authMode, setAuthMode] = useState(mode === 'signup' ? 'signup' : 'login');
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [phoneNumber,setPhoneNumber]=useState('')
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    if (mode === 'signup' || mode === 'login') setAuthMode(mode);
  }, [mode]);

  const validatePassword = (pw) => {
    if (pw.length < 8) return '❌ Minimum 8 characters';
    if (!/[A-Z]/.test(pw)) return '❌ Must include uppercase letter';
    if (!/\d/.test(pw)) return '❌ Must include a number';
    if (!/[!@#$%^&*]/.test(pw)) return '❌ Must include a special symbol';
    return '✅ Strong password';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        if (!email || !password) {
          setError('Please fill all fields');
          setLoading(false);
          return;
        }

        try {
  const res = await axiosInstance.post(API_PATH.AUTH.LOGIN_USER, { email, password }, { withCredentials: true });

  // Only save token and navigate if login successful
  if (res.status === 200 && res.data.user && res.data.user.token) {
    toast.success("login Successfull")
    const userRole = res.data.user.role;
    if (userRole === "user") navigate("/user/dashboard");
    else if (userRole === "court_owner") navigate("/owner/dashboard");
    else if (userRole === "admin") navigate("/admin/dashboard");
    updateRole(userRole)
  }

} catch (err) {
  
  
  const msg = err.response?.data?.message || "Invalid Email or Password";
  setError(msg);
  toast.error(msg);
  // DO NOT navigate anywhere
}

      } else {
        if (!username || !email || !password || !role || !phoneNumber) {
          setError('Please fill all fields');
          setLoading(false);
          return;
        }

        const strength = validatePassword(password);
        if (strength !== '✅ Strong password') {
          setError('Please choose a stronger password');
          setLoading(false);
          return;
        }

        await axiosInstance.post(API_PATH.AUTH.REGISTER_USER, {
          username,
          email,
          password,
          role,
          phone_number:phoneNumber
        });

        toast.success('Account created!');
        navigate('/auth/login');
      }

    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid Email or Password';
      setError(msg); // Show inline error, do NOT redirect
      toast.error(msg);

    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    const newMode = authMode === 'login' ? 'signup' : 'login';
    navigate(`/auth/${newMode}`);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-green-50">

      {/* Left Section */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="relative z-10 w-full max-w-md">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg shadow-green-500/50">
              <span className="text-3xl font-bold text-white">C</span>
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Courtify</h1>
            <p className="text-gray-600">
              {authMode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-green-200">
            <form onSubmit={handleSubmit} className="space-y-5">

              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-green-100 border border-green-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="johndoe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 bg-green-100 border border-green-200 text-gray-800 rounded-xl outline-none"
                    >
                      <option value="user">User</option>
                      <option value="court_owner">Court Owner</option>

                      
                    </select>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-green-100 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
{authMode === "signup" && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Phone Number
    </label>

    <div className="relative">
      <Phone
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />

      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
        className="w-full pl-11 pr-4 py-3 bg-green-100 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500"
        placeholder="+92 300 1234567"
      />
    </div>
  </div>
)}



              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordStrength(validatePassword(e.target.value));
                    }}
                    required
                    className="w-full pl-11 pr-11 py-3 bg-green-100 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password strength */}
                {authMode === 'signup' && password && (
                  <p className="text-sm mt-1 text-green-700">{passwordStrength}</p>
                )}
              </div>

              {/* Error Box */}
              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={toggleAuthMode}
                className="text-sm text-gray-600 hover:text-green-600"
              >
                {authMode === 'login' ? (
                  <>Don't have an account? <span className="font-semibold">Sign up</span></>
                ) : (
                  <>Already have an account? <span className="font-semibold">Sign in</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Image - Green Theme */}
{/* Right Side Image - Green Theme */}
<div
  className="hidden lg:block lg:w-1/2 relative bg-cover bg-center"
  style={{
    backgroundImage:
      `url('/mnt/data/screencapture-localhost-5173-user-dashboard-search-2025-11-25-01_50_28.png')`,
  }}
>
  {/* Green Glass Overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-green-800/40 to-green-600/30 backdrop-blur-md" />

  {/* Text Content */}
  <div className="absolute inset-0 flex items-center justify-center p-12">
    <div className="text-white text-center max-w-lg drop-shadow-xl">
      
      <h2 className="text-5xl font-extrabold mb-6 leading-tight text-green-300">
        Book Your Court,<br /> Play Your Game
      </h2>

      <p className="text-xl text-green-100/90 leading-relaxed">
        Join thousands of players and court owners using CourtHub to streamline
        bookings and elevate your game experience.
      </p>

    </div>
  </div>
</div>

</div>

);
}