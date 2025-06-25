// AddLead.jsx
// Author: Krishna Murthy
// Company: GDI Nexus
// Date: 28/03/2025
// Purpose: Lead Creation Form

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateCustomer() {
  const [tableIndustryData, setTableIndustryData] = useState([]);
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    accountId: "",
    email: "",
    phoneNumber: "",
    departmentId: "",
    assignedToId: "",
    createdById: ""
  });

  const navigate = useNavigate();

  const DepartmentTypes =
    tableIndustryData.find((item) => item.name === "Department Types")
      ?.referenceItems || [];

  // Fetch reference data
  const fetchTableData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/Reference/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setTableIndustryData(response.data.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/User/all/true",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Account/all/true",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const accountList = response.data.data;
      setAccounts(accountList);

      if (accountList.length > 0) {
        setClientData((prevData) => ({
          ...prevData,
          accountId: accountList[0].id
        }));
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // Decode current user
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        setCurrentUserId(userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Initial data fetching
  useEffect(() => {
    fetchTableData();
    fetchUsers();
    fetchAccounts();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !clientData.accountId ||
      !clientData.firstName ||
      !clientData.email ||
      !clientData.phoneNumber ||
      !clientData.assignedToId
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const dataToSend = { ...clientData, createdById: currentUserId };

      const response = await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Account/contact/create",
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Customer added successfully!");
        setTimeout(() => navigate("/getCustomerList"), 1500);
      } else {
        toast.error("Unexpected response from server.");
      }
      console.log('Customer Created data:',response.data);
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Network error or server not responding.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        {/* Company Details Section */}
        <div className="p-4">
          <h3 className="text-2xl font-semibold mb-4">Company Details</h3>
          <div className="flex flex-wrap gap-4">
            {/* Company Name (Dropdown of Accounts) */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <select
                name="accountId"
                value={clientData.accountId}
                onChange={handleChange}
                className="w-full border-dashed border-2 border-gray-400 rounded p-2 bg-white"
                required
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Lead Owner */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Assigned To <span className="text-red-500">*</span>
              </label>
              <select
                name="assignedToId"
                className="w-full border-dashed border-2 border-gray-400 rounded p-2 bg-white"
                value={clientData.assignedToId}
                onChange={handleChange}
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.profile?.firstName || "Unnamed User"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="mb-6 border-b pb-4 mt-6">
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
            <div className="flex flex-wrap gap-4">
              {/* First Name */}
              <div className="w-full md:w-[48%]">
                <label className="block font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={clientData.firstName}
                  onChange={handleChange}
                  className="w-full border-dashed border-2 border-gray-400 rounded p-2"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="w-full md:w-[48%]">
                <label className="block font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={clientData.lastName}
                  onChange={handleChange}
                  className="w-full border-dashed border-2 border-gray-400 rounded p-2"
                />
              </div>

              {/* Email */}
              <div className="w-full md:w-[48%]">
                <label className="block font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={clientData.email}
                  onChange={handleChange}
                  className="w-full border-dashed border-2 border-gray-400 rounded p-2"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="w-full md:w-[48%]">
                <label className="block font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="phoneNumber"
                  value={clientData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border-dashed border-2 border-gray-400 rounded p-2"
                  required
                />
              </div>

               {/* Department Dropdown */}
               <div className="w-full md:w-[48%]">
                 <label className="block font-medium text-gray-700">
                   Department <span className="text-red-500">*</span>
                 </label>
                 <select
                  name="departmentId"
                  className="w-full border-dashed border-2 border-gray-400 rounded p-2 bg-white"
                  value={clientData.departmentId}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {DepartmentTypes.map((departmentType) => (
                    <option key={departmentType.id} value={departmentType.id}>
                      {departmentType.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCustomer;
