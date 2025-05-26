import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams } from "react-router-dom";

function UpdateTask() {
  const [showTask, setShowTask] = useState({
    name: "",
    assignedToId: "",
    type: "Opportunity",
    entityId: "",
    activityTypeId: "",
    description: "",
    outcomeId: "",
    notes: "",
    activityDate: "",
    changedById: "",
  });
  const [outComes, setOutComes] = useState({});
  const [activityTypes, setActivityTypes] = useState({});
  const [showusers, setShowUsers] = useState({});
  const { activityId } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchActivities();
    fetchUserDetails();
    fetchTableData();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/marketing/Activity/one/${activityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const tasks = response.data?.data || response.data;
      setShowTask({
        name: tasks.name || "",
        assignedToId: tasks.assignedToId || "",
        type: tasks.type || "Opportunity",
        entityId: tasks.entityId || "",
        activityTypeId: tasks.activityTypeId || "",
        description: tasks.description || "",
        outcomeId: tasks.outcomeId || "",
        notes: tasks.notes || "",
        activityDate: tasks.activityDate || "",
        changedById: tasks.changedById || "",
      });
      console.log("fetched data:", response.data.data);
    } catch (error) {
      console.log("fetch datas: ", error);
      toast.error("Fetching activities error");
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
       `${import.meta.env.VITE_API_URL}/User/all/true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowUsers(response.data.data);
      console.log("users", response.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchTableData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/Reference/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const referenceData = response.data?.data || response.data;
      const activityTypeMap = {};
      const outcomeMap = {};
      referenceData.forEach((reference) => {
        if (reference.name === "Activity Types") {
          reference.referenceItems.forEach((item) => {
            activityTypeMap[item.id] = item.description;
          });
        } else if (reference.name === "Outcomes") {
          reference.referenceItems.forEach((item) => {
            outcomeMap[item.id] = item.description;
          });
        }
      });
      setActivityTypes(activityTypeMap);
      setOutComes(outcomeMap);
    } catch (error) {
      console.log("fetch table data: ", error);
      toast.error("Fetching table data error");
    }
  };

  const handleTasKUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
    } catch (error) {
      console.log("Error updating task:", error);
      toast.error("Error updating task");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <form onSubmit={handleTasKUpdate}>
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Update Task Activities
          </h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-[48%] mb-2">
            <label className="block text-gray-700 font-medium mb-1">
              Assigned To
            </label>
            <select
              type="text"
              name="assignedToId"
              value={showTask.assignedToId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select User</option>
              {showusers &&
                Array.isArray(showusers) &&
                showusers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.profile?.firstName} {user.profile?.lastName}
                  </option>
                ))}
            </select>
          </div>
          {/* <div className="w-full md:w-[48%]">
            <label className="block text-gray-700 font-medium mb-1">
              Related to:
            </label>
            <input
              type="text"
              name="entityId"
              value={showTask.entityId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-[48%] mb-2">
            <label className="block text-gray-700 font-medium mb-1">
              Subject:
            </label>
            <input
              type="text"
              name="name"
              value={showTask.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-[48%]">
            <label className="block text-gray-700 font-medium mb-1">
              Activity Type:
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type=""
              name="activityTypeId"
              value={showTask.activityTypeId}
              onChange={handleChange}
            >
              <option value="">Select Activity Type</option>
              {Object.entries(activityTypes).map(([key, description]) => (
                <option key={key} value={key}>
                  {description}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-[48%] mb-2">
            <label className="block text-gray-700 font-medium mb-1">
              Description:
            </label>
            <textarea
              name="description"
              value={showTask.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
          <div className="w-full md:w-[48%] mb-2">
            <label className="block text-gray-700 font-medium mb-1">
              Due Date:
            </label>
            <input
              type="date"
              name="activityDate"
              value={showTask.activityDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-[48%] mb-2">
            <label className="block text-gray-700 font-medium mb-1">
              Outcome:
            </label>
            <select
              type=""
              name="outcomeId"
              value={showTask.outcomeId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Outcome</option>
              {Object.entries(outComes).map(([key, description]) => (
                <option key={key} value={key}>
                  {description}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-[48%] mb-2">
            <label className="block text-gray=700 font-medium mb-1">
              Reminder:
            </label>
            <input
              type=""
              name="notes"
              value={showTask.notes}
              description={showTask.notes}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full mb-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Update
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default UpdateTask;
