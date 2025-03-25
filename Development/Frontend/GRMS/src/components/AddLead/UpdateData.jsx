import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UpdateData() {
  const [tableIndustryData, setTableIndustryData] = useState([]);
  const [user,setUser] = useState("");
  const [clientData,setClientData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phoneNumber: "",
    mobileNumber: "",
  })
  const navigate = useNavigate();

  const industriesTypes =
    tableIndustryData.find((item) => item.name === "Industry Types")
      ?.referenceItems || [];

  const leadStatusTypes =
  tableIndustryData.find((item) => item.name === "Lead Status")?.referenceItems || [];

  const DepartmentTypes =
  tableIndustryData.find((item) => item.name === "Department Types")?.referenceItems || [];

  const AddressTypes =
  tableIndustryData.find((item) => item.name === "Address Types")?.referenceItems || [];

  useEffect(() =>{
    const token = localStorage.getItem("accessToken");
    if(token){
      try {
        const decodedToken = jwtDecode(token);
      const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || "User";
      setUser(userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  },[]);

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
      console.log("fetched tableData:", response.data.data);
    } catch (error) {
      console.error("Error fetching Table data:", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Company Details Section */}
      <div className="p-4">
        <h3 className="text-2xl font-semibold mb-4">Company Details</h3>
        <form className="flex flex-wrap gap-4">
          {/* Company Name */}
          <div className="w-full md:w-[48%]">
            <label className="block font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Company Name"
              className="w-full border-2 border-gray-400 rounded p-2"
            />
          </div>

          {/* Lead Owner */}
          <div className="w-full md:w-[48%]">
            <label className="block font-medium text-gray-700">
              Lead Owner
            </label>
            <input
              type="text"
              placeholder="Lead Owner"
              className="w-full border-2 border-gray-400 rounded p-2"
            />
          </div>

          {/* Company Email */}
          <div className="w-full md:w-[48%]">
            <label className="block font-medium text-gray-700">
              Company Status
            </label>
            <select
              type="text"
              name="status"
              className="w-full border-2 border-gray-400 rounded p-2"
            >
              <option value="" disabled selected>Select Status</option>
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
              className="w-full border-2 border-gray-400 rounded p-2 bg-white"
            >
              <option value=""disabled selected>Select Industry</option>
              {industriesTypes.map((industriesType) => (
                <option key={industriesType.id} value={industriesType.id}>
                  {industriesType.description}
                </option>
              ))}
            </select>
          </div>

          {/* Company Contact Number */}
          <div className="w-full md:w-[48%]">
            <label className="block font-medium text-gray-700">
              Company Contact Number
            </label>
            <input
              type="text"
              placeholder="Company Contact Number"
              className="w-full border-2 border-gray-400 rounded p-2"
            />
          </div>

          {/* Address Section */}
          <div className="w-full md:w-[48%]">
            <label className="block font-medium text-gray-700">Address</label>
              <select
              name="AddressId"
              className="w-full border-2 border-gray-400 rounded p-2 bg-white"
              >
                <option value="" disabled selected>Select Address</option>
                {AddressTypes.map((AddressType) =>(
                  <option key={AddressType.id} value={AddressType.id}>{AddressType.description}</option>
                ))}
              </select>
          </div>
        </form>
      </div>

      {/* Contact Information Section */}
      <div className="mb-6 border-b pb-4 mt-6">
        <div className="p-4">
          <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
          <form className="flex flex-wrap gap-4">
            {/* First Name */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                placeholder="First Name"
                className="w-full border-2 border-gray-400 rounded p-2"
              />
            </div>

            {/* Last Name */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                className="w-full border-2 border-gray-400 rounded p-2"
              />
            </div>

            {/* Email */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full border-2 border-gray-400 rounded p-2"
              />
            </div>

            {/* Phone Number */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="number"
                placeholder="Phone Number"
                className="w-full border-2 border-gray-400 rounded p-2"
              />
            </div>

            {/* Department Dropdown */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Department
              </label>
              <select
              name="departmentId"
              className="w-full border-2 border-gray-400 rounded p-2 bg-white"
              >
                <option value="" disabled selected>Select Department</option>
                {DepartmentTypes.map((departmentType) => (
                  <option key={departmentType.id} value={departmentType.id}>
                    {departmentType.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Discussion */}
            <div className="w-full col-span-2">
              <label className="block font-medium text-gray-700">Notes:</label>
              <input
                type="text"
                // placeholder="Discussion"
                className="w-full border-2 border-gray-400 rounded p-4"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
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
    </div>
  );
}

export default UpdateData;
