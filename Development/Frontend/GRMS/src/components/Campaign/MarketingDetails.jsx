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
import { PlusCircle } from "lucide-react";
import withAuth from "../withAuth";
import axios from "axios";

function MarketingDetails() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Campaign/all/true",
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

  return (
    <div className="p-5">
      <div className="flex justify-end mb-4">
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
              <th className="py-2 px-4 border-b text-left  font-semibold">
                S.no
              </th>
              <th className="py-2 px-4 border-b text-left  font-semibold">
                Campaign Name
              </th>
              <th className="py-2 px-4 border-b text-left  font-semibold">
                Campaign Description
              </th>
              <th className="py-2 px-4 border-b text-left  font-semibold">
                Campaign Start Date
              </th>
              <th className="py-2 px-4 border-b text-left  font-semibold">
                Campaign End Date
              </th>
              <th className="py-2 px-4 border-b text-left  font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign, index) => (
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
