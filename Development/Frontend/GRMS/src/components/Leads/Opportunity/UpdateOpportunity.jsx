import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdateOpportunity() {
  const { opportunityId } = useParams();
  const navigate = useNavigate();

  const [formOpportunityData, setFormOpportunityData] = useState({
    name: "",
    statusId: "",
    estimatedValue: "",
    stageId: "",
    description: "",
    closeDate: "",
    changedById: ""
  });
  const [opportunityStagesTypes, setOpportunityStagesTypes] = useState({});
  const [opportunityStatusTypes, setOpportunityStatusTypes] = useState({});
  const [errors, setErrors] = useState({});

  const fetchOpportunityDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://grms-dev.gdinexus.com:49181/api/v1/marketing/Opportunity/one/${opportunityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const opportunityData = response.data?.data || response.data;
      setFormOpportunityData({
        name: opportunityData.name,
        statusId: opportunityData.statusId,
        estimatedValue: opportunityData.estimatedValue,
        stageId: opportunityData.stageId,
        description: opportunityData.description,
        changedById: opportunityData.createdById, 
        leadId: opportunityData.leadId,
        closeDate: opportunityData.closeDate
        ? opportunityData.closeDate.split("T")[0]  // ✅ Only the date part
        : ""
        });
      console.log("Opportunity data fetched successfully:", opportunityData);
    } catch (error) {
      console.error("Error fetching opportunity details:", error);
    }
  };

  useEffect(() => {
    fetchOpportunityDetails();
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
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
      const referenceData = response.data.data;

      const opportunityStagesMap = {};
      const opportunityStatusMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "Opportunity Stages") {
          reference.referenceItems.forEach((item) => {
            opportunityStagesMap[item.id] = item.code;
          });
        } else if (reference.name === "Opportunity Status") {
          reference.referenceItems.forEach((item) => {
            opportunityStatusMap[item.id] = item.code;
          });
        }
      });
      setOpportunityStagesTypes(opportunityStagesMap);
      setOpportunityStatusTypes(opportunityStatusMap);
    } catch (error) {
      console.error("Error fetching table data:", error);
      setErrors({ fetchError: "Failed to fetch table data." });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormOpportunityData((prevState) => ({
      ...prevState,
      [name]: value
    }));
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
  
      const updatedData = {
        id: opportunityId,
        name: formOpportunityData.name,
        description: formOpportunityData.description,
        statusId: formOpportunityData.statusId,
        stageId: formOpportunityData.stageId,
        estimatedValue: parseFloat(formOpportunityData.estimatedValue),
        closeDate: new Date(formOpportunityData.closeDate).toISOString(),
        openDate: new Date().toISOString(), // Or use the original openDate from DB if available
        changedById: formOpportunityData.changedById,
        leadId: formOpportunityData.leadId
      };
  
      const response = await axios.put(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Opportunity/update",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
  
      toast.success("Opportunity updated successfully!");
      setTimeout(() => {
        navigate("/getAllOpportunity");
      }, 1500);
  
    } catch (error) {
      console.error("Error updating opportunity:", error.response?.data || error.message);
      setErrors({ submitError: "Failed to update opportunity." });
    }
  }
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-6 sm:p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Edit Opportunity
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Opportunity Name */}
          <div>
            <label className="block text-gray-700 font-medium">
              Opportunity Name:
            </label>
            <input
              type="text"
              name="name"
              value={formOpportunityData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter opportunity name..."
            />
          </div>

          {/* Opportunity Status */}
          <div>
            <label className="block text-gray-700 font-medium">
              Opportunity Status:
            </label>
            <select
              name="statusId"
                value={formOpportunityData.statusId}
                onChange={handleChange}
              className="w-full border-2 border-gray-400 rounded p-2 bg-white sm:text-sm"
              required
            >
              <option value="">Select status</option>
              {Object.entries(opportunityStatusTypes).map(([id, code]) => (
                <option key={id} value={id}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {/* Estimated Value */}
          <div>
            <label className="block text-gray-700 font-medium">
              Estimated Value:
            </label>
            <input
              type="number"
              name="estimatedValue"
              value={formOpportunityData.estimatedValue}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter estimated value..."
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Opportunity Stages */}
          <div>
            <label className="block text-gray-700 font-medium">
              Opportunity Stage:
            </label>
            <select
              name="stageId"
              value={formOpportunityData.stageId}
              onChange={handleChange}
              className="w-full border-2 border-gray-400 rounded p-2 bg-white sm:text-sm"
              required
            >
              <option value="">Select stage</option>
              {Object.entries(opportunityStagesTypes).map(([id, code]) => (
                <option key={id} value={id}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {/* Close Date */}
          <div>
            <label className="text-gray-700 font-medium">Close Date:</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="date"
                name="closeDate"
                value={formOpportunityData.closeDate}
                onChange={handleChange}
                className="px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-300 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => clearDate("closeDate")}
                className="px-3 py-2 text-white bg-indigo-500 hover:bg-red-600 transition duration-200 rounded-lg sm:w-auto"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-700 font-medium">
              Description:
            </label>
            <textarea
              name="description"
              value={formOpportunityData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              rows="3"
              placeholder="Additional notes..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
          >
            Update Opportunity
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UpdateOpportunity;
