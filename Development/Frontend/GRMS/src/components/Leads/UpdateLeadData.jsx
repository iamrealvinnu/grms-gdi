import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateLeadData() {
  const [tableStatusData, setTableStatusData] = useState([]);
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    status:"",
    email: "",
    phoneNumber: "",
    assignedToId: "",
    address1: "",
    address2: "",
    zip: "",
    stateId: "",
    countryId: "",
    industryId: "",
    departmentId: "",
    createdById: "",
    notes: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { leadId } = useParams();
  const [states, setStates] = useState({});
  const [countries, setCountries] = useState({});
  const [industries, setIndustries] = useState({});
  const [departments, setDepartments] = useState({});

  useEffect(() => {
    fetchLeadDetails();
    fetchTableData();
  }, [leadId]);

  const fetchLeadDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://grms-dev.gdinexus.com:49181/api/v1/marketing/Lead/one/${leadId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const leads = response.data?.data || response.data;
      setClientData({
        firstName: leads.firstName || "",
        lastName: leads.lastName || "",
        company: leads.company || "",
        email: leads.email || "",
        phoneNumber: leads.phoneNumber || "",
        assignedToId: leads.assignedToId || "",
        address1: leads.address1 || "",
        address2: leads.address2 || "",
        zip: leads.zip || "",
        stateId: leads.stateId || "",
        countryId: leads.countryId || "",
        industryId: leads.industryId || "",
        departmentId: leads.departmentId || "",
        createdById: leads.createdById || "",
      })
      console.log('mmm',response.data);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const leadStatusTypes =
    tableStatusData.find((item) => item.name === "Lead Status")
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
      const referenceData = response.data?.data || response.data;
      const statesMap = {};
      const countriesMap = {};
      const industriesMap = {};
      const departmentsMap = {};

      referenceData.forEach((reference) =>{
        if (reference.name === "states") {
          reference.referenceItems.forEach((item) => {
            statesMap[item.id] = item.description;
          });
        } else if (reference.name === "Countries") {
          reference.referenceItems.forEach((item) =>{
            countriesMap[item.id] = item.description;
          });
        } else if (reference.name === "Industry Types") {
          reference.referenceItems.forEach((item) =>{
            industriesMap[item.id] = item.description;
          });
        } else if (reference.name === "Department Types") {
          reference.referenceItems.forEach((item) =>{
            departmentsMap[item.id] = item.description;
          });
        }
      })
      setStates(statesMap);
      setCountries(countriesMap);
      setIndustries(industriesMap);
      setDepartments(departmentsMap);
      setTableStatusData(response.data.data);
    } catch (error) {
      setError(error.message);
      toast.error("Fetching error message.")
      console.error("Error fetching Table data:", error);
    }
  };

   // Handle Input Change
   const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };



  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <form>
      {/* Company Details Section */}
      <div className="p-4">
        <h3 className="text-2xl font-semibold mb-4">Company Details</h3>
        <div className="flex flex-wrap gap-4">
          {/* Company Name */}
          <div className="w-full md:w-[48%]">
            <label className="block font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              name="company"
              value={clientData.company}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full border-2 border-gray-400  text-blue-700 rounded p-2"
            />
          </div>

          {/* Lead Owner */}
          <div className="w-full md:w-[48%]">
            <label className="block font-medium text-gray-700">
              Lead Owner
            </label>
            <input
              type="text"
              name="assignedToId"
              value={clientData.assignedToId}
              onChange={handleChange}
              placeholder="Lead Owner"
              className="w-full border-2 border-gray-400  text-blue-700 rounded p-2"
            />
          </div>

          {/* Company Email */}
          <div className="w-full md:w-[48%]">
            <label className="block font-medium text-gray-700">
              Lead Status
            </label>
            <select
              type="text"
              name="status"
              value={clientData.status}
              className="w-full border-2 border-gray-400 rounded p-2"
            >
              <option value="" disabled selected>
                Select Status
              </option>
              {leadStatusTypes.map((leadStatus) => (
                <option key={leadStatus.id} value={leadStatus.id}>
                  {leadStatus.code}
                </option>
              ))}
            </select>
          </div>

          {/* Industry Dropdown */}
          <div className="w-full md:w-[48%]">
            <label className="block font-medium text-gray-700">Industry</label>
            <select
              name="industryId"
              value={clientData.industryId}
              onChange={handleChange}
              className="w-full border-2 border-gray-400 rounded p-2 bg-white"
            >
              <option value="" disabled selected>
                Select Industry
              </option>
              {Object.entries(industries).map(([id,description]) => (
                <option key={id} value={id}>
                  {description}
                </option>
              ))}
            </select>
          </div>

          {/* Address Section */}
           {/* Address Section */}
           <div className="w-full border-dashed border-2 border-gray-400 rounded p-4">
              <label className="block font-medium text-gray-700">
                Add Address
              </label>

              {/* Street */}
              <input
                type="text"
                name="address1"
                placeholder="Street"
                className="w-full border-b-2 border-gray-400  text-blue-700 focus:outline-none p-2 mb-2"
                value={clientData.address1}
                onChange={handleChange}
              />

              {/* Town */}
              <input
                type="text"
                name="address2"
                placeholder="Town"
                className="w-full border-b-2 border-gray-400  text-blue-700 focus:outline-none p-2 mb-2"
                value={clientData.address2}
                onChange={handleChange}
              />

              {/* Pincode */}
              <input
                type="text"
                name="zip"
                placeholder="Pincode"
                className="w-full border-b-2 border-gray-400  text-blue-700 focus:outline-none p-2 mb-2"
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
                  {Object.entries(states).map(([id,description]) => (
                    <option key={id} value={id}>
                      {description}
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
                  {Object.entries(countries).map(([id,description]) => (
                    <option key={id} value={id}>
                      {description}
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
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={clientData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full border-2 border-gray-400  text-blue-700 rounded p-2"
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
                placeholder="Last Name"
                className="w-full border-2 border-gray-400  text-blue-700 rounded p-2"
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
                placeholder="Email"
                className="w-full border-2 border-gray-400  text-blue-700 rounded p-2"
              />
            </div>

            {/* Phone Number */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="number"
                name="phoneNumber"
                value={clientData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border-2 border-gray-400  text-blue-700 rounded p-2"
              />
            </div>

            {/* Department Dropdown */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Department
              </label>
              <select
                name="departmentId"
                value={clientData.departmentId}
                onChange={handleChange}
                className="w-full border-2 border-gray-400 rounded p-2 bg-white"
              >
                <option value="" disabled selected>
                  Select Department
                </option>
                {Object.entries(departments).map(([id,description]) => (
                  <option key={id} value={id}>
                    {description}
                  </option>
                ))}
              </select>
            </div>

            {/* Discussion */}
            <div className="w-full col-span-2">
              <label className="block font-medium text-gray-700">Notes:</label>
              <input
                type="text"
                name="notes"
                value={clientData.notes}
                onChange={handleChange}
                // placeholder="Discussion"
                className="w-full border-2 border-gray-400  text-blue-700 rounded p-4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
          onClick={() => navigate("/clientDetails")}
        >
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          Save
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          Convert
        </button>
      </div>
      </form>
    </div>
  );
}

export default UpdateLeadData;
