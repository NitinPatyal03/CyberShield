import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react/jsx-runtime";

interface Props {
  children: JSX.Element;
}

function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, loading, token } = useAuth();

  console.log("ProtectedRoute", {
    loading,
    isAuthenticated,
    token,
    localStorageToken: localStorage.getItem("token"),
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;