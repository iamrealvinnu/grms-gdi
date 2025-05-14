import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CallCreate({ opportunityId, onClose }) {
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    entityId: opportunityId,
    createdById: "",
    initiationDate: "",
    typeId: "",
    entityTypeId: "",
    inbound: false,
  });

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await fetchTableData();
      await fetchCurrentUser();
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

  const handleSubmit = (e) => {
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
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Communication/create",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Call log created successfully!");
      console.log("Call log created successfully:", response.data);
      onClose();
    } catch (error) {
      console.error("Error creating call log:", error);
      toast.error("Failed to create call log. Please try again.");
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
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        disabled={loading}
      >
        X
      </button>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Call Log Form</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Hidden inputs for hardcoded values */}
          <input
            type="hidden"
            name="entityTypeId"
            value={formData.entityTypeId}
          />
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
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save Call
          </button>
        </form>

        <hr className="my-6" />
      </div>
      <ToastContainer />
    </div>
  );
}

export default CallCreate;
