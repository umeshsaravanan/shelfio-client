import React from "react";

import { useAuthCtx } from "../Contexts/AuthCtx";
import { useLocation } from "react-router-dom";

import Login from "../Pages/Login";

const ProtectRoutes = ({ children }) => {
  const { isAuthenticated } = useAuthCtx();
  const location = useLocation();

  const publicRoutes = ["/forgot-password", "/reset-password"];

  if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
    return <Login />;
  }

  return <div>{children}</div>;
};

export default ProtectRoutes;
