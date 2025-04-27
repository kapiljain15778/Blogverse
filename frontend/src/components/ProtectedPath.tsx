import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export const ProtectedPath = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signup" replace={true} />;
  }

  return children;
};
