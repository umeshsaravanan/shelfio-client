import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import PageNotFound from "./Pages/PageNotFound";
import AuthCtx from "./Contexts/AuthCtx";
import ProtectRoutes from "./Providers/ProtectRoutes";

const App = () => {
  return (
    <AuthCtx>
      <ProtectRoutes>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/:parentType/:parentName/:parentId/:child1Type?/:child1Name?/:child1Id?/:child2Type?/:child2Name?/:child2Id?"
            element={<Dashboard />}
          />
          <Route path="/search" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ProtectRoutes>
    </AuthCtx>
  );
};

export default App;
