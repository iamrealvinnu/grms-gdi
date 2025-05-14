//
// NAME:			  GetUserList.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  12/03/2025
// PURPOSE:			User's Details GetUser's List
//
//

// Imports
import React, { useEffect, useState } from "react";
import axios from "axios";
import withAuth from "../withAuth";
import { useNavigate } from "react-router-dom";

const GetUserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genders, setGenders] = useState({});
  const [countries, setCountries] = useState({});
  const [userTypes, setUserTypes] = useState({});
  const [claimTypes, setClaimTypes] = useState({});
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState("userName");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchUsers();
    fetchReferenceData();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authorization token is missing.");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/User/all/true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = response.data?.data || response.data;
      if (Array.isArray(userData)) {
        setUsers(userData);
      } else {
        throw new Error("Unexpected API response format.");
      }
      setLoading(false);
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
        `${import.meta.env.VITE_API_URL}/Reference/all`,
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
    }
  };

  const handleSort = (column) => {
    setSortOrder((prevOrder) =>
      sortColumn === column ? (prevOrder === "asc" ? "desc" : "asc") : "asc"
    );
    setSortColumn(column);
  };

  const sortedUsers = React.useMemo(() => {
    if (!users) return [];
    
    const sortedData = [...users].sort((a, b) => {
      const valueA = a[sortColumn]?.toString().toLowerCase() || "";
      const valueB = b[sortColumn]?.toString().toLowerCase() || "";
      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sortedData.filter((user) => {
      const lowerSearch = search.toLowerCase();
      return (
        user.userName?.toLowerCase().includes(lowerSearch) ||
        user.profile?.firstName?.toLowerCase().includes(lowerSearch) ||
        user.profile?.lastName?.toLowerCase().includes(lowerSearch) ||
        user.email?.toLowerCase().includes(lowerSearch)
      );
    });
  }, [users, search, sortColumn, sortOrder]);

  const handleEdit = (userId) => {
    navigate(`/userUpdate/${userId}`);
  };

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User List</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="mb-4 px-4 py-2 w-full sm:w-[400px] md:w-[500px] lg:w-[600px] border rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-lg">Loading users...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : sortedUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => handleSort("userName")}
                >
                  User Name {sortColumn === "userName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email {sortColumn === "email" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => handleSort("profile.firstName")}
                >
                  First Name {sortColumn === "profile.firstName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => handleSort("profile.lastName")}
                >
                  Last Name {sortColumn === "profile.lastName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-2 border">Mobile Number</th>
                <th className="px-4 py-2 border">Country</th>
                <th className="px-4 py-2 border">Gender</th>
                <th className="px-4 py-2 border">User Type</th>
                <th className="px-4 py-2 border">Phone Number</th>
                <th className="px-4 py-2 border">Claim Type</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100 text-center">
                  <td className="py-2 px-4 border">{user.userName || "N/A"}</td>
                  <td className="py-2 px-4 border">{user.email || "N/A"}</td>
                  <td className="py-2 px-4 border">{user.profile?.firstName || "N/A"}</td>
                  <td className="py-2 px-4 border">{user.profile?.lastName || "N/A"}</td>
                  <td className="py-2 px-4 border">{user.mobileNumber || "N/A"}</td>
                  <td className="py-2 px-4 border">{countries[user.profile?.countryId] || "N/A"}</td>
                  <td className="py-2 px-4 border">{genders[user.profile?.genderId] || "N/A"}</td>
                  <td className="py-2 px-4 border">{userTypes[user.profile?.userTypeId] || "N/A"}</td>
                  <td className="py-2 px-4 border">{user.phoneNumber || "N/A"}</td>
                  <td className="py-2 px-4 border">
                    {user.claims
                      ?.map((claim) => claimTypes[claim.claimValue] || "N/A")
                      .join(", ")}
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                      onClick={() => handleEdit(user.id)}
                    >
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-lg">No users found.</p>
      )}
    </div>
  );
};

export default withAuth(GetUserList);