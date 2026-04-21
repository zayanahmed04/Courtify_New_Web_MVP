import { Navigate } from "react-router-dom";
import { useRole } from "../Context/RoleContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { role, loading } = useRole();

  if (loading) {
    // Abhi role load ho raha hai, kuch bhi render mat karo
    return null; 
    // Ya spinner dikha sakte ho: <div>Loading...</div>
  }

  if (!role) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
