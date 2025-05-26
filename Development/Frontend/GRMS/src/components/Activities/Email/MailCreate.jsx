import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

function MailCreate() {
  const [form, setForm] = useState({
    recipient: "",
    participants: "",
    hiddenParticipants: "",
    subject: "",
    initiationDate: "",
    notes: "",
    attachments: [],
    entityId: "",
    entityTypeId: "",
    typeId: "",
    createdById: "",
  });

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {opportunityId,leadId} = useParams();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachments") {
      setForm({ ...form, [name]: files });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTableData(), fetchCurrentUser(),fetchOpportunityDetails(),fetchLeadDetails(leadId)]).then(() => {
      setLoading(false);
    });
  }, []);

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
        setForm((prev) => ({ ...prev, createdById: userId }));
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
      const emailCommunicationType = communicationTypes.find(
        (communication) => communication.code === "Email"
      );

      if (opportunityEntityType) {
        setForm((prev) => ({
          ...prev,
          entityTypeId: opportunityEntityType.id,
        }));
      } else {
        console.error("Opportunity entity type not found in table data.");
        toast.error("Opportunity entity type not found in table data.");
      }

      if (emailCommunicationType) {
        setForm((prev) => ({
          ...prev,
          typeId: emailCommunicationType.id,
        }));
      } else {
        console.error("Email communication type not found in table data.");
        toast.error("Email communication type not found in table data.");
      }
    }
    
  }, [loading, tableData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const processAttachments = async () => {
        const attachments = [];
        for (const file of form.attachments) {
          const data = await toBase64(file);
          attachments.push({
            name: file.name,
            mimeType: file.type || "application/octet-stream",
            data: data.split(",")[1], // Remove the data URL prefix
          });
        }
        return attachments;
      };

      const attachments = await processAttachments();
      const formData = {
        initiatorId: form.createdById,
        recipient: form.recipient,
        participants: form.participants,
        subject: form.subject,
        hiddenParticipants: form.hiddenParticipants,
        notes: form.notes,
        entityId: opportunityId,
        entityTypeId: form.entityTypeId,
        typeId: form.typeId,
        initiationDate: form.initiationDate,
        createdById: form.createdById,
        attachments: attachments,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/marketing/Communication/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Mail created successfully!");
      navigate("/getCommunications");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error sending email. Please try again.");
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });


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
      setForm((prevData) => ({
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
      setForm((prevData) => ({
        ...prevData,
        name: leadData.company || "Opportunity for " + leadData.company,
        firstName: leadData.firstName || "",
        lastName: leadData.lastName || "",
        leadName: leadData.company || "",
        email: leadData.email || "",
      }));
      console.log("view", leadData);
    } catch (error) {
      console.error("Error fetching lead details:", error);
    }
  };  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  const handleEmailTemplateCreate = () => {
    navigate(`/createTemplate`);
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
        <div className="flex justify-between items-center mb-4">
          <button>Email</button>
          <button className="bg-slate-50 hover:bg-slate-400 p-2 rounded-md " onClick={handleEmailTemplateCreate}>Create Email Template</button>
          <button>Mass Email</button>
        </div>
      <h2 className="text-lg md:text-2xl font-bold mb-6 text-gray-800"> Compose Email </h2>
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

        <form onSubmit={handleSubmit} className="flex-1 bg-white rounded-lg shadow-md p-4 md:p-6 space-y-4">
          <div>
            <label className="block font-semibold">To:</label>
            <input
              type="email"
              name="recipient"
              value={form.recipient}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">CC:</label>
            <input
              type="email"
              name="participants"
              value={form.participants}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">BCC:</label>
            <input
              type="email"
              name="hiddenParticipants"
              value={form.hiddenParticipants}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Subject:</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Message:</label>
            <textarea
              name="notes"
              value={form.message}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="5"
              style={{ fontSize: "14px", fontFamily: "Arial" }}
            />
          </div>

          {/* Hidden inputs for hardcoded values */}
          <input type="hidden" name="entityTypeId" value={form.entityTypeId} />
          <input type="hidden" name="typeId" value={form.typeId} />

          <div>
            <label className="block font-semibold">Attachments:</label>
            <input
              type="file"
              name="attachments"
              onChange={(e) =>
                setForm({ ...form, attachments: Array.from(e.target.files) })
              }
              multiple
              className="block w-full text-sm text-gray-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Date/Time</label>
            <input
              type="date"
              name="initiationDate"
              value={form.initiationDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </form>

         {/* Sidebar */}
        <div className="w-full lg:w-64 xl:w-72 mt-4 lg:mt-0">
          <div className="bg-blue-50 rounded-lg shadow-md p-4 h-full">
            <h2 className="text-xl md:text-lg font-semibold mb-4">
              Opportunity Details
            </h2>
            <div><strong>Opportunity Name:</strong> {form.name}</div>
            <div><strong>Description:</strong> {form.description}</div>
            <div><strong>Estimated Value:</strong> ₹{form.estimatedValue}</div>
            <div><strong>Close Date:</strong> {form.closeDate}</div>
            <div><strong>Lead Name:</strong> {form.leadName || "N/A"}</div>
            <div><strong>Customer Name:</strong> {form.firstName} {form.lastName}</div>
            <div><strong>Email:</strong> {form.email}</div>
          </div>
        </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default MailCreate;
