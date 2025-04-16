// EditLead.jsx
// Author: Krishna Murthy
// Company: GDI Nexus
// Date: 28/03/2025
// Purpose: Lead Creation Form

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdateContact() {
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    accountId: "",
    email: "",
    phoneNumber: "",
    departmentId: "",
    assignedToId: "",
    changedById: "",
    mobileNumber: "",
  });
  const navigate = useNavigate();
  const { contactId } = useParams();
  const [errors, setErrors] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [departmentTypes, setDepartmentTypes] = useState({});

  const fetchContactData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://grms-dev.gdinexus.com:49181/api/v1/marketing/Account/contact/one/${contactId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const contactData = response.data?.data || response.data;
      setClientData({
        firstName: contactData.firstName || "",
        lastName: contactData.lastName || "",
        email: contactData.email || "",
        phoneNumber: contactData.phoneNumber || "",
        departmentId: contactData.departmentId || "",
        assignedToId: contactData.assignedToId || "",
        changedById: contactData.changedById || "",
        accountId: contactData.accountId || "",
        mobileNumber: contactData.mobileNumber || "",
      });
      console.log("ajja", response.data.data);
    } catch (error) {
      console.error("Error fetching contact data:", error);
      setErrors({ fetch: "Failed to fetch contact data." });
    }
  };

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
      const referenceData = response.data.data;

      const departmentMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "Department Types") {
          reference.referenceItems.forEach((item) => {
            departmentMap[item.id] = item.description;
          });
        }
      });
      setDepartmentTypes(departmentMap);
    } catch (error) {
      console.error("Error fetching table data:", error);
      setErrors({ fetchError: "Failed to fetch table data." });
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/User/all/true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setUserDetails(response.data.data);
      console.log("abaha", response.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
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
      console.log("Accounts fetched successfully:", accountList);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchContactData();
    fetchTableData();
    fetchUserDetails();
    fetchAccounts();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
    setErrors({ ...errors, [name]: "" });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      const dataToSend = { 
        id: contactId,
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        email: clientData.email,
        phoneNumber: clientData.phoneNumber,
        departmentId: clientData.departmentId,
        accountId: clientData.accountId,
        changedById: clientData.changedById,
        mobileNumber: clientData.mobileNumber,
       };

      const response = await axios.put(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Account/contact/update",
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Contact Updated successfully!");
        setTimeout(() => navigate("/getCustomerList"), 1500);
      } else {
        toast.error("Unexpected response from server.");
      }
      console.log("Customer Created data:", response.data);
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
                className="w-full border-2 border-gray-400 rounded p-2 bg-white"
                required
              >
                <option value="">Select Company</option>
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
                className="w-full border-2 border-gray-400 rounded p-2 bg-white"
                value={clientData.assignedToId}
                onChange={handleChange}
                required
              >
                <option value="">Select User</option>
                {userDetails &&
                  Array.isArray(userDetails) &&
                  userDetails.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.profile?.firstName} {user.profile?.lastName}
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
                <label className="block font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={clientData.firstName}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-400 rounded p-2"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="w-full md:w-[48%]">
                <label className="block font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={clientData.lastName}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-400 rounded p-2"
                />
              </div>

              {/* Email */}
              <div className="w-full md:w-[48%]">
                <label className="block font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={clientData.email}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-400 rounded p-2"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="w-full md:w-[48%]">
                <label className="block font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="number"
                  name="phoneNumber"
                  value={clientData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-400 rounded p-2"
                  required
                />
              </div>

              {/* Department Dropdown */}
              <div className="w-full md:w-[48%]">
                <label className="block font-medium text-gray-700">
                  Department
                </label>
                <select
                  name="departmentId"
                  className="w-full  border-2 border-gray-400 rounded p-2 bg-white"
                  value={clientData.departmentId}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {Object.entries(departmentTypes).map(([id, description]) => (
                    <option key={id} value={id}>
                      {description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Number */}
              <div className="w-full md:w-[48%]">
                <label className="block font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={clientData.mobileNumber}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-400 rounded p-2"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4">
          <button
            type="submit"
            className="bg-gray-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateContact;
