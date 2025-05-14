import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

function CreateOpportunity() {
  const navigate = useNavigate();
  const { leadId } = useParams();

  const [formOpportunityData, setFormOpportunityData] = useState({
    name: "",
    estimatedValue: "",
    stageId: "",
    closeDate: "",
    leadId: leadId, // Initialize with the leadId from URL
    statusId: "",
    createdById: "",
    productLineId: "",
    description: "", // Added notes field
  });

  const [tableOpportunityStatusData, setTableOpportunityStatusData] = useState(
    []
  );
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState("");
  const [leadDetails, setLeadDetails] = useState(null);

  const opportunityStagesTypes =
    tableOpportunityStatusData.find(
      (item) => item.name === "Opportunity Stages"
    )?.referenceItems || [];

  const opportunityStatusTypes =
    tableOpportunityStatusData.find(
      (item) => item.name === "Opportunity Status"
    )?.referenceItems || [];

  const opportunityProductLineTypes =
    tableOpportunityStatusData.find(
      (item) => item.name === "Opportunity Product Line"
    )?.referenceItems || [];

  const fetchLeadDetails = async (leadId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/marketing/Lead/one/${leadId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const leadData = response.data.data;
      setLeadDetails(leadData);
      setFormOpportunityData((prevData) => ({
        ...prevData,
        name: leadData.company || "Opportunity for " + leadData.company, // Use company name as default opportunity name
      }));
    } catch (error) {
      console.error("Error fetching lead details:", error);
      toast.error("Failed to fetch lead details");
    }
  };

  const fetchTableData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/Reference/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTableOpportunityStatusData(response.data.data);
    } catch (error) {
      toast.error("Error fetching reference data.");
      console.error("Reference fetch error:", error);
    }
  };

  useEffect(() => {
    fetchLeadDetails(leadId);
    fetchTableData();
  }, [leadId]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] || "";
        setUser(userId);
        setFormOpportunityData((prev) => ({ ...prev, createdById: userId }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormOpportunityData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formOpportunityData.name) {
      newErrors.name = "Opportunity name is required.";
      isValid = false;
    }
    if (!formOpportunityData.estimatedValue) {
      newErrors.estimatedValue = "Estimated value is required.";
      isValid = false;
    }
    if (!formOpportunityData.stageId) {
      newErrors.stageId = "Opportunity stage is required.";
      isValid = false;
    }
    if (!formOpportunityData.statusId) {
      newErrors.statusId = "Opportunity status is required.";
      isValid = false;
    }
    if (!formOpportunityData.productLineId) {
      newErrors.productLineId = "Product line is required.";
      isValid = false;
    }
    if (!formOpportunityData.closeDate) {
      newErrors.closeDate = "Close date is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleOpportunitySubmit = async (e) => {
    e.preventDefault();
    if (!validForm()) return;

    try {
      const token = localStorage.getItem("accessToken");

      // Prepare the data in the exact format the API expects
      const requestOpportunityData = {
        name: formOpportunityData.name,
        description: formOpportunityData.description || "", // Add a description
        leadId: formOpportunityData.leadId,
        statusId: formOpportunityData.statusId,
        stageId: formOpportunityData.stageId,
        openDate: new Date().toISOString(), // or opportunityData.openDate if set
        closeDate: new Date(formOpportunityData.closeDate).toISOString(), // or a future date
        estimatedValue: formOpportunityData.estimatedValue,
        productLineId: formOpportunityData.productLineId,
        createdById: user, // make sure this comes from the logged-in user
      };

      console.log("Submitting Opportunity Data:", requestOpportunityData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/marketing/Opportunity/create`,
        requestOpportunityData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Opportunity Created Response:", response.data);
      toast.success("Opportunity created successfully!");
      navigate("/getAllOpportunity");
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      toast.error("Error creating Opportunity. Please try again.");
    }
  };

  const clearDate = (field) => {
    setFormOpportunityData((prevState) => ({
      ...prevState,
      [field]: "",
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-6 sm:p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Add Opportunity
        </h3>
        <form className="space-y-4" onSubmit={handleOpportunitySubmit}>
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
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Lead Name (read-only) */}
          <div>
            <label className="block text-gray-700 font-medium">
              Related Lead:
            </label>
            <input
              type="text"
              value={leadDetails?.company || "Loading..."}
              readOnly
              className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100"
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
              {opportunityStatusTypes.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.code}
                </option>
              ))}
            </select>
            {errors.statusId && (
              <p className="text-red-500 text-sm">{errors.statusId}</p>
            )}
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
              required
            />
            {errors.estimatedValue && (
              <p className="text-red-500 text-sm">{errors.estimatedValue}</p>
            )}
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
              {opportunityStagesTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.code}
                </option>
              ))}
            </select>
            {errors.stageId && (
              <p className="text-red-500 text-sm">{errors.stageId}</p>
            )}
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
              className="w-full border-2 border-gray-400 rounded p-2 bg-white sm:text-sm"
              required
            >
              <option value="">Select product line</option>
              {opportunityProductLineTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.code}
                </option>
              ))}
            </select>
            {errors.productLineId && (
              <p className="text-red-500 text-sm">{errors.productLineId}</p>
            )}
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
            {errors.closeDate && (
              <p className="text-red-500 text-sm">{errors.closeDate}</p>
            )}
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
            Create Opportunity
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateOpportunity;
