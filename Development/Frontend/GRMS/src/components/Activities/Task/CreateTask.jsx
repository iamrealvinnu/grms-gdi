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
    activityDate: "",
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
    fetchLeadDetails(leadId);
    fetchOpportunityDetails();
  }, []);

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
      [name]: value,
    }));
  };

  const clearDate = (field) => {
    setTasks((prevState) => ({
      ...prevState,
      [field]: "",
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
        entityId: opportunityId,
        activityTypeId: tasks.activityTypeId,
        description: tasks.description,
        outcomeId: tasks.outcomeId,
        notes: tasks.notes,
        assignedToId: tasks.assignedToId,
        createdById: tasks.createdById,
        activityDate: new Date(tasks.activityDate).toISOString(),
        // Add any other required fields from API documentation
      };

      console.log("Submitting:", requestData); // Debug log

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/marketing/Activity/create`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Task created successfully!");
      navigate("/getTasks");
      console.log("Task", requestData.data);
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      toast.error("Error fetching Task Created");
    }
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
        statusId: opportunityData.statusId,
        estimatedValue: opportunityData.estimatedValue,
        stageId: opportunityData.stageId,
        productLineId: opportunityData.productLineId,
        changedById: opportunityData.createdById,
        leadId: opportunityData.leadId,
        closeDate: opportunityData.closeDate
          ? opportunityData.closeDate.split("T")[0]
          : "",
      }));
      return opportunityData;
    } catch (error) {
      console.error("Error fetching opportunity details:", error);
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
      console.log("view", leadData);
    } catch (error) {
      console.error("Error fetching lead details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8">
      {/* <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        X
      </button> */}
      <div className="mx-auto max-w-6xl w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
          <form onSubmit={handleSubmit}>
            <div className="p-4">
              <h3 className="text-xl font-bold  md:text-2xl text-gray-800 mb-6 text-center">
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
              </div>

              <div className="mt-4">
                <label className="block text-gray-700 font-medium">
                  Subject:
                </label>
                <input
                  type="text"
                  name="name"
                  value={tasks.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Enter Subject name..."
                />
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

              <div className="flex flex-wrap gap-4">
                <div className="w-full">
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
                      className="px-4 py-2 sm:w-auto text-white bg-red-500 hover:bg-red-600 transition duration-200 rounded-lg"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-[48%]">
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
              </div>

              <div className="w-full mt-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Reminder:
                </label>
                <textarea
                  type="text"
                  rows={3}
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

          {/* Sidebar */}
          <div className="w-full lg:w-64 xl:w-72 mt-4 lg:mt-0">
            <div className="bg-blue-50 rounded-lg shadow-md p-4 h-full">
              <h2 className="text-xl md:text-lg font-semibold mb-4">
                Opportunity Details
              </h2>
              <div>
                <strong>Opportunity Name:</strong> {tasks.company}
              </div>
              <div>
                <strong>Estimated Value:</strong> ₹{tasks.estimatedValue}
              </div>
              <div>
                <strong>Close Date:</strong> {tasks.closeDate}
              </div>
              <div>
                <strong>Lead Name:</strong> {tasks.leadName || "N/A"}
              </div>
              <div>
                <strong>Customer Name:</strong> {tasks.firstName}{" "}
                {tasks.lastName}
              </div>
              <div>
                <strong>Mobile Number:</strong> {tasks.phoneNumber || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateTask;
