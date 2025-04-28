import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import axios from "axios";

// Register Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function LeadData() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [industries, setIndustries] = useState({});
  const [statuses, setStatuses] = useState({});
  const [countries, setCountries] = useState({});
  const [states, setStates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Lead/all/true",
        {
          headers: { Authorization: `Bearer ${token}` }
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
        "https://grms-dev.gdinexus.com:49181/api/v1/User/all/true",
        {
          headers: { Authorization: `Bearer ${token}` }
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
        "https://grms-dev.gdinexus.com:49181/api/v1/Reference/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const referenceData = response.data?.data || response.data;

      const industryMap = {};
      const statusMap = {};
      const countryMap = {};
      const stateMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "Industry Types") {
          reference.referenceItems.forEach((item) => {
            industryMap[item.id] = item.description;
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
        }
      });
      setIndustries(industryMap);
      setStatuses(statusMap);
      setCountries(countryMap);
      setStates(stateMap);
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

  // Prepare Data for Chart
  const monthlyCounts = customers.reduce((acc, customer) => {
    const month = new Date(customer.createdOnUtc).toLocaleString("default", {
      month: "long"
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(monthlyCounts),
    datasets: [
      {
        label: "Number of Clients per Month",
        data: Object.values(monthlyCounts),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: function (context) {
            const month = context.label || "Unknown";
            const clientCount = context.raw || 0;
            return `${month}: ${clientCount} clients`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month"
        }
      },
      y: {
        title: {
          display: true,
          text: "Number of Clients"
        },
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        {/* Search and Filter Section */}
        <div className="flex items-center gap-4 flex-1">
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
            <option value="All">All Statuses</option>
            {Object.values(statuses).map((status, idx) => (
              <option key={idx} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Add Client Button */}
        <div className="flex justify-end mb-4">
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
              <th className="py-3 px-4 text-left">S.No</th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
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
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => handleSort("company")}
              >
                Company Name{" "}
                {sortConfig.key === "company"
                  ? sortConfig.direction === "asc"
                    ? " ▲"
                    : " ▼"
                  : ""}
              </th>
              <th className="py-3 px-4 text-left">Lead Owner</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Industry</th>
              <th className="py-3 px-4 text-left">Number</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers
              .filter((customer) => statuses[customer.statusId] !== "Qualified")
              .map((customer, index) => (
                <tr key={customer.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4 hover:text-blue-700">
                    <Link to={`/clientData/${customer.id}`}>
                      {customer.firstName} {customer.lastName}
                    </Link>
                  </td>
                  <td className="py-2 px-4">{customer.company || "N/A"}</td>
                  <td className="py-2 px-4">
                    {(() => {
                      const user = users.find(
                        (user) => user.id === customer.assignedToId
                      );
                      return user ? user.profile?.firstName : "N/A";
                    })()}
                  </td>

                  <td className="py-2 px-4 text-blue-600 underline">
                    <a href={`mailto:${customer.email}`}>{customer.email}</a>
                  </td>
                  <td className="py-2 px-4">
                    {industries[customer.industryId] || "N/A"}
                  </td>
                  <td className="py-2 px-4">{customer.phoneNumber || "N/A"}</td>
                  <td className="py-2 px-4 font-bold text-gray-700">
                    {statuses[customer.statusId] || "Active"}
                  </td>
                  <td className="py-2 px-4">
                    {customer.addresses.length > 0 &&
                    customer.addresses[0].address ? (
                      <>
                        {customer.addresses[0].address.address1},{" "}
                        {customer.addresses[0].address.city},{" "}
                        {customer.addresses[0].address.zip},{" "}
                        {states[customer.addresses[0].address.stateId]},{" "}
                        {countries[customer.addresses[0].address.countryId]}
                      </>
                    ) : (
                      "No Address"
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* **Chart Section** (Second) */}
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default LeadData;
