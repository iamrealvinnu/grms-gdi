import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdateCampaign() {
  const [formMarketingData, setFormMarketingData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    changedById: ""
  });
  const [errors, setErrors] = useState({});
  const { campaignId } = useParams();
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormMarketingData({ ...formMarketingData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const fetchCampaignData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/marketing/Campaign/one/${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      const campaignData = response.data || response.data?.data;
      const formatDate = (dateString) =>
        dateString ? dateString.split("T")[0] : "";
      setFormMarketingData({
        name: campaignData.data.name || "",
        description: campaignData.data.description || "",
        startDate: formatDate(campaignData.data.startDate) || "",
        endDate: formatDate(campaignData.data.endDate) || "",
        changedById: campaignData.data.createdById || ""
      });
      console.log("Campaign data:", response.data);
    } catch (error) {
      setErrors({ fetchError: "Failed to fetch campaign data." });
      console.error("Error fetching campaign data:", error);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, []);

  const clearDate = (field) => {
    setFormMarketingData((prevState) => ({
      ...prevState,
      [field]: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const updatedData = {
        id: campaignId,
        name: formMarketingData.name,
        description: formMarketingData.description,
        startDate: formMarketingData.startDate || null,
        endDate: formMarketingData.endDate || null,
        changedById: formMarketingData.changedById
      };
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/marketing/Campaign/update`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Campaign updated successfully!");
      console.log("Campaign updated successfully:", response.data);
      setTimeout(() => {
        navigate("/campaignDetails");
      }, 1500);
    } catch (error) {
      console.error("Error updating campaign:", error);
      setErrors({ submitError: "Failed to update campaign." });
    }
  };

  return (
    <div className="flex items-center justify-center p-5">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Update Campaign
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium text-gray-700">
                Campaign Name
              </label>
              <input
                type="text"
                name="name"
                value={formMarketingData.name}
                onChange={handleChange}
                placeholder="Campaign name"
                className="w-full border-2 border-gray-400 text-blue-700 rounded px-4 py-2 mt-2"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Campaign Description
              </label>
              <textarea
                type="text"
                name="description"
                value={formMarketingData.description}
                onChange={handleChange}
                placeholder="Campaign name"
                rows="4"
                className="w-full border-2 border-gray-400 text-blue-700 rounded px-4 py-2 mt-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Start Date:
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <input
                  type="date"
                  name="startDate"
                  value={formMarketingData.startDate}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-400 text-blue-700 rounded px-4 py-2 mt-2"
                />
                <button
                  type="button"
                  onClick={() => clearDate("startDate")}
                  className="px-3 py-2 text-white bg-gray-500 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                End Date:
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <input
                  type="date"
                  name="endDate"
                  value={formMarketingData.endDate}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-400 text-blue-700 rounded px-4 py-2 mt-2"
                />
                <button
                  type="button"
                  onClick={() => clearDate("endDate")}
                  className="px-3 py-2 text-white bg-gray-500 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Clear
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Update
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UpdateCampaign;
