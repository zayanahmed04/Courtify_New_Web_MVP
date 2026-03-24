import { Routes, Route } from 'react-router-dom';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import BookingPage from './pages/BookingPage';
import OwnerDashboard from './pages/OwnerDashboard';
import ProfilePage from './pages/ProfilePage';
import SearchCourts from './components/User/SearchCourts';
import UpcomingMatches from './components/User/UpcomingMatches';
import MyBookings from './components/User/MyBookings';
import FavoriteCourts from './components/User/FavoriteCourts';
import MyCourts from './components/owner/MyCourts';
import AddCourt from './components/owner/AddCourt';
import OwnerBooking from './components/owner/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import CancelPage from './pages/CancelPage';
import SuccessPage from './pages/SuccessPage';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className='bg-black'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/:mode" element={<AuthPage />} />

        {/* User Dashboard Routes */}
        <Route
          path="/user/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<SearchCourts />} />
          <Route path="search" element={<SearchCourts />} />
          <Route path="matches" element={<UpcomingMatches />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="favorites" element={<FavoriteCourts />} />
        </Route>

        <Route path="/courts/:id" element={<BookingPage />} />

        {/* Profile Page Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['user', 'court_owner', 'admin']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Owner Dashboard Routes */}
        <Route
          path="/owner/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['court_owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyCourts />} />
          <Route path="add-court" element={<AddCourt />} />
          <Route path="bookings" element={<OwnerBooking />} />
        </Route>

        {/* Admin Dashboard Route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Success & Cancel */}
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
      </Routes>
      <ChatWidget />
    </div>
  );
}

export default App;
