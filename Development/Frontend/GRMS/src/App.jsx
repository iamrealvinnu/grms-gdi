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
import GetAllAccount from "./components/Account/GetAllAccount";
import AddAccount from "./components/Account/AddAccount";
import UpdateCampaign from "./components/Campaign/UpdateCampaign";
import GetAllActivities from "./components/Activities/GetAllActivities";
import UpdateOpportunity from "./components/Leads/Opportunity/UpdateOpportunity";
import EditAccount from "./components/Account/EditAccount";
import UpdateContact from "./components/Leads/Customers/UpdateContact";
import CreateTask from "./components/Activities/Task/CreateTask";
import CallCreate from "./components/Activities/Call/CallCreate";
import MailCreate from "./components/Activities/Email/MailCreate";
import MeetingCreate from "./components/Activities/Meeting/MeetingCreate";
import UpdateTask from "./components/Activities/Task/UpdateTask";
import MicrosoftCallback from "./components/pages/MicroSoftCallback";
import CreateTemplate from "./components/Activities/Email/CreateTemplate";
import ViewOpportunity from "./components/Leads/Opportunity/ViewOpportunity";
import GetTasks from "./components/Activities/Task/GetTasks";
import GetCommunications from "./components/Activities/GetCommunications";
import CreateAccount from "./components/Account/CreateAccount";
import CreateLeadTask from "./components/Activities/Task/CreateLeadTask";
import ViewLeadData from "./components/Leads/ViewLeadData";
import CallLeadCreate from "./components/Activities/Call/CallLeadCreate";
import MeetingLeadCreate from "./components/Activities/Meeting/MeetingLeadCreate";
import MailLeadCreate from "./components/Activities/Email/MailLeadCreate";

function App() {
  return (
    <Router>
      <Header />
      <AuthMonitor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/resetpassword/:code" element={<ResetPassword />} />
        <Route path="/google/callback" element={<GoogleCallback />} />
        <Route path="/microsoft/callback" element={<MicrosoftCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/profile/:userId" element={<Profile />} />

        {/* User-Management Routes */}
        <Route path="/userCreate" element={<CreateUser />} />
        <Route path="/userGetAllList" element={<GetUserList />} />
        <Route path="/userUpdate/:userId" element={<UpdateUser />} />

        {/* Add Client-Lead Routes */}
        <Route path="/leadDetails" element={<LeadData />} />
        <Route path="/addLead" element={<AddLead />} />
        <Route path="/clientData/:leadId" element={<UpdateData />} />
        <Route path="/viewleadData/:leadId" element={<ViewLeadData />} />

        {/* Opportunity Routes */}
        <Route path="/getAllOpportunity" element={<GetAllOpportunity />} />
        <Route path="/createOpportunity/:leadId" element={<CreateOpportunity />} />
        <Route path="/updateOpportunity/:opportunityId" element={<UpdateOpportunity />} />
        <Route path="/viewOpportunity/:opportunityId/:leadId" element={<ViewOpportunity />} />

        {/* Customers Routes */}
        <Route path="/getCustomerList" element={<GetListCustomers />} />
        <Route path="/createCustomerList" element={<CreateCustomer />} />
        <Route path="/updateCustomer/:contactId" element={<UpdateContact />} />


        {/* Marketing Management Routes */}
        <Route path="/campaignDetails" element={<MarketingDetails />} />
        <Route path="/campaignCreate" element={<MarketingCreate />} />
        <Route path="/campaignUpdate/:campaignId" element={<UpdateCampaign />} />

        {/* Account Routes */}
        <Route path="/getAllaccount" element={<GetAllAccount />} />
        <Route path="/addAccount" element={<CreateAccount />} />
        <Route path="/addAccount/:opportunityId" element={<AddAccount />} />
        <Route path="/updateAccount/:accountId" element={<EditAccount />} />

        {/* Activities Routes */}
        <Route path="/getAllactivities" element={<GetAllActivities />} />
        <Route path="/getTasks" element={<GetTasks />} />
        <Route path="/getCommunications" element={<GetCommunications />} />

        {/* Task Routes */}
        <Route path="/createTask/:opportunityId/:leadId" element={<CreateTask />} />
        <Route path="/createLeadTask/:leadId" element={<CreateLeadTask />} />
        <Route path="/updateTask/:id" element={<UpdateTask />} />

        {/* Call Routes */}
        <Route path="/createCall/:opportunityId/:leadId" element={<CallCreate />} />
        <Route path="/createLeadCall/:leadId" element={<CallLeadCreate />} />
        
        {/* Email Routes */}
        <Route path="/createMail/:opportunityId/:leadId" element={<MailCreate />} />
        <Route path="/createLeadMail/:leadId" element={<MailLeadCreate />} />
        <Route path="/createTemplate" element={<CreateTemplate />} />

        {/* Meeting Routes */}
        <Route path="/createMeeting/:opportunityId/:leadId" element={<MeetingCreate />} />
        <Route path="/createLeadMeeting/:leadId" element={<MeetingLeadCreate />} />

      </Routes>
    </Router>
  );
}

export default App;
