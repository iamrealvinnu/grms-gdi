//
// NAME:			  App.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  02/12/2025
// PURPOSE:			All component import To User's Dispaly
//

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // Import correct path for Navbar
import Home from "./components/pages/Home"; // Import Homepage
import Dashboard from "./components/pages/Dashboard"; // Import Dashboard 
import Profile from "./components/pages/Profile";
import Notification from "./components/pages/Notification";
import AuthMonitor from "./components/authMonitor"; // Import AuthMonitor
import SignUp from "./components/pages/SignUp";

function App() {
  return (
    <Router>
      <Header />
      <AuthMonitor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
