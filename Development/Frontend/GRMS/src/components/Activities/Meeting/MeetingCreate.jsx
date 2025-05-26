import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";

function MeetingCreate() {
  const [meetingData, setMeetingData] = useState({
    entityId: "",
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
  const { opportunityId, leadId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTableData(),
      fetchCurrentUser(),
      fetchOpportunityDetails(),
      fetchLeadDetails(leadId),
    ]).then(() => {
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
    if (!loading && tableData.length > 0) {
      const entityTypes =
        tableData.find((item) => item.name === "EntityTypes")?.referenceItems ||
        [];

      const communicationTypes =
        tableData.find((item) => item.name === "CommunicationTypes")
          ?.referenceItems || [];

      const opportunityEntityTypes = entityTypes.find(
        (entity) => entity.code === "Opportunity"
      );
      const meetingCommunicationTypes = communicationTypes.find(
        (entity) => entity.code === "Online Meeting"
      );

      if (opportunityEntityTypes) {
        setMeetingData((prev) => ({
          ...prev,
          entityTypeId: opportunityEntityTypes.id,
        }));
      } else {
        console.error("Opportunity entity type not found in table data.");
        toast.error("Opportunity entity type not found in table data.");
      }

      if (meetingCommunicationTypes) {
        setMeetingData((prev) => ({
          ...prev,
          typeId: meetingCommunicationTypes.id,
        }));
      } else {
        console.error("Meeting communication type not found in table data.");
        toast.error("Meeting communication type not found in table data.");
      }
    }
  }, [loading, tableData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      // Prepare the request data without overwriting form values
      const requestData = {
        initiatorId: meetingData.createdById, // Use the actual value
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
        `${import.meta.env.VITE_API_URL}/marketing/Communication/create`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Meeting created successfully!");
      navigate("/getCommunications"); 
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to create meeting. Please try again.");
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
      setMeetingData((prevData) => ({
        ...prevData,
        name: opportunityData.name,
        statusId: opportunityData.statusId,
        estimatedValue: opportunityData.estimatedValue,
        stageId: opportunityData.stageId,
        description: opportunityData.description,
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

      const addressObj = leadData.addresses?.[0]?.address;
      const formattedAddress = addressObj
        ? `${addressObj.address1 || ""}, ${addressObj.city || ""}, ${
            addressObj.zip || ""
          }`
        : "";
      setMeetingData((prevData) => ({
        ...prevData,
        name: leadData.company || "Opportunity for " + leadData.company,
        firstName: leadData.firstName || "",
        lastName: leadData.lastName || "",
        leadName: leadData.company || "",
        address: formattedAddress,
      }));
      console.log("view", leadData);
    } catch (error) {
      console.error("Error fetching lead details:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8">
      {/* <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        disabled={loading}
      >
        X
      </button> */}
      <div className="mx-auto max-w-6xl">
        <h2 className="text-lg md:text-2xl font-bold mb-6 text-gray-800">
          Meeting Schedule Form
        </h2>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <form
            onSubmit={handleSubmit}
            className="flex-1 bg-white rounded-lg shadow-md p-4 md:p-6 space-y-4"
          >
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
            <input
              type="hidden"
              name="entityTypeId"
              value={meetingData.entityTypeId}
            />
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

          {/* Sidebar */}
          <div className="w-full lg:w-64 xl:w-72 mt-4 lg:mt-0">
            <div className="bg-blue-50 rounded-lg shadow-md p-4 h-full">
              <h2 className="text-xl md:text-lg font-semibold mb-4">
                Opportunity Details
              </h2>
              <div>
                <strong>Opportunity Name:</strong> {meetingData.name}
              </div>
              <div>
                <strong>Description:</strong> {meetingData.description}
              </div>
              <div>
                <strong>Estimated Value:</strong> ₹{meetingData.estimatedValue}
              </div>
              <div>
                <strong>Close Date:</strong> {meetingData.closeDate}
              </div>
              <div>
                <strong>Lead Name:</strong> {meetingData.leadName || "N/A"}
              </div>
              <div>
                <strong>Customer Name:</strong> {meetingData.firstName}{" "}
                {meetingData.lastName}
              </div>
              <div>
                <strong>Address:</strong>{" "}
                {meetingData.address || "No address available"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default MeetingCreate;
