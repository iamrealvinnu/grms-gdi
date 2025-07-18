import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function GetTasks() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [outComes, setOutComes] = useState({});
  const [selectedFilter, setSelectedFilter] = useState("All Time");
  const navigate = useNavigate();

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
      const referenceData = response.data?.data || response.data;
      const outComesMap = {};
      referenceData.forEach((reference) => {
        if (reference.name === "Outcomes") {
          reference.referenceItems.forEach((item) => {
            outComesMap[item.id] = item.code;
          });
        }
      });
      setOutComes(outComesMap);
    } catch (error) {
      console.error("Error fetching reference data:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/marketing/Activity/all/true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setActivities(response.data.data);
    } catch (error) {
      toast.error("Fetching activities error");
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([fetchActivities(), fetchTableData()]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  const getFilteredActivities = () => {
    const now = new Date();
    return activities.filter((activity) => {
      const actDate = new Date(activity.activityDate);
      switch (selectedFilter) {
        case "Last 7 Days":
          return actDate >= new Date(new Date().setDate(new Date().getDate() - 7));
        case "Next 7 Days":
          return (
            actDate >= now &&
            actDate <= new Date(new Date().setDate(new Date().getDate() + 7))
          );
        case "Last 30 Days":
          return actDate >= new Date(new Date().setDate(new Date().getDate() - 30));
        case "All Time":
        default:
          return true;
      }
    });
  };

  const grouped = {
    todo: [],
    inprogress: [],
    followup: [],
    completed: [],
  };

  const handleEditTask = (id) => {
    navigate(`/updateTask/${id}`);
  };

  getFilteredActivities().forEach((activity) => {
    const label = outComes[activity.outcomeId]?.toLowerCase() || "";
    if (label.includes("progress")) {
      grouped.inprogress.push(activity);
    } else if (label.includes("follow up")) {
      grouped.followup.push(activity);
    } else if (label.includes("complete")) {
      grouped.completed.push(activity);
    } else {
      grouped.todo.push(activity);
    }
  });

  const renderColumn = (title, tasks, color) => (
    <div className="w-full md:w-1/3 px-2">
      <div className={`bg-${color}-100 p-4 rounded shadow min-h-[300px]`}>
        <h3 className={`text-lg font-bold mb-4 text-${color}-700`}>{title}</h3>
        {tasks.length > 0 ? (
          tasks.map((activity) => (
            <div
              key={activity.id}
              className="bg-white p-3 mb-3 rounded shadow relative"
            >
              <div className="absolute top-2 right-2 flex space-x-2">
                <button onClick={() => handleEditTask(activity.id)}>
                  <FaEdit className="text-blue-500 hover:text-blue-700" />
                </button>
                <button onClick={() => console.log("Delete", activity.id)}>
                  <FaTrash className="text-red-500 hover:text-red-700" />
                </button>
              </div>
              <h4 className="font-bold text-md">{activity.name}</h4>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-sm">
                <strong>Outcome:</strong>{" "}
                {outComes[activity.outcomeId] || "Unspecified"}
              </p>
              <p className="text-sm">
                <strong>Due Date:</strong>{" "}
                {new Date(activity.activityDate).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No tasks.</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Tasks</h2>

      {/* Date Range Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["Last 7 Days", "Next 7 Days", "Last 30 Days", "All Time"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`py-2 px-4 rounded ${
              selectedFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Kanban Columns */}
      <div className="flex flex-col md:flex-row -mx-2 gap-4">
        {renderColumn("To Do", grouped.todo, "red")}
        {renderColumn("In Progress", grouped.inprogress, "yellow")}
        {renderColumn("Follow Up", grouped.followup, "blue")}
        {renderColumn("Completed", grouped.completed, "green")}
      </div>
    </div>
  );
}

export default GetTasks;
