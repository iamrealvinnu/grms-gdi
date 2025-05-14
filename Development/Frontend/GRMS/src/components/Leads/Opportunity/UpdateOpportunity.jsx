import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTasks } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import CreateTask from "../../Activities/Task/CreateTask";
import CallCreate from "../../Activities/Call/CallCreate";
import MailCreate from "../../Activities/Email/MailCreate";
import MeetingCreate from "../../Activities/Meeting/MeetingCreate";

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
    productLineId: "",
    changedById: "",
  });
  const [opportunityStagesTypes, setOpportunityStagesTypes] = useState({});
  const [opportunityStatusTypes, setOpportunityStatusTypes] = useState({});
  const [opportunityProductTypes, setOpportunityProductTypes] = useState({});
  const [errors, setErrors] = useState({});
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);
  const [showMailForm, setShowMailForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  const fetchOpportunityDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/marketing/Opportunity/one/${opportunityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const opportunityData = response.data?.data || response.data;
      setFormOpportunityData({
        name: opportunityData.name,
        statusId: opportunityData.statusId,
        estimatedValue: opportunityData.estimatedValue,
        stageId: opportunityData.stageId,
        description: opportunityData.description,
        productLineId: opportunityData.productLineId,
        changedById: opportunityData.createdById,
        leadId: opportunityData.leadId,
        closeDate: opportunityData.closeDate
          ? opportunityData.closeDate.split("T")[0] // ✅ Only the date part
          : "",
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
        `${import.meta.env.VITE_API_URL}/Reference/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const referenceData = response.data.data;

      const opportunityStagesMap = {};
      const opportunityStatusMap = {};
      const opportunityProductMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "Opportunity Stages") {
          reference.referenceItems.forEach((item) => {
            opportunityStagesMap[item.id] = item.code;
          });
        } else if (reference.name === "Opportunity Status") {
          reference.referenceItems.forEach((item) => {
            opportunityStatusMap[item.id] = item.code;
          });
        } else if (reference.name === "Opportunity Product Line") {
          reference.referenceItems.forEach((item) => {
            opportunityProductMap[item.id] = item.code;
          });
        }
      });
      setOpportunityStagesTypes(opportunityStagesMap);
      setOpportunityStatusTypes(opportunityStatusMap);
      setOpportunityProductTypes(opportunityProductMap);
    } catch (error) {
      console.error("Error fetching table data:", error);
      setErrors({ fetchError: "Failed to fetch table data." });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormOpportunityData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors({ ...errors, [name]: "" });
  };

  const clearDate = (fieldName) => {
    setFormOpportunityData((prevState) => ({
      ...prevState,
      [fieldName]: "",
    }));
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
        productLineId: formOpportunityData.productLineId,
        estimatedValue: parseFloat(formOpportunityData.estimatedValue),
        closeDate: new Date(formOpportunityData.closeDate).toISOString(),
        openDate: new Date().toISOString(), // Or use the original openDate from DB if available
        changedById: formOpportunityData.changedById,
        leadId: formOpportunityData.leadId,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/marketing/Opportunity/update`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Opportunity updated successfully!");
      setTimeout(() => {
        navigate("/getAllOpportunity");
      }, 1500);
    } catch (error) {
      console.error(
        "Error updating opportunity:",
        error.response?.data || error.message
      );
      setErrors({ submitError: "Failed to update opportunity." });
    }
  };

  const handleTaskClick = () => {
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
  };

  const handleCallClick = () => {
    setShowCallForm(true);
  };

  const handleCloseCallForm = () => {
    setShowCallForm(false);
  };

  const handleMailClick = () => {
    setShowMailForm(true);
  };

  const handleCloseMailForm = () => {
    setShowMailForm(false);
  };

  const handleMeetingClick = () => {
    setShowMeetingForm(true);
  };

  const handleCloseMeetingForm = () => {
    setShowMeetingForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8 ">
      <div className=" mx-auto max-w-6xl">
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 text-center">
          Edit Opportunity
        </h3>
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CreateTask
                opportunityId={opportunityId}
                onClose={handleCloseTaskForm}
              />
            </div>
          </div>
        )}

        {showCallForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CallCreate
                opportunityId={opportunityId}
                onClose={handleCloseCallForm}
              />
            </div>
          </div>
        )}

        {showMailForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <MailCreate
                opportunityId={opportunityId}
                onClose={handleCloseMailForm}
              />
            </div>
          </div>
        )}

        {showMeetingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <MeetingCreate
                opportunityId={opportunityId}
                onClose={handleCloseMeetingForm}
              />
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
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
                  className="w-full px-4 py-2 mt-1 border rounded-lg text-yellow-600 focus:ring-yellow-300"
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
                  className="w-full px-4 py-2 mt-1 border rounded-lg text-yellow-600 focus:ring-yellow-300"
                  placeholder="Enter estimated value..."
                  required
                />
              </div>

              {/* Opportunity Product Line */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Opportunity Product Line:
                </label>
                <select
                  name="productLineId"
                  value={formOpportunityData.productLineId}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-400 rounded p-2 bg-white sm:text"
                  required
                >
                  <option value="">Select product line</option>
                  {Object.entries(opportunityProductTypes).map(([id, code]) => (
                    <option key={id} value={id}>
                      {code}
                    </option>
                  ))}
                </select>
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
                    className="px-4 py-2 w-full border rounded-lg text-yellow-600  focus:ring-yellow-300 sm:text-sm"
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
                  className="w-full px-4 py-2 mt-1 border rounded-lg text-yellow-600  focus:ring-yellow-300"
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

          <div className="lg:w-64 xl:w-72">
            <div className="bg-blue-50 rounded-lg shadow-md p-4 h-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleTaskClick}
                  className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <FaTasks className="text-blue-500 text-2xl mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Task
                  </span>
                </button>
                <button
                  onClick={handleCallClick}
                  className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <IoCall className="text-green-500 text-2xl mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Call
                  </span>
                </button>
                <button
                  onClick={handleMailClick}
                  className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <MdEmail className="text-yellow-500 text-2xl mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Email
                  </span>
                </button>
                <button
                  onClick={handleMeetingClick}
                  className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <FaPeopleGroup className="text-purple-500 text-2xl mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Meeting
                  </span>
                </button>
              </div>
              <div className="mt-4">
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center cursor-pointer hover:bg-blue-100 transition-colors">
                  <IoSettings className="text-gray-600 text-2xl mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Settings
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UpdateOpportunity;
