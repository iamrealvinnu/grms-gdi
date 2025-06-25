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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GetUserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
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
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data. Please try again later.");
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
      console.error("Error fetching accounts:", error);
      toast.error("Failed to fetch account data.");
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
    <div className="p-5">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">User List</h2>

      {/* Search Input */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          className="border p-2 rounded flex-1 min-w-[250px]"
          placeholder="Search Users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-4 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
          <table className="min-w-full bg-white">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-200 text-left">
                <th className="py-3 px-4 border-r ">S.No</th>
                <th
                  className="py-3 px-4 border-r cursor-pointer"
                  onClick={() => handleSort("userName")}
                >
                  User Name{" "}
                  {sortColumn === "userName"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="py-3 px-4 border-r cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email{" "}
                  {sortColumn === "email"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="py-3 px-4 border-r cursor-pointer"
                  onClick={() => handleSort("profile.firstName")}
                >
                  First Name{" "}
                  {sortColumn === "profile.firstName"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="py-3 px-4 border-r cursor-pointer"
                  onClick={() => handleSort("profile.lastName")}
                >
                  Last Name{" "}
                  {sortColumn === "profile.lastName"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th className="py-3 px-4 border-r">Mobile Number</th>
                <th className="py-3 px-4 border-r">Country</th>
                <th className="py-3 px-4 border-r">Gender</th>
                <th className="py-3 px-4 border-r">User Type</th>
                <th className="py-3 px-4 border-r">Phone Number</th>
                <th className="py-3 px-4 border-r">Claim Type</th>
                <th className="py-3 px-4 border-r">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border text-left">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 border text-left">{user.userName || "N/A"}</td>
                  <td className="py-3 px-4 border text-left">{user.email || "N/A"}</td>
                  <td className="py-3 px-4 border text-left">
                    {user.profile?.firstName || "N/A"}
                  </td>
                  <td className="py-3 px-4 border text-left">
                    {user.profile?.lastName || "N/A"}
                  </td>
                  <td className="py-3 px-4 border text-left">
                    {user.mobileNumber || "N/A"}
                  </td>
                  <td className="py-3 px-4 border text-left">
                    {countries[user.profile?.countryId] || "N/A"}
                  </td>
                  <td className="py-3 px-4 border text-left">
                    {genders[user.profile?.genderId] || "N/A"}
                  </td>
                  <td className="py-3 px-4 border text-left">
                    {userTypes[user.profile?.userTypeId] || "N/A"}
                  </td>
                  <td className="py-3 px-4 border text-left">
                    {user.phoneNumber || "N/A"}
                  </td>
                  <td className="py-3 px-4 border text-left">
                    {user.claims
                      ?.map((claim) => claimTypes[claim.claimValue] || "N/A")
                      .join(", ")}
                  </td>
                  <td className="py-3 px-4 border text-left ">
                    <div className="flex space-x-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleEdit(user.id)}
                      >
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(GetUserList);