import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";

function CreateTask() {
  const [tasks, setTasks] = useState({
    name: "",
    type: "Task",
    entityId: "",
    activityTypeId: "",
    description: "",
    outcomeId: "",
    notes: "",
    assignedToId: "",
    createdById: "",
    activityDate: "", // This will be used for activityDueDate in the API
  });

  const [tableData, setTableData] = useState([]);
  const [users, setUsers] = useState([]);
  const { opportunityId, leadId } = useParams();
  const navigate = useNavigate();

  const outcomeTypes =
    tableData.find((item) => item.name === "Outcomes")?.referenceItems || [];

  const activitiesTypes =
    tableData.find((item) => item.name === "Activity Types")?.referenceItems ||
    [];

  useEffect(() => {
    fetchTableData();
    fetchUsers();
    fetchCurrentUser();
    // Only fetch lead/opportunity details if IDs are present in URL
    if (leadId) {
      fetchLeadDetails(leadId);
    }
    if (opportunityId) {
      fetchOpportunityDetails();
    }
  }, [opportunityId, leadId]); // Add dependencies to useEffect

  // Fetch reference data
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
      setTableData(response.data.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
      toast.error("Failed to load reference data.");
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/User/all/true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load user data.");
    }
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] || "";
        setTasks((prev) => ({ ...prev, createdById: userId }));
      } catch (error) {
        console.error("Error decoding token:", error);
        toast.error("Failed to get current user info.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTasks((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const clearDate = (field) => {
    setTasks((prevState) => ({
      ...prevState,
      [field]: "",
    }));
  };

  const fetchOpportunityDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/marketing/Opportunity/one/${opportunityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const opportunityData = response.data?.data || response.data;
      setTasks((prevData) => ({
        ...prevData,
        // Assuming entityId for a task is the opportunityId
        entityId: opportunityId,
        company: opportunityData.companyName || "", // Assuming companyName from opportunity
        estimatedValue: opportunityData.estimatedValue,
        closeDate: opportunityData.closeDate
          ? opportunityData.closeDate.split("T")[0]
          : "",
        leadId: opportunityData.leadId,
        // Include other fields if needed for task payload directly
        // statusId: opportunityData.statusId,
        // stageId: opportunityData.stageId,
        // productLineId: opportunityData.productLineId,
      }));
    } catch (error) {
      console.error("Error fetching opportunity details:", error);
      toast.error("Failed to load opportunity details.");
    }
  };

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
      setTasks((prevData) => ({
        ...prevData,
        company: leadData.company || "",
        firstName: leadData.firstName || "",
        lastName: leadData.lastName || "",
        leadName: leadData.company || "",
        phoneNumber: leadData.phoneNumber || "",
      }));
    } catch (error) {
      console.error("Error fetching lead details:", error);
      toast.error("Failed to load lead details.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields for the Task
    if (!tasks.name.trim()) {
      toast.error("Please enter a task name (Subject)");
      return;
    }
    if (!tasks.assignedToId) {
      toast.error("Please select an assignee");
      return;
    }
    if (!tasks.activityTypeId) {
      toast.error("Please select an activity type");
      return;
    }
    if (!tasks.createdById) {
      toast.error("Creator ID is missing. Please refresh or log in again.");
      return;
    }
    if (!tasks.entityId) {
      toast.error("Opportunity ID is missing. Cannot create task.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        navigate("/login");
        return;
      }

      // --- 1. Prepare Payload for Activity Creation ---
      const activityPayload = {
        name: tasks.name,
        type: tasks.type,
        entityId: tasks.entityId, // This should be the opportunityId fetched and set
        activityTypeId: tasks.activityTypeId,
        description: tasks.description,
        outcomeId: tasks.outcomeId || null, // Send null if not selected
        notes: tasks.notes,
        assignedToId: tasks.assignedToId,
        createdById: tasks.createdById,
        activityDate: new Date().toISOString(), // Current timestamp for when activity is "active"
        // Add any other required fields from API documentation for Activity create
      };

      console.log("Submitting Activity:", activityPayload);

      // --- 1.1. Call API to Create Activity ---
      const activityResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/marketing/Activity/create`,
        activityPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Task created successfully!");
      console.log("Task creation response:", activityResponse.data);
      navigate("/getTasks");

    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Error creating task. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8">
      <div className="mx-auto max-w-6xl w-full">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <form onSubmit={handleSubmit} className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold md:text-2xl text-gray-800 mb-6 text-center">
              Add Task
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="assignedToId" className="block text-gray-700 font-medium mb-1">
                  Assigned To: <span className="text-red-500">*</span>
                </label>
                <select
                  id="assignedToId"
                  name="assignedToId"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={tasks.assignedToId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.profile?.firstName || "Unnamed User"} {user.profile?.lastName || ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="activityTypeId" className="block text-gray-700 font-medium mb-1">
                  Activity Type: <span className="text-red-500">*</span>
                </label>
                <select
                  id="activityTypeId"
                  name="activityTypeId"
                  value={tasks.activityTypeId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                >
                  <option value="">Select Activity Type</option>
                  {activitiesTypes.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                  Subject: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={tasks.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300 border-gray-300"
                  placeholder="Enter Subject name..."
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={tasks.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  rows="4"
                  placeholder="Enter task description..."
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label htmlFor="activityDate" className="block text-gray-700 font-medium mb-1">
                  Due Date: <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    type="date"
                    id="activityDate"
                    name="activityDate"
                    value={tasks.activityDate}
                    onChange={handleChange}
                    className="px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-300 border-gray-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => clearDate("activityDate")}
                    className="px-4 py-2 sm:w-auto text-white bg-red-500 hover:bg-red-600 transition duration-200 rounded-lg"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="outcomeId" className="block text-gray-700 font-medium mb-1">
                  Outcome:
                </label>
                <select
                  id="outcomeId"
                  name="outcomeId"
                  value={tasks.outcomeId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Select Outcome Type</option>
                  {outcomeTypes.map((outcome) => (
                    <option key={outcome.id} value={outcome.id}>
                      {outcome.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label htmlFor="notes" className="block text-gray-700 font-medium mb-1">
                  Notes:
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  name="notes"
                  value={tasks.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter notes..."
                />
              </div>
            </div>

            <div className="flex justify-between gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-1/2 bg-gray-500 text-white py-3 rounded-lg uppercase hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-blue-600 text-white py-3 rounded-lg uppercase hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </form>

          {/* Sidebar */}
          <div className="w-full lg:w-72 xl:w-80 mt-4 lg:mt-0 bg-blue-50 rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl md:text-lg font-semibold mb-4 text-gray-800">
              Opportunity Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <div>
                <strong className="block text-sm font-medium">Opportunity Name:</strong>{" "}
                <span className="text-base">{tasks.company || "N/A"}</span>
              </div>
              <div>
                <strong className="block text-sm font-medium">Estimated Value:</strong>{" "}
                <span className="text-base">₹{tasks.estimatedValue || "0.00"}</span>
              </div>
              <div>
                <strong className="block text-sm font-medium">Close Date:</strong>{" "}
                <span className="text-base">{tasks.closeDate || "N/A"}</span>
              </div>
              <div>
                <strong className="block text-sm font-medium">Lead Name:</strong>{" "}
                <span className="text-base">{tasks.leadName || "N/A"}</span>
              </div>
              <div>
                <strong className="block text-sm font-medium">Customer Name:</strong>{" "}
                <span className="text-base">
                  {tasks.firstName} {tasks.lastName || "N/A"}
                </span>
              </div>
              <div>
                <strong className="block text-sm font-medium">Mobile Number:</strong>{" "}
                <span className="text-base">{tasks.phoneNumber || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default CreateTask;