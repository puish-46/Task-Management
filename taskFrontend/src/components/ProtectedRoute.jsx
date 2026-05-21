import { Navigate } from "react-router";
import useAuthStore from "../store/authStore";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;
