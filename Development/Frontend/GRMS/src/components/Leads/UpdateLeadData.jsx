import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdateLeadData() {
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
    changedById: "",
    statusId: "",
    notes: "",
    leadId: "",
    addressTypeId: ""
  });
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { leadId } = useParams();
  const [industries, setIndustries] = useState({});
  const [departments, setDepartments] = useState({});
  const [statusTypes, setStatusTypes] = useState({});
  const [countryTypes, setCountryTypes] = useState({});
  const [stateTypes, setStateTypes] = useState({});
  const [addressTypes, setAddressTypes] = useState({});

  useEffect(() => {
    fetchLeadDetails();
    fetchTableData();
    fetchUserDetails();
  }, [leadId]);

  const fetchLeadDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://grms-dev.gdinexus.com:49181/api/v1/marketing/Lead/one/${leadId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const leads = response.data?.data || response.data;
      const address =
        leads.addresses && leads.addresses.length > 0
          ? leads.addresses[0].address
          : {};

      setClientData({
        firstName: leads.firstName || "",
        lastName: leads.lastName || "",
        company: leads.company || "",
        email: leads.email || "",
        phoneNumber: leads.phoneNumber || "",
        assignedToId: leads.assignedToId || "",
        industryId: leads.industryId || "",
        departmentId: leads.departmentId || "",
        changedById: leads.createdById || "",
        statusId: leads.statusId || "",
        notes: leads.notes || "",
        address1: address.address1 || "",
        city: address.city || "",
        zip: address.zip || "",
        stateId: address.stateId || "",
        countryId: address.countryId || "",
        addressTypeId: address.addressTypeId || ""
      });
      console.log("mmm", response.data);
      // console.log("Full Address:", leads?.addresses?.[0]?.address);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch lead details.");
    } finally {
      setLoading(false);
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
      const referenceData = response.data?.data || response.data;
      const industriesMap = {};
      const departmentsMap = {};
      const statusMap = {};
      const countryMap = {};
      const stateMap = {};
      const addressMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "Industry Types") {
          reference.referenceItems.forEach((item) => {
            industriesMap[item.id] = item.description;
          });
        } else if (reference.name === "Department Types") {
          reference.referenceItems.forEach((item) => {
            departmentsMap[item.id] = item.description;
          });
        } else if (reference.name === "Lead Status") {
          reference.referenceItems.forEach((item) => {
            statusMap[item.id] = item.code;
          });
        } else if (reference.name === "Countries") {
          reference.referenceItems.forEach((item) => {
            countryMap[item.id] = item.description;
          });
        } else if (reference.name === "States") {
          reference.referenceItems.forEach((item) => {
            stateMap[item.id] = item.description;
          });
        } else if (reference.name === "Address Types") {
          reference.referenceItems.forEach((item) => {
            addressMap[item.id] = item.description;
          });
        }
      });
      setIndustries(industriesMap);
      setDepartments(departmentsMap);
      setStatusTypes(statusMap);
      setCountryTypes(countryMap);
      setStateTypes(stateMap);
      setAddressTypes(addressMap);
    } catch (error) {
      setError(error.message);
      toast.error("Fetching error message.");
      console.error("Error fetching Table data:", error);
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

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevClient) => ({ ...prevClient, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const updatedData = {
        ...clientData,
        userId: clientData.changedById,
        leadId: leadId
      };
      await axios.put(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Lead/update",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      toast.success("Lead updated successfully!");
      setTimeout(() => {
        navigate("/leadDetails");
      }, 1000);
      console.log("Lead updated successfully:", updatedData);
    } catch (error) {
      toast.error("Error updating lead data.");
    }
  };

  const handleConvertToOpportunity = () => {
    if (
      clientData.statusId &&
      statusTypes[clientData.statusId] === "Qualified"
    ) {
      navigate(`/createOpportunity/${leadId}`);
    } else {
      toast.error("Lead must be 'Qualified' to convert to opportunity");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

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
              <select
                name="assignedToId"
                value={clientData.assignedToId}
                onChange={handleChange}
                className="w-full border-2 border-gray-400 text-blue-700 rounded p-2"
              >
                <option value="" disabled>
                  Select Lead Owner
                </option>
                {userDetails &&
                  Array.isArray(userDetails) &&
                  userDetails.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.profile?.firstName} {user.profile?.lastName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Industry Dropdown */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Industry
              </label>
              <select
                name="industryId"
                value={clientData.industryId}
                onChange={handleChange}
                className="w-full border-2 border-gray-400 rounded p-2 bg-white"
              >
                <option value="" disabled>
                  Select Industry
                </option>
                {Object.entries(industries).map(([id, description]) => (
                  <option key={id} value={id}>
                    {description}
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
                className="w-full border-2 border-gray-400 rounded p-2 bg-white"
                value={clientData.statusId}
                onChange={handleChange}
                required
              >
                <option value=""disabled>Select Status</option>
                {Object.entries(statusTypes).map(([id, code]) => (
                  <option key={id} value={id}>
                    {code}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full border-gray-400 rounded ">
              {/* <label className="block font-medium text-gray-700">
                Add Address
              </label> */}

              <div className="w-full px-1">
               <label className="block font-medium text-gray-700">
                   Address 
                </label>
                <select
                  name="addressTypeId"
                  className="w-full border-2 border-gray-400 text-blue-700 rounded p-2 bg-white"
                  value={clientData.addressTypeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Address</option>
                  {Object.entries(addressTypes).map(([id, description]) => (
                    <option key={id} value={id}>
                      {description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full mt-4">
                <label className="block font-medium  text-gray-700 p-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="address1"
                  value={clientData.address1}
                  onChange={handleChange}
                  className="w-full border-2 text-blue-700 border-gray-400 rounded p-2"
                  placeholder="Address Line 1"
                />
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="w-full md:w-[48%]">
                  <label className="block font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={clientData.city}
                    onChange={handleChange}
                    className="w-full border-2 text-blue-700 border-gray-400 rounded p-2"
                    placeholder="City"
                  />
                </div>

                <div className="w-full md:w-[48%]">
                  <label className="block font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={clientData.zip}
                    onChange={handleChange}
                    className="w-full border-2 text-blue-700 border-gray-400 rounded p-2"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="w-full md:w-[48%]">
                  <label className="block font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    name="countryId"
                    value={clientData.countryId}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-400 rounded p-2 bg-white"
                  >
                    <option value="">Select Country</option>
                    {Object.entries(countryTypes).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full md:w-[48%]">
                  <label className="block font-medium text-gray-700">
                    State
                  </label>
                  <select
                    name="stateId"
                    value={clientData.stateId}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-400 rounded p-2 bg-white"
                  >
                    <option value="">Select State</option>
                    {Object.entries(stateTypes).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
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
                  <option value="" disabled>
                    Select Department
                  </option>
                  {Object.entries(departments).map(([id, description]) => (
                    <option key={id} value={id}>
                      {description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discussion */}
              <div className="w-full">
                 <label className="block font-medium text-gray-700">
                   Notes:
                 </label>
                 <textarea
                   name="notes"
                   value={clientData.notes}
                   onChange={handleChange}
                   placeholder="Discussion"
                   className="w-full border-2 border-gray-400  text-blue-700 rounded p-4"
                   rows={4}
                 />
               </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <button
            className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
            onClick={() => navigate("/leadDetails")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Update Lead
          </button>
          {statusTypes[clientData.statusId] === "Qualified" && (
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
              onClick={handleConvertToOpportunity}
            >
              Convert to Opportunity
            </button>
          )}  
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default UpdateLeadData;
