import React, { useState,useEffect } from "react";
import axios from "axios";

function CallCreate({ opportunityId, onClose }) {
  const [formData, setFormData] = useState({
    caller: "",
    recipient: "",
    subject: "",
    outcomeId: "",
    datetime: ""
  });

  const [tableData, setTableData] = useState([]);
  

  const outcomeTypes =
    tableData.find((item) => item.name === "Outcomes")?.referenceItems || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

   useEffect(() => {
      fetchTableData();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setActivities((prevActivities) => [...prevActivities, formData]);
    setFormData({
      caller: "",
      recipient: "",
      subject: "",
      outcomeId: "",
      datetime: ""
    });
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        X
      </button>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Call Log Form</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Caller</label>
            <input
              type="text"
              name="caller"
              value={formData.caller}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Recipient</label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Outcome</label>
           <select
                name="outcomeId"
                value={formData.outcomeId}
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

          <div>
            <label className="block text-gray-700 mb-1">Date/Time</label>
            <input
              type="date"
              name="date"
              value={formData.datetime}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save Call
          </button>
        </form>

        <hr className="my-6" />
      </div>
    </div>
  );
}

export default CallCreate;
