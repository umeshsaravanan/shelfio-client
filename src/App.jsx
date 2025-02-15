import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import AllContexts from "./Contexts/AllContexts";

const App = () => {
  return (
    <AllContexts>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>No such page Exist</div>} />
      </Routes>
    </AllContexts>
  );
};

export default App;
