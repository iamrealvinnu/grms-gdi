//
// NAME:			  MarketingCreate.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  14/03/2025
// PURPOSE:			Marketing manager Create User
//
//

// Imports

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode"; // Library for decoding JWT tokens
import withAuth from "../withAuth";

function MarketingCreate() {
  const [formMarketingData, setFormMarketingData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: ""
  });
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState("");

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
        // console.log("ssb", userId);
      } catch (error) {
        console.error("Error decoding token:", error); // Log error if token decoding fails
      }
    }
  }, []); // Empty dependency array ensures this runs only once when component mounts

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormMarketingData({ ...formMarketingData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formMarketingData.name) {
      newErrors.name = "Campaign name is required.";
      isValid = false;
    }
    if (!formMarketingData.description) {
      newErrors.description = "Campaign description is required.";
      isValid = false;
    }
    if (!formMarketingData.startDate) {
      newErrors.startDate = "Campaign StartDate is required.";
      isValid = false;
    }
    if (!formMarketingData.endDate) {
      newErrors.endDate = " Campaign endDate must be filled.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();

    if (!validForm()) return;

    try {
      const token = localStorage.getItem("accessToken");

      const requestData = {
        ...formMarketingData,
        createdById: user // Ensure this matches the required ID format
      };

      const response = await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Campaign/create",
        requestData, // Send form data as the request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the token is correctly passed
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Campaign created successfully!");
        setFormMarketingData({ name: "", description: "", startDate: "", endDate: "" });
      } else {
        toast.error("Failed to create campaign.");
      }
    } catch (error) {
      console.error("Error fetching the data:", error);
      toast.error("Error creating the campaign. Please try again.");
    }
  };

  const clearDate = (field) => {
    setFormMarketingData((prevState) => ({
      ...prevState,
      [field]: "",
    }));
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Create Campaign
        </h3>
        <form className="space-y-4" onSubmit={handleCampaignSubmit}>
          <div>
            <label className="block text-gray-700 font-medium">
              Campaign Name:
            </label>
            <input
              type="text"
              name="name"
              value={formMarketingData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Campaign Description:
            </label>
            <textarea
              name="description"
              value={formMarketingData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              rows="4" // Adjust the number of rows as needed
              placeholder="Enter campaign description..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Start Date:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                name="startDate"
                value={formMarketingData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => clearDate("startDate")}
                className="px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Clear
              </button>
            </div>
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="text-gray-700 font-medium mb-1">End Date:</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                name="endDate"
                value={formMarketingData.endDate}
                onChange={handleChange}
                className="px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-300"
              />
              <button
                type="button"
                onClick={() => clearDate("endDate")}
                className="px-3 py-2 text-white bg-red-500 hover:bg-red-600 transition duration-200 rounded-lg"
              >
                Clear
              </button>
            </div>
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(MarketingCreate);
