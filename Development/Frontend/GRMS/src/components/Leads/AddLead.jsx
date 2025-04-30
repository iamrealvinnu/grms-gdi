//
// NAME:			  AddLead.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  28/03/2025
// PURPOSE:			Lead Creation Form
//
//

// Imports
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddLead() {
  const [tableIndustryData, setTableIndustryData] = useState([]);
  const [users, setUsers] = useState({});
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phoneNumber: "",
    assignedToId: "",
    address1: "",
    city: "",
    zip: "",
    stateId: "",
    countryId: "",
    industryId: "",
    departmentId: "",
    createdById: "",
    addressTypeId: "",
    statusId: "",
    notes: ""
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  const industriesTypes =
    tableIndustryData.find((item) => item.name === "Industry Types")
      ?.referenceItems || [];

  const DepartmentTypes =
    tableIndustryData.find((item) => item.name === "Department Types")
      ?.referenceItems || [];

  const StateTypes =
    tableIndustryData.find((item) => item.name === "States")?.referenceItems ||
    [];

  const CountryTypes =
    tableIndustryData.find((item) => item.name === "Countries")
      ?.referenceItems || [];

  const AddressTypes =
    tableIndustryData.find((item) => item.name === "Address Types")
      ?.referenceItems || [];

  const statusTypes =
    tableIndustryData.find((item) => item.name === "Lead Status")
      ?.referenceItems || [];

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
      // console.log("fetched tableData:", response.data.data);
    } catch (error) {
      console.error("Error fetching Table data:", error);
    }
  };

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
      setUsers(response.data.data); // Assuming the response has a `data` field
      // console.log("Fetched users:", response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchTableData();
    fetchUsers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const name =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] || "User";
        setCurrentUserId(name);
        // console.log('nnn',name);
      } catch (error) {
        console.error("Error decoding token:", error); // Log error if token decoding fails
      }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", clientData);

    // Validate required fields
    if (
      !clientData.company ||
      !clientData.firstName ||
      !clientData.email ||
      !clientData.phoneNumber
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const dataToSend = {
        ...clientData,
        createdById: currentUserId
      };
      const response = await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Lead/create",
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("Response:", response);

      if (response.status === 201 || response.status === 200) {
        toast.success("Client added successfully!");
        setTimeout(() => {
          navigate("/leadDetails");
        }, 1500);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error saving client:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
        toast.error(
          `Failed to add client: ${
            error.response.data.message || error.message
          }`
        );
      } else {
        toast.error("Network error or server not responding.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <form onSubmit={handleSubmit}>
        {/* Company Details Section */}
        <div className="p-4">
          <h3 className="text-2xl font-semibold mb-4">Company Details</h3>
          <div className="flex flex-wrap gap-4">
            {/* Company Name */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                placeholder="Company Name"
                className="w-full border-dashed border-2 border-gray-400 rounded p-2"
                value={clientData.company}
                onChange={handleChange}
                required
              />
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
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.profile?.firstName}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading users...</option>
                )}
              </select>
            </div>

            {/* Industry Dropdown */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                name="industryId"
                className="w-full border-dashed border-2 border-gray-400 rounded p-2 bg-white"
                value={clientData.industryId}
                onChange={handleChange}
                required
              >
                <option value="">Select Industry</option>
                {industriesTypes.map((industry) => (
                  <option key={industry.id} value={industry.id}>
                    {industry.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Lead Status <span className="text-red-500">*</span>
              </label>
              <select
                name="statusId"
                className="w-full border-dashed border-2 border-gray-400 rounded p-2 bg-white"
                value={clientData.statusId}
                onChange={handleChange}
                required
              >
                <option value="">Select Industry</option>
                {statusTypes.map((statusType) => (
                  <option key={statusType.id} value={statusType.id}>
                    {statusType.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Address Section */}
            <div className="w-full border-dashed border-2 border-gray-400 rounded p-4">
              <label className="block font-medium text-gray-700">
                Add Address
              </label>

              <div className="w-full">
                <label className="block font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <select
                  name="addressTypeId"
                  className="w-full border-dashed border-2 border-gray-400 rounded p-2 bg-white"
                  value={clientData.addressTypeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Address</option>
                  {AddressTypes.map((addressType) => (
                    <option key={addressType.id} value={addressType.id}>
                      {addressType.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Street */}
              <input
                type="text"
                name="address1"
                placeholder="Street"
                className="w-full border-b-2 border-gray-400 focus:outline-none p-2 mb-2"
                value={clientData.address1}
                onChange={handleChange}
              />

              {/* Town */}
              <input
                type="text"
                name="city"
                placeholder="Town"
                className="w-full border-b-2 border-gray-400 focus:outline-none p-2 mb-2"
                value={clientData.city}
                onChange={handleChange}
              />

              {/* Pincode */}
              <input
                type="text"
                name="zip"
                placeholder="Pincode"
                className="w-full border-b-2 border-gray-400 focus:outline-none p-2 mb-2"
                value={clientData.zip}
                onChange={handleChange}
              />

              {/* State */}
              <div className="w-full border-b-2 p-2 bg-white">
                <label className="block font-medium text-gray-700">State</label>
                <select
                  name="stateId"
                  className="w-full p-2 bg-white"
                  value={clientData.stateId}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {StateTypes.map((StateType) => (
                    <option key={StateType.id} value={StateType.id}>
                      {StateType.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Dropdown */}
              <div className="w-full border-b-2 p-2 bg-white">
                <label className="block font-medium text-gray-700">
                  Country
                </label>
                <select
                  name="countryId"
                  className="w-full p-2 bg-white"
                  value={clientData.countryId}
                  onChange={handleChange}
                >
                  <option value="">Select Country</option>
                  {CountryTypes.map((countryType) => (
                    <option key={countryType.id} value={countryType.id}>
                      {countryType.description}
                    </option>
                  ))}
                </select>
              </div>
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
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full border-2 border-dashed border-gray-400 rounded p-2"
                  value={clientData.firstName}
                  onChange={handleChange}
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
                  placeholder="Last Name"
                  className="w-full border-2 border-dashed border-gray-400 rounded p-2"
                  value={clientData.lastName}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="w-full md:w-[48%]">
                <label className="block font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full border-2 border-dashed border-gray-400 rounded p-2"
                  value={clientData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="w-full md:w-[48%]">
                <label className="block font-medium text-gray-700">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className="w-full border-2 border-dashed border-gray-400 rounded p-2"
                  value={clientData.phoneNumber}
                  onChange={handleChange}
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

              {/* Discussion */}
              <div className="w-full ">
                <label className="block font-medium text-gray-700">notes</label>
                <textarea
                  type="text"
                  name="notes"
                  placeholder="Discussion"
                  className="w-full border-dashed border-2 border-gray-400 rounded p-2"
                  value={clientData.notes}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
            onClick={() => navigate("/clientDetails")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AddLead;
