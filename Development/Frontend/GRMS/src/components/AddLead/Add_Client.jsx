import axios from "axios";
import React, { useEffect, useState } from "react";

function Add_Client() {
  const [tableIndustryData, setTableIndustryData] = useState([]);

  const industriesTypes =
    tableIndustryData.find((item) => item.name === "Industry Types")
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
              className="w-full border-dashed border-2 border-gray-400 rounded p-2"
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
              className="w-full border-dashed border-2 border-gray-400 rounded p-2"
            />
          </div>

          {/* Company Email */}
          <div className="w-full md:w-[48%]">
            <label className="block font-medium text-gray-700">
              Company Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="w-full border-dashed border-2 border-gray-400 rounded p-2"
            />
          </div>

          {/* Industry Dropdown */}
          <div className="w-full md:w-[48%]">
            <label className="block font-medium text-gray-700">Industry</label>
            <select
              name="industryId"
              className="w-full border-dashed border-2 border-gray-400 rounded p-2 bg-white"
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
              className="w-full border-dashed border-2 border-gray-400 rounded p-2"
            />
          </div>

          {/* Address Section */}
          <div className="w-full border-dashed border-2 border-gray-400 rounded p-4">
            <label className="block font-medium text-gray-700">Address</label>

            {/* Street */}
            <input
              type="text"
              placeholder="Street"
              className="w-full border-b-2 border-gray-400 focus:outline-none p-2 mb-2"
            />

            {/* Town */}
            <input
              type="text"
              placeholder="Town"
              className="w-full border-b-2 border-gray-400 focus:outline-none p-2 mb-2"
            />

            {/* State */}
            <input
              type="text"
              placeholder="State"
              className="w-full border-b-2 border-gray-400 focus:outline-none p-2 mb-2"
            />

            {/* Pincode */}
            <input
              type="text"
              placeholder="Pincode"
              className="w-full border-b-2 border-gray-400 focus:outline-none p-2 mb-2"
            />

            {/* Country Dropdown */}
            <select className="w-full border-b-2 border-gray-400 focus:outline-none p-2 bg-white">
              <option value="" disabled selected>
                Select Country
              </option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Sri Lanka">Sri Lanka</option>
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
                className="w-full border-dashed border-2 border-gray-400 rounded p-2"
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
                className="w-full border-dashed border-2 border-gray-400 rounded p-2"
              />
            </div>

            {/* Email */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full border-dashed border-2 border-gray-400 rounded p-2"
              />
            </div>

            {/* Phone Number */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="number"
                placeholder="Phone Number"
                className="w-full border-dashed border-2 border-gray-400 rounded p-2"
              />
            </div>

            {/* Department Dropdown */}
            <div className="w-full md:w-[48%]">
              <label className="block font-medium text-gray-700">
                Department
              </label>
              <select className="w-full border-dashed border-2 border-gray-400 rounded p-2 bg-white">
                <option value="" disabled selected>
                  Select Department
                </option>
                <option value="Account">Account</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
                <option value="Director">Director</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            {/* Discussion */}
            <div className="w-full col-span-2">
              <label className="block font-medium text-gray-700">Notes:</label>
              <input
                type="text"
                // placeholder="Discussion"
                className="w-full border-dashed border-2 border-gray-400 rounded p-4"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500">
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  );
}

export default Add_Client;
