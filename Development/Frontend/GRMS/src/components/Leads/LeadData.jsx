import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import axios from "axios";
import { GrFormView } from "react-icons/gr";
import { FaPhone } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import { MdGroupAdd } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";



function LeadData() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchClients(); // Await here
      await fetchUsers(); // Await here
      await fetchReferenceData(); // Fetch reference data
      setLoading(false); //  Set loading to false *after* all fetches are done
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filter customers whenever the search term or status changes
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter(
        (customer) => statuses[customer.statusId] === selectedStatus
      );
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, selectedStatus]);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/marketing/Lead/all/true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.success && response.data.data) {
        setCustomers(response.data.data);
      } else {
        setCustomers([]);
      }
      console.log("fetched data:", response.data);
    } catch (err) {
      setError("Failed to fetch client data.");
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/User/all/true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.data || []); // Ensure data exists
      // console.log("abba", response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/Reference/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const referenceData = response.data?.data || response.data;

      const statusMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "Lead Status") {
          reference.referenceItems.forEach((item) => {
            statusMap[item.id] = item.code;
          });
        }
      });
      setStatuses(statusMap);

    } catch (error) {
      console.error("Error fetching reference data:", error);
      setError("Failed to fetch reference data.");
    }
  };

  const handleSort = (field) => {
    let direction = "asc";
    if (sortConfig.key === field && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: field, direction });

    const sorted = [...filteredCustomers].sort((a, b) => {
      if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
      if (a[field] > b[field]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredCustomers(sorted);
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;


  return (
    <div className="p-5">
      <div className="flex flex-wrap justify-between items-center mb-4">
        {/* Search and Filter Section */}
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <input
            type="text"
            className="border p-2 rounded w-[48%]"
            placeholder="Search Clients"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded ml-4"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            {Object.values(statuses).map((status, idx) => (
              <option key={idx} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Add Client Button */}
        <div className="flex justify-end mt-4 mb-4">
          <Link
            to="/addLead"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} /> Create Lead
          </Link>
        </div>
      </div>

      {/* **Table Section** (First) */}
      <div className="overflow-x-auto shadow-lg rounded-lg mb-6">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 border-r text-left">S.No</th>
              <th
                className="py-3 px-4 border-r text-left cursor-pointer"
                onClick={() => handleSort("firstName")}
              >
                Customer Name{" "}
                {sortConfig.key === "firstName"
                  ? sortConfig.direction === "asc"
                    ? " ▲"
                    : " ▼"
                  : ""}
              </th>
              <th
                className="py-3 px-4 border-r text-left cursor-pointer"
                onClick={() => handleSort("company")}
              >
                Company Name{" "}
                {sortConfig.key === "company"
                  ? sortConfig.direction === "asc"
                    ? " ▲"
                    : " ▼"
                  : ""}
              </th>
              <th className="py-3 px-4 border-r text-left">Lead Owner</th>
              <th className="py-3 px-4 border-r text-left">Email</th>
              <th className="py-3 px-4 border-r text-left">Number</th>
              <th className="py-3 px-4 border-r text-left">Status</th>
              <th className="py-3 px-4 border-r text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers
              .map((customer, index) => {
                const isQualified = statuses[customer.statusId] === "Qualified";
                return (
                  <tr
                    key={customer.id}
                    className="border-b  hover:bg-gray-100"
                  >
                    <td className="py-2 px-4 border-r">{index + 1}</td>

                    <td className="py-2 px-4 border-r hover:text-blue-700">
                      <Link to={`/clientData/${customer.id}`}>
                        {customer.firstName} {customer.lastName}
                      </Link>
                    </td>

                    <td className="py-2 px-4 border-r">{customer.company || "N/A"}</td>

                    <td className="py-2 px-4 border-r">
                      {(() => {
                        const user = users.find(
                          (user) => user.id === customer.assignedToId
                        );
                        return user ? user.profile?.firstName : "N/A";
                      })()}
                    </td>

                    <td className="py-2 px-4 border-r text-blue-600 underline">
                      <a href={`mailto:${customer.email}`}>{customer.email}</a>
                    </td>

                    <td className="py-2 px-4 border-r">{customer.phoneNumber || "N/A"}</td>

                    <td className={`py-2 px-4 border-r ${statuses[customer.statusId] === "Qualified" ? "text-blue-600 font-bold"
                      : statuses[customer.statusId] === "Converted" ? "text-green-600 font-bold" : ""}`}>
                      {statuses[customer.statusId] || "Active"}
                      {statuses[customer.statusId] !== "Qualified" &&
                        statuses[customer.statusId] !== "Converted" && (
                          <button
                            onClick={() => {
                              // You can call your convert function here if needed
                              console.log("Convert to Account clicked", customer.id);
                            }}
                            className="bg-gray-100 ml-4 text-xs p-2 rounded-md hover:bg-gray-300"
                          >
                            Convert to account</button>
                        )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/viewleadData/${customer.id}`)}
                          className="text-neutral-600 hover:text-neutral-800"
                          title="View Opportunity"
                        >
                          <GrFormView className="w-6 h-6" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          title="Call"
                          onClick={() => navigate(`/createLeadCall/${customer.id}`)}
                        >
                          <FaPhone className="w-4 h-4" />
                        </button>
                        <button
                          className="text-orange-600 hover:text-orange-800"
                          title="Mail"
                          onClick={() => navigate(`/createLeadMail/${customer.id}`)}
                        >
                          <CiMail className="w-5 h-5" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800"
                          title="Group"
                          onClick={() => navigate(`/createLeadMeeting/${customer.id}`)}
                        >
                          <MdGroupAdd className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/createLeadTask/${customer.id}`)}
                          className="text-gray-600 hover:text-stone-800"
                          title="Tasks"
                        >
                          <FaTasks className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/createLeadTask/${customer.id}`)}
                          // className="text-green-600 hover:text-stone-800"
                          title="Convert to Account"
                        >
                          <CiMenuKebab className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default LeadData;
