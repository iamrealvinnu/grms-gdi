import React, { useEffect, useState } from "react";
import axios from "axios";

function CreateTask() {
  const [tasks, setTasks] = useState({
    name: "",
    type: "",
    entityId: "",
    description: "",
    outcomeId: "",
    notes: "",
    assignedToId: "",
    createdById: "",
    activityDate: ""
  });

  const [tableData,setTableData] = useState([]);
  const [users,setUsers] = useState([]);

  const outcomeTypes = tableData.find((item) => item.name === "Outcomes")?.referenceItems || [];

  useEffect(() =>{
    fetchTableData();
    fetchUsers();
  },[]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Task:", tasks);
    // You can add your API call here
  };

  return (
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
              <input
                type="text"
                name="entityId"
                value={tasks.entityId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Related to what?"
              />
            </div>
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
              <option value="" >Select Outcome Type</option>
              {outcomeTypes.map((outcome)=>(
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
  );
}

export default CreateTask;
