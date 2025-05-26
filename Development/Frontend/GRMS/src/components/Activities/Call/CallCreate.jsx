import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams,useNavigate } from "react-router-dom";

function CallCreate() {
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    entityId: "",
    createdById: "",
    initiationDate: "",
    typeId: "",
    entityTypeId: "",
    inbound: false,
  });

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { opportunityId, leadId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await fetchTableData();
      await fetchCurrentUser();
      await fetchOpportunityDetails();
      await fetchLeadDetails(leadId);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
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
        setFormData((prev) => ({ ...prev, createdById: userId }));
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

      const opportunityEntityType = entityTypes.find(
        (entity) => entity.code === "Opportunity"
      );
      const phoneCommunicationType = communicationTypes.find(
        (communication) => communication.code === "Phone"
      );

      if (opportunityEntityType) {
        setFormData((prev) => ({
          ...prev,
          entityTypeId: opportunityEntityType.id,
        }));
      } else {
        console.warn("Opportunity entity type not found in reference data.");
        toast.error("Opportunity entity type not found in reference data.");
      }

      if (phoneCommunicationType) {
        setFormData((prev) => ({ ...prev, typeId: phoneCommunicationType.id }));
      } else {
        console.warn("Phone communication type not found in reference data.");
        toast.error("Phone communication type not found in reference data.");
      }
    }
  }, [loading, tableData]);

  const handleCallSubmit = (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      // Prepare the request data without overwriting form values
      const requestData = {
        initiatorId: formData.createdById, // Use the actual value
        recipient: formData.recipient,
        subject: formData.subject,
        initiationDate: formData.initiationDate,
        entityId: opportunityId,
        entityTypeId: formData.entityTypeId,
        typeId: formData.typeId,
        createdById: formData.createdById,
        inbound: formData.inbound,
      };
      const response = axios.post(
       `${import.meta.env.VITE_API_URL}/marketing/Communication/create`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Call log created successfully!");
      console.log("Call log created successfully:", response.data);
      navigate("/getCommunications");
    } catch (error) {
      console.error("Error creating call log:", error);
      toast.error("Failed to create call log. Please try again.");
    }
  };

  const fetchOpportunityDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/marketing/Opportunity/one/${opportunityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const opportunityData = response.data?.data || response.data;
      setFormData((prevData) => ({
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
      setFormData((prevData) => ({
        ...prevData,
        name: leadData.company || "Opportunity for " + leadData.company,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

 return (
  <div className="min-h-screen bg-gray-200 p-4 md:p-8">
    <div className="mx-auto max-w-6xl">
      <h2 className="text-lg md:text-2xl font-bold mb-6 text-gray-800">
        Call Log Form
      </h2>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        
        {/* Form Section */}
        <form onSubmit={handleCallSubmit} className="flex-1 bg-white rounded-lg shadow-md p-4 md:p-6 space-y-4">
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

          <input type="hidden" name="entityTypeId" value={formData.entityTypeId} />
          <input type="hidden" name="typeId" value={formData.typeId} />

          <div>
            <label className="block text-gray-700 mb-1">Date/Time</label>
            <input
              type="date"
              name="initiationDate"
              value={formData.initiationDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="inline-flex items-center text-gray-700 mb-1">
              <input
                type="checkbox"
                name="inbound"
                checked={formData.inbound}
                onChange={handleChange}
                className="mr-2"
              />
              Inbound
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full md:w-auto px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save Call
          </button>
        </form>

        {/* Sidebar */}
        <div className="w-full lg:w-64 xl:w-72 mt-4 lg:mt-0">
          <div className="bg-blue-50 rounded-lg shadow-md p-4 h-full">
            <h2 className="text-xl md:text-lg font-semibold mb-4">
              Opportunity Details
            </h2>
            <div><strong>Opportunity Name:</strong> {formData.name}</div>
            <div><strong>Description:</strong> {formData.description}</div>
            <div><strong>Estimated Value:</strong> ₹{formData.estimatedValue}</div>
            <div><strong>Close Date:</strong> {formData.closeDate}</div>
            <div><strong>Lead Name:</strong> {formData.leadName || "N/A"}</div>
            <div><strong>Customer Name:</strong> {formData.firstName} {formData.lastName}</div>
            <div><strong>Mobile Number:</strong> {formData.phoneNumber || "N/A"}</div>

          </div>
        </div>
      </div>
    </div>
    <ToastContainer />
  </div>
);
}
export default CallCreate;