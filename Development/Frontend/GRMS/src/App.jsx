//
// NAME:			  App.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  02/12/2025
// PURPOSE:			All component import To User's Dispaly
//

// Imports
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // Import correct path for Navbar
import Home from "./components/pages/Home"; // Import Homepage
import Dashboard from "./components/pages/Dashboard"; // Import Dashboard
import Profile from "./components/pages/Profile";
import Notification from "./components/pages/Notification";
import AuthMonitor from "./components/authMonitor"; // Import AuthMonitor
import CreateUser from "./components/UserManagement/CreateUser";
import GetUserList from "./components/UserManagement/GetUserList";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import UpdateUser from "./components/UserManagement/UpdateUser";
import ClientData from "./components/AddLead/Client_Data";
import Add_Client from "./components/AddLead/Add_Client";
import MarketingDetails from "./components/Marketing Management/MarketingDetails";
import MarketingCreate from "./components/Marketing Management/MarketingCreate";
import ChangePassword from "./components/pages/ChangePassword";

function App() {
  return (
    <Router>
      <Header />
      <AuthMonitor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* User-Management Routes */}
        <Route path="/userCreate" element={<CreateUser />} />
        <Route path="/userGetAllList" element={<GetUserList />} />
        <Route path="/userUpdate/:userId" element={<UpdateUser />} />

        {/* Add Client-Lead Routes */}
        <Route path="/clientDetails" element={<ClientData />} />
        <Route path="/addClient" element={<Add_Client />} />

        {/* User-Profile Routes */}

        {/* Marketing Management Routes */}
        <Route path="/marketingDetails" element={<MarketingDetails />} />
        <Route path="/marketingCreate" element={<MarketingCreate />} />
      </Routes>
    </Router>
  );
}

export default App;
