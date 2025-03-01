import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import AllContexts from "./Contexts/AllContexts";

const App = () => {
  return (
    <AllContexts>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/:parentType/:parentName/:parentId/:child1Type?/:child1Name?/:child1Id?/:child2Type?/:child2Name?/:child2Id?"
          element={<Dashboard />}
        />
        <Route path="/search" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<div>No such page Exist</div>} />
      </Routes>
    </AllContexts>
  );
};

export default App;
