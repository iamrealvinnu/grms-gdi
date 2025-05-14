//
// NAME:			  MarketingDetails.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  14/03/2025
// PURPOSE:			Marketing manager Get Campaign Details
//
//

// Imports
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, ArrowUpDown, Search } from "lucide-react";
import withAuth from "../withAuth";
import axios from "axios";

function MarketingDetails() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending"
  });
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/marketing/Campaign/all/true`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data && response.data.success && response.data.data) {
          setCampaigns(response.data.data);
        } else {
          setCampaigns([]);
        }
        // console.log("fetched Campaigns", response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const handleEdit = (campaignId) => {
    navigate(`/campaignUpdate/${campaignId}`);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedCampaigns = () => {
    let sortableItems = [...campaigns];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

        if (sortConfig.key === "startDate" || sortConfig.key === "endDate") {
          const dateA = new Date(valueA).getTime();
          const dateB = new Date(valueB).getTime();
          return sortConfig.direction === "ascending"
            ? dateA - dateB
            : dateB - dateA;
        }

        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortConfig.direction === "ascending"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        return 0;
      });
    }
    return sortableItems;
  };

  const getFilteredCampaigns = () => {
    let filteredItems = getSortedCampaigns();

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(searchTermLower) ||
          campaign.description.toLowerCase().includes(searchTermLower)
      );
    }

    if (filterStartDate) {
      const startDate = new Date(filterStartDate);
      filteredItems = filteredItems.filter(
        (campaign) => new Date(campaign.startDate) >= startDate
      );
    }

    if (filterEndDate) {
      const endDate = new Date(filterEndDate);
      filteredItems = filteredItems.filter(
        (campaign) => new Date(campaign.endDate) <= endDate
      );
    }

    return filteredItems;
  };

  const sortedAndFilteredCampaigns = getFilteredCampaigns();

  return (
    <div className="p-5">
      <div className="flex justify-end mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search Campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-64"
          />
        </div>

        <Link
          to="/campaignCreate"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} /> Add Campaign
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th className="py-2 px-4 border-b text-left font-semibold">
                S.no
              </th>

              <th className="py-2 px-4 border-b text-left font-semibold">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    Campaign Name
                    <button onClick={() => handleSort("name")}>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </th>

              <th className="py-2 px-4 border-b text-left font-semibold">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    Campaign Description
                    <button onClick={() => handleSort("description")}>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </th>

              <th className="py-2 px-4 border-b text-left font-semibold">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    Start Date
                    <button onClick={() => handleSort("startDate")}>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="mt-1 px-2 py-1 rounded text-black"
                  />
                </div>
              </th>

              <th className="py-2 px-4 border-b text-left font-semibold">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    End Date
                    <button onClick={() => handleSort("endDate")}>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="mt-1 px-2 py-1 rounded text-black"
                  />
                </div>
              </th>

              <th className="py-2 px-4 border-b text-left font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredCampaigns.map((campaign, index) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-gray-600">
                  {index + 1}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {campaign.name}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {campaign.description}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {new Date(campaign.startDate).toLocaleDateString("en-GB")}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  {new Date(campaign.endDate).toLocaleDateString("en-GB")}
                </td>
                <td className="py-2 px-4 border-b text-gray-600">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                    onClick={() => handleEdit(campaign.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuth(MarketingDetails);
