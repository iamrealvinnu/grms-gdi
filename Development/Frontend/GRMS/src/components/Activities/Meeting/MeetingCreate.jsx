import React, { useState,useEffect } from 'react';
import axios from 'axios';

function MeetingCreate({opportunityId,onClose}) {
  const [meetingData, setMeetingData] = useState({
    organizerId: "",
    outcomeId:""
  });
  const [tableData,setTableData] = useState([]);

  const outcomeTypes =
    tableData.find((item) => item.name === "Outcomes")?.referenceItems || [];

    useEffect(() => {
      fetchTableData();
    }, []);

   const handleChange =(e) =>{
    const {name,value} = e.target;
    setMeetingData((prevData) => ({
      ...prevData,
      [name]: value
    }))
   } 

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


  return (
    <div className="relative">
      <button
      onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        X
      </button>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Meeting Schedule Form</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Organizer</label>
            <input
              type="text"
              name="caller"
              
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Agenda</label>
            <input
              type="text"
              name="recipient"
              
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Participants</label>
            <input
              type="text"
              name="subject"
             
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Outcome</label>
            <select
                name="outcomeId"
                value={meetingData.outcomeId}
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
            <label className="block text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="date"
             
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Types</label>
            <input
              type="text"
              name="date"
             
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Notes</label>
            <input
              type="text"
              name="date"
             
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Date/Time</label>
            <input
              type="date"
              name="date"
             
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Duration</label>
            <input
              type="date"
              name="date"
             
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save Meeting
          </button>
        </form>

        <hr className="my-6" />
      </div>
    </div>
  );
}

export default MeetingCreate