import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!Cookies.get("accessToken");
  console.log(isAuthenticated)

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;