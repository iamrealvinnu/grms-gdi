import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MeetingCreate({ opportunityId, onClose }) {
  const [meetingData, setMeetingData] = useState({
    entityId: opportunityId,
    entityTypeId: "",
    notes: "",
    participants: "",
    location: "",
    subject: "",
    typeId: "",
    initiationDate: "",
    recipient: "",
    duration: "",
    createdById: "",
  });
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTableData(),fetchCurrentUser()]).then(() => {
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fetch reference data
  const fetchTableData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/Reference/all",
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

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] || "";
        setMeetingData((prev) => ({ ...prev, createdById: userId }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  useEffect(() => {
    if(!loading && tableData.length > 0) {
      const entityTypes =
      tableData.find((item) => item.name === "EntityTypes")?.referenceItems || [];
  
      const communicationTypes =
      tableData.find((item) => item.name === "CommunicationTypes")?.referenceItems || [];  
  
      const opportunityEntityTypes = entityTypes.find((entity) => entity.code === "Opportunity");
      const meetingCommunicationTypes = communicationTypes.find((entity) => entity.code === "Online Meeting");

      if (opportunityEntityTypes) {
        setMeetingData((prev) => ({ ...prev, entityTypeId: opportunityEntityTypes.id }));
      } else {
        console.error("Opportunity entity type not found in table data.");
        toast.error("Opportunity entity type not found in table data.");
      }

      if (meetingCommunicationTypes) {
        setMeetingData((prev) => ({ ...prev, typeId: meetingCommunicationTypes.id }));
      } else {
        console.error("Meeting communication type not found in table data.");
        toast.error("Meeting communication type not found in table data.");
      }
    }

  },[loading, tableData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      // Prepare the request data without overwriting form values
      const requestData = {
        initiatorId: meetingData.createdById,  // Use the actual value
        recipient: meetingData.recipient,
        participants: meetingData.participants,
        subject: meetingData.subject,
        initiationDate: meetingData.initiationDate,
        entityId: opportunityId,
        entityTypeId: meetingData.entityTypeId,
        createdById: meetingData.createdById,
        location: meetingData.location,
        duration: meetingData.duration,
        notes: meetingData.notes, 
        typeId: meetingData.typeId,       
      };
      const response = await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Communication/create",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Meeting created successfully!");
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to create meeting. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        disabled={loading}
      >
        X
      </button>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Meeting Schedule Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Agenda</label>
            <input
              type="text"
              name="subject"
              value={meetingData.subject}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Participants</label>
            <input
              type="text"
              name="participants"
              value={meetingData.participants}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Hidden inputs for hardcoded values */}
          <input type="hidden" name="entityTypeId" value={meetingData.entityTypeId} />
          <input type="hidden" name="typeId" value={meetingData.typeId} />

          <div>
            <label className="block text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={meetingData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Description:</label>
            <input
              type="text"
              name="notes"
              value={meetingData.notes}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Date/Time</label>
            <input
              type="date"
              name="initiationDate"
              value={meetingData.initiationDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              value={meetingData.duration}
              onChange={handleChange}
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
      <ToastContainer />
    </div>
  );
}

export default MeetingCreate;
