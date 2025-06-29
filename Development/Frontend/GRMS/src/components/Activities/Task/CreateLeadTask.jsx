import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";


function CreateLeadTask() {
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
    company: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [tableData, setTableData] = useState([]);
  const [users, setUsers] = useState([]);
  const { leadId } = useParams();
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
    if (leadId) {
      fetchLeadDetails(leadId);
    }
  }, [leadId]);

  // Fetch reference data
  const fetchTableData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/Reference/all`,
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
        `${import.meta.env.VITE_API_URL}/User/all/true`,
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
      const addressObj = leadData.addresses?.[0]?.address;
      const fullAddress = addressObj
        ? `${addressObj.address1 || ""}, ${addressObj.city || ""}, ${addressObj.zip || ""}`
        : "";

      setTasks((prevData) => ({
        ...prevData,
        company: leadData.company || "",
        firstName: leadData.firstName || "",
        lastName: leadData.lastName || "",
        email: leadData.email || "",
        phoneNumber: leadData.phoneNumber || "",
        address: fullAddress || "",
      }));
      console.log('Lead Data', leadData)
    } catch (error) {
      console.error("Error fetching lead details:", error);
      toast.error("Failed to load lead details.");
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
        entityId: leadId,
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

  const InfoRow = ({ label, value }) => (
  <div>
    <strong className="block text-sm font-medium">{label}:</strong>
    <span className="text-base">{value || "N/A"}</span>
  </div>
);


  return (
  <div className="min-h-screen bg-gray-100 p-4 md:p-8">
    <div className="mx-auto max-w-7xl w-full">
      <h3 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Add Lead Task
      </h3>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-6 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assigned To */}
            <div>
              <label htmlFor="assignedToId" className="block text-sm font-semibold text-gray-700 mb-1">
                Assigned To: <span className="text-red-500">*</span>
              </label>
              <select
                id="assignedToId"
                name="assignedToId"
                value={tasks.assignedToId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.profile?.firstName || "Unnamed"} {user.profile?.lastName || ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Activity Type */}
            <div>
              <label htmlFor="activityTypeId" className="block text-sm font-semibold text-gray-700 mb-1">
                Activity Type: <span className="text-red-500">*</span>
              </label>
              <select
                id="activityTypeId"
                name="activityTypeId"
                value={tasks.activityTypeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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

            {/* Subject */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                Subject: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={tasks.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring focus:ring-blue-300"
                placeholder="Enter subject name..."
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={tasks.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Enter task description..."
              />
            </div>

            {/* Due Date */}
            <div className="md:col-span-2">
              <label htmlFor="activityDate" className="block text-sm font-semibold text-gray-700 mb-1">
                Due Date: <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="date"
                  id="activityDate"
                  name="activityDate"
                  value={tasks.activityDate}
                  onChange={handleChange}
                  className="px-4 py-2 w-full sm:w-auto border rounded-lg focus:ring focus:ring-blue-400 border-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => clearDate("activityDate")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Outcome */}
            <div>
              <label htmlFor="outcomeId" className="block text-sm font-semibold text-gray-700 mb-1">
                Outcome:
              </label>
              <select
                id="outcomeId"
                name="outcomeId"
                value={tasks.outcomeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Outcome Type</option>
                {outcomeTypes.map((outcome) => (
                  <option key={outcome.id} value={outcome.id}>
                    {outcome.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
                Notes:
              </label>
              <textarea
                id="notes"
                rows={3}
                name="notes"
                value={tasks.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Enter notes..."
              />
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex flex-col md:flex-row justify-between gap-4 pt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full md:w-1/2 bg-gray-500 text-white py-3 rounded-lg uppercase hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full md:w-1/2 bg-blue-600 text-white py-3 rounded-lg uppercase hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>

        {/* Lead Details Sidebar */}
        <div className="w-full lg:w-80 bg-blue-50 rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Lead Details</h2>
          <div className="space-y-3 text-gray-700">
            <InfoRow label="Lead Name" value={tasks.company} />
            <InfoRow label="Phone Number" value={tasks.phoneNumber} />
            <InfoRow label="First Name" value={tasks.firstName} />
            <InfoRow label="Last Name" value={tasks.lastName} />
            <InfoRow label="Email" value={tasks.email} />
            <InfoRow label="Address" value={tasks.address} />
          </div>
        </div>
      </div>
    </div>
    <ToastContainer />
  </div>
);

}

export default CreateLeadTask;
