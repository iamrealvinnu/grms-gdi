//
// NAME:			  Profile.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  02/12/2025
// PURPOSE:			User's Profile Page 
//

// Imports
import React, { useState, useEffect } from "react";
import withAuth from '../withAuth';
import { FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    userTypeId: "",
    email: "",
    phoneNumber: "",
    genderId: "",
  });

  const { userId } = useParams();
  const [error, setError] = useState("");
  const [genderMap, setGenderMap] = useState({});
  const [userTypes, setUserTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
    fetchReferenceData();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Authorization token is missing.");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/User/one/${userId}`,
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
        email: userData.email || "",
      });

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Authorization token is missing.");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/Reference/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const referenceData = response.data?.data || response.data;
      const gendersMap = {};
      const userTypesMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "User Types") {
          reference.referenceItems.forEach((item) => {
            userTypesMap[item.id] = item.description;
          });
        } else if (reference.name === "Gender Types") {
          reference.referenceItems.forEach((item) => {
            gendersMap[item.id] = item.description;
          });
        }
      });

      setUserTypes(userTypesMap);
      setGenderMap(gendersMap);
    } catch (error) {
      setError(error.message);
      toast.error("Fetching reference data failed.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Authorization token is missing.");

      const updatedUser = { ...user, userId };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/User/update`,
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("User details updated successfully!");
      setIsEditing(false); // exit editing mode
      fetchUserDetails(); // refresh data
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
    <div className="max-w-4xl mx-auto bg-gray-300 rounded-lg shadow-md p-6 mt-5 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Section */}
        <div className="flex flex-col bg-white p-5 rounded-md items-center md:items-start text-center md:text-left">
          <img
            className="rounded-full w-24 h-24 md:w-32 md:h-32 object-cover border-4 border-gray-400"
            src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
            alt="Profile"
          />
          <p className="text-lg font-semibold mt-3">{user.firstName}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">{userTypes[user.userTypeId] || "N/A"}</p>
        </div>

        {/* Right Section */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="grid gap-4">
            {/* Full Name */}
            <div className="flex justify-between items-start">
              <span className="font-medium mt-1">Full Name:</span>
              <span className="text-gray-700 w-2/3">
                {isEditing ? (
                  <div className="flex flex-col md:flex-row gap-2 px-3">
                    <input
                      type="text"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleChange}
                      className="border-b border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 w-full md:w-1/2"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleChange}
                      className="border-b border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 w-full md:w-1/2"
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <span className="flex flex-col md:flex-row gap-1 px-3">
                    <span>{user.firstName}</span>
                    <span>{user.lastName}</span>
                  </span>
                )}
              </span>
            </div>

            {/* Email */}
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span className="text-gray-700 px-3">
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className="border-b border-gray-500 bg-transparent focus:outline-none focus:border-blue-600"
                  />

                ) : (
                  user.email
                )}
              </span>
            </div>

            {/* Gender */}
            <div className="flex justify-between">
              <span className="font-medium">Gender:</span>
              <span className="text-gray-700">
                {isEditing ? (
                  <select
                    name="genderId"
                    value={user.genderId}
                    onChange={handleChange}
                    className="border-b border-gray-500 bg-transparent focus:outline-none focus:border-blue-600"
                  >
                    <option value="">Select</option>
                    {Object.entries(genderMap).map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>

                ) : (
                  genderMap[user.genderId] || "N/A"
                )}
              </span>
            </div>

            {/* Phone */}
            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span className="text-gray-700">
                {isEditing ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleChange}
                    className="border-b border-gray-500 bg-transparent focus:outline-none focus:border-blue-600"
                  />

                ) : (
                  user.phoneNumber
                )}
              </span>
            </div>

            {/* Static Fields (Optional) */}
            <div className="flex justify-between">
              <span className="font-medium">Date Of Birth:</span>
              <span className="text-gray-700">01-01-1977</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Address</span>
              <span className="text-gray-700">
                Erode <br />
                Tirupur <br />
                Coimbatore
              </span>
            </div>
          </div>

          {/* Edit / Save / Cancel Buttons */}
          <div className="mt-5 flex justify-end gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
              >
                <FiEdit size={16} className="mr-2" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Profile);
