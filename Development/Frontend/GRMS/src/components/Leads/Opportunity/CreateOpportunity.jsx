import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Library for decoding JWT tokens
import axios from "axios";

function CreateOpportunity() {
  const [formOpportunityData, setFormOpportunityData] = useState({
    name: "",
    estimatedValue: "",
    status: "",
    closeDate: "",
  });
  const [tableOpportunityStatusData, setTableOpportunityStatusData] = useState(
    []
  );
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState("");

  const opportunityTypes =
    tableOpportunityStatusData.find(
      (item) => item.name === "Opportunity Stages"
    )?.referenceItems || [];

  const fetchMasterTableData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/Reference/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTableOpportunityStatusData(response.data.data);
      console.log("fetched table ",response.data.data);
    } catch (error) {
      console.error("Error fetching Master Table data:", error);
    }
  };

  useEffect(() => {
    fetchMasterTableData();
  }, []);

  useEffect(() => {
    // Retrieve the JWT token from local storage
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        // Decode the token to extract user information
        const decodedToken = jwtDecode(token);
        // Extract the given name from the token, fallback to "User" if not found
        const userId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] || "User";
        setUser(userId);
      } catch (error) {
        console.error("Error decoding token:", error); // Log error if token decoding fails
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormOpportunityData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formOpportunityData.name) {
      newErrors.name = "Opportunity name is required.";
      isValid = false;
    }
    if (!formOpportunityData.estimatedValue) {
      newErrors.estimatedValue = "Estimated value is required.";
      isValid = false;
    }
    if (!formOpportunityData.status) {
      newErrors.status = "Opportunity status is required.";
      isValid = false;
    }
    if (!formOpportunityData.closeDate) {
      newErrors.closeDate = "Opportunity close date must be filled.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();

    if (!validForm()) {
      return;
    }

    alert("Opportunity created successfully!");
  };

  const clearDate = (field) => {
    setFormOpportunityData((prevState) => ({
      ...prevState,
      [field]: "",
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-6 sm:p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
           Add Opportunity
        </h3>
        <form className="space-y-4" onSubmit={handleCampaignSubmit}>
          <div>
            <label className="block text-gray-700 font-medium">
              Opportunity Name:
            </label>
            <input
              type="text"
              name="name"
              value={formOpportunityData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Estimated Value:
            </label>
            <input
              type="text"
              name="estimatedValue"
              value={formOpportunityData.estimatedValue}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter estimated value..."
            />
            {errors.estimatedValue && (
              <p className="text-red-500 text-sm">{errors.estimatedValue}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Opportunity Stages:
            </label>
            <select
              name="status"
              value={formOpportunityData.status}
              onChange={handleChange}
              className="w-full border-2 border-gray-400 rounded p-2 bg-white sm:text-sm"
            >
              <option value="" disabled>
                Select an option
              </option>
              {opportunityTypes.map((opportunityType) => (
                <option key={opportunityType.id} value={opportunityType.id}>
                  {opportunityType.code}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="text-gray-700 font-medium mb-1">Close Date:</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="date"
                name="closeDate"
                value={formOpportunityData.closeDate}
                onChange={handleChange}
                className="px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-300 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => clearDate("closeDate")}
                className="px-3 py-2 text-white bg-indigo-500 hover:bg-red-600 transition duration-200 rounded-lg sm:w-auto"
              >
                Clear
              </button>
            </div>
            {errors.closeDate && (
              <p className="text-red-500 text-sm mt-1">{errors.closeDate}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateOpportunity;
