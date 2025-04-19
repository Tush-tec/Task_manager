import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticate, ready } = useAuth();

  if (!ready) return null; // or show a loader while checking auth

  return isAuthenticate ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
