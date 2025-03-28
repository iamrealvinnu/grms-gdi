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
import CreateUser from "./components/Admin/CreateUser";
import GetUserList from "./components/Admin/GetUserList";
import UpdateUser from "./components/Admin/UpdateUser";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import MarketingDetails from "./components/Campaign/MarketingDetails";
import MarketingCreate from "./components/Campaign/MarketingCreate";
import ChangePassword from "./components/pages/ChangePassword";
import UpdateData from "./components/Leads/UpdateLeadData";
import GetAllOpportunity from "./components/Leads/Opportunity/GetAllOpportunity";
import CreateOpportunity from "./components/Leads/Opportunity/CreateOpportunity";
import GoogleCallback from "./components/pages/GoogleCallback";
import GetListCustomers from "./components/Leads/Customers/GetListCustomers";
import CreateCustomer from "./components/Leads/Customers/CreateCustomer";
import LeadData from "./components/Leads/LeadData";
import AddLead from "./components/Leads/AddLead";

function App() {
  return (
    <Router>
      <Header />
      <AuthMonitor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/google/callback" element={<GoogleCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* User-Management Routes */}
        <Route path="/userCreate" element={<CreateUser />} />
        <Route path="/userGetAllList" element={<GetUserList />} />
        <Route path="/userUpdate/:userId" element={<UpdateUser />} />

        {/* Add Client-Lead Routes */}
        <Route path="/leadDetails" element={<LeadData />} />
        <Route path="/addLead" element={<AddLead />} />
        <Route path="/clientData/:leadId" element={<UpdateData />} />

        {/* Opportunity Routes */}
        <Route path="/getAllOpportunity" element={<GetAllOpportunity />} />
        <Route path="/createOpportunity" element={<CreateOpportunity />} />

        {/* Customers Routes */}
        <Route path="/getCustomerList" element={<GetListCustomers />} />
        <Route path="/createCustomerList" element={<CreateCustomer />} />


        {/* Marketing Management Routes */}
        <Route path="/campaignDetails" element={<MarketingDetails />} />
        <Route path="/campaignCreate" element={<MarketingCreate />} />

        

      </Routes>
    </Router>
  );
}

export default App;
