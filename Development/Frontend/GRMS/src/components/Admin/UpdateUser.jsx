//
// NAME:			UpdateUser.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			12/03/2025
// PURPOSE:			User's UpateList
//
//

// Imports
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import withAuth from '../withAuth';

function UpdateUser() {
  const [user, setUser] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    userTypeId: "",
    genderId: "",
    countryId: "",
    phoneNumber: "",
    mobileNumber: "",
    claims: [],
  });

  const navigate = useNavigate();
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genders, setGenders] = useState({});
  const [countries, setCountries] = useState({});
  const [userTypes, setUserTypes] = useState({});
  const [claimTypes, setClaimTypes] = useState({});

  useEffect(() => {
    fetchUserDetails();
    fetchReferenceData();
  }, [userId]);

  // Fetch User Data
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authorization token is missing.");
      }

      const response = await axios.get(
        `https://grms-dev.gdinexus.com:49181/api/v1/User/one/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = response.data?.data || response.data;
      setUser({
        firstName: userData.profile?.firstName || "",
        lastName: userData.profile?.lastName || "",
        userTypeId: userData.profile?.userTypeId || "",
        genderId: userData.profile?.genderId || "",
        countryId: userData.profile?.countryId || "",
        phoneNumber: userData.phoneNumber ?? "",
        mobileNumber: userData.mobileNumber ?? "",
        claims: userData.claims?.map((claim) => claim.claimValue) || [],
      });
      setLoading(false);
      console.log('fetch User data:',response.data)
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authorization token is missing.");
      }

      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/Reference/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const referenceData = response.data?.data || response.data;

      const gendersMap = {};
      const countriesMap = {};
      const userTypesMap = {};
      const claimTypesMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "Gender Types") {
          reference.referenceItems.forEach((item) => {
            gendersMap[item.id] = item.description;
          });
        } else if (reference.name === "Countries") {
          reference.referenceItems.forEach((item) => {
            countriesMap[item.id] = item.description;
          });
        } else if (reference.name === "User Types") {
          reference.referenceItems.forEach((item) => {
            userTypesMap[item.id] = item.description;
          });
        } else if (reference.name === "Claim Types") {
          reference.referenceItems.forEach((item) => {
            claimTypesMap[item.id] = item.description;
          });
        }
      });

      setGenders(gendersMap);
      setCountries(countriesMap);
      setUserTypes(userTypesMap);
      setClaimTypes(claimTypesMap);

    } catch (error) {
      setError(error.message);
      toast.error("Fetching error message.")
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Handle Claims Input (Multi-select)
  const handleClaimChange = (e) => {
    const { value, checked } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      claims: checked
        ? [...prevUser.claims, value]
        : prevUser.claims.filter((claim) => claim !== value),
    }));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Authorization token is missing.");
  
      const updatedUser = { ...user, userId };  // Ensure userId is included
  
      await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/User/update",
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success("User details updated successfully!");
      navigate("/userGetAllList");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating user details.");
    }
  };
  

  if (loading) {
    return <p className="text-center text-lg">Loading user details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Edit User Data
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 font-medium">
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 font-medium">
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* User Type */}
          <div>
            <label className="block text-gray-700 font-medium">
              User Type:
            </label>
            <select
              name="userTypeId"
              value={user.userTypeId}
              onChange={handleChange}
              className="mt-1 px-4 py-2 w-full border rounded-lg"
            >
              <option value="">Select User Type</option>
              {Object.entries(userTypes).map(([id, description]) => (
                <option key={id} value={id}>
                  {description}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium">Gender:</label>
            <select
              name="genderId"
              value={user.genderId}
              onChange={handleChange}
              className="mt-1 px-4 py-2 w-full border rounded-lg"
            >
              <option value="">Select Gender</option>
              {Object.entries(genders).map(([id, description]) => (
                <option key={id} value={id}>
                  {description}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-gray-700 font-medium">Country:</label>
            <select
              name="countryId"
              value={user.countryId}
              onChange={handleChange}
              className="mt-1 px-4 py-2 w-full border rounded-lg"
            >
              <option value="">Select Country</option>
              {Object.entries(countries).map(([id, description]) => (
                <option key={id} value={id}>
                  {description}
                </option>
              ))}
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium">
              Phone Number:
            </label>
            <input
              type="number"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-gray-700 font-medium">
              Mobile Number:
            </label>
            <input
              type="number"
              name="mobileNumber"
              value={user.mobileNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Claims */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Claims</label>
            <div className="mt-1">
              {Object.entries(claimTypes).map(([id, description]) => (
                <div key={id} className="flex items-center">
                  <input
                    type="checkbox"
                    name="claims"
                    value={id}
                    checked={user.claims.includes(id)}
                    onChange={handleClaimChange}
                    className="mr-2"
                  />
                  <label>{description}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate("/userGetAllList")}
              className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(UpdateUser);
