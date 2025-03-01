import React from "react";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../Components/Sidebar/Sidebar";
import MainContent from "../Components/MainContent/MainContent";
import SearchContent from "./SearchContent";

const Dashboard = () => {
  const location = useLocation();
  const isSearchPath = location.pathname === "/search";

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <Sidebar />

      {isSearchPath ? <SearchContent /> : <MainContent />}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Dashboard;
