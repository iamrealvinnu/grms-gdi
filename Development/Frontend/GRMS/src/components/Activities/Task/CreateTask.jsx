import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateTask({ opportunityId, onClose }) {
  const [tasks, setTasks] = useState({
    name: "",
    type: "Opportunity",
    entityId: opportunityId,
    activityTypeId: "",
    description: "",
    outcomeId: "",
    notes: "",
    assignedToId: "",
    createdById: "",
    activityDate: ""
  });

  const [tableData, setTableData] = useState([]);
  const [users, setUsers] = useState([]);
  const [opportunityName, setOpportunityName] = useState("");

  const outcomeTypes =
    tableData.find((item) => item.name === "Outcomes")?.referenceItems || [];

  const activitiesTypes =
    tableData.find((item) => item.name === "Activity Types")?.referenceItems ||
    [];

  useEffect(() => {
    fetchTableData();
    fetchUsers();
    fetchOpportunityName();
    fetchCurrentUser();
  }, []);

  // Fetch reference data
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
      setTableData(response.data.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/User/all/true",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchOpportunityName = async () => {
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
      setOpportunityName(opportunityData.name);
      setTasks((prev) => ({
        ...prev,
        name: `Task for ${opportunityData.name}`
      }));
      // console.log("haa", opportunityData);
    } catch (error) {
      console.error("Error fetching opportunity details: error");
      toast.error("Failed to load opportunity details");
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
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTasks((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const clearDate = (field) => {
    setTasks((prevState) => ({
      ...prevState,
      [field]: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!tasks.name.trim()) {
      toast.error("Please enter a task name");
      return;
    }
    if (!tasks.assignedToId) {
      toast.error("Please select an assignee");
      return;
    }
    if (!tasks.activityDate) {
      toast.error("Please select a due date");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      // Format the payload exactly as the API expects
      const requestData = {
        name: tasks.name,
        type: tasks.type,
        entityId: tasks.entityId,
        activityTypeId: tasks.activityTypeId,
        description: tasks.description,
        outcomeId: tasks.outcomeId,
        notes: tasks.notes,
        assignedToId: tasks.assignedToId,
        createdById: tasks.createdById,
        activityDate: new Date(tasks.activityDate).toISOString()
        // Add any other required fields from API documentation
      };

      console.log("Submitting:", requestData); // Debug log

      const response = await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Activity/create",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      toast.success("Task created successfully!");
      onClose();
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);

      // Show specific error message if available
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(", ") ||
        "Failed to create task";

      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        X
      </button>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Add Task
            </h3>

            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-[48%]">
                <label className="block text-gray-700 font-medium mb-1">
                  Assigned To:
                </label>
                <select
                  name="assignedToId"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={tasks.assignedToId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.profile?.firstName || "Unnamed User"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-[48%]">
                <label className="block text-gray-700 font-medium mb-1">
                  Related To:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="entityId"
                    value={opportunityName || tasks.entityId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Related to what?"
                    readOnly
                  />
                  <input
                    type="hidden"
                    name="entityId"
                    value={tasks.entityId} // Still keep the UUID in a hidden field
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Opportunity Name:
              </label>
              <input
                type="text"
                name="name"
                value={tasks.name}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Enter opportunity name..."
              />
            </div>

            <div className="w-full md:w-[48%] mt-4">
              <label className="block text-gray-700 font-medium mb-1">
                Activity Type:
              </label>
              <select
                name="activityTypeId"
                value={tasks.activityTypeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select Activity Type</option>
                {activitiesTypes.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.code}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-1">
                Description:
              </label>
              <textarea
                name="description"
                value={tasks.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                rows="4"
                placeholder="Enter task description..."
              />
            </div>

            <div className="w-full md:w-[48%] mt-4">
              <label className="block text-gray-700 font-medium mb-1">
                Due Date:
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <input
                  type="date"
                  name="activityDate"
                  value={tasks.activityDate}
                  onChange={handleChange}
                  className="px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={() => clearDate("activityDate")}
                  className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 transition duration-200 rounded-lg"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="w-full md:w-[48%] mt-4">
              <label className="block text-gray-700 font-medium mb-1">
                Outcome:
              </label>
              <select
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

            <div className="w-full md:w-[48%] mt-4">
              <label className="block text-gray-700 font-medium mb-1">
                Reminder:
              </label>
              <input
                type="text"
                name="notes"
                value={tasks.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter reminder details..."
              />
            </div>

            <div className="flex justify-between gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
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
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateTask;
