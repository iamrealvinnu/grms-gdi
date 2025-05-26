import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// import { FaTasks } from "react-icons/fa";
// import { IoCall, IoSettings } from "react-icons/io5";
// import { MdEmail } from "react-icons/md";
// import { FaPeopleGroup } from "react-icons/fa6";

function ViewOpportunity() {
  const { opportunityId, leadId } = useParams();
  const navigate = useNavigate();
  const [formOpportunityData, setFormOpportunityData] = useState({
    name: "",
    description: "",
    statusId: "",
    stageId: "",
    estimatedValue: "",
    closeDate: "",
    productLineId: "",
    changedById: "",
    leadName: "",
  });

  const [opportunityStagesTypes, setOpportunityStagesTypes] = useState({});
  const [opportunityStatusTypes, setOpportunityStatusTypes] = useState({});
  const [opportunityProductTypes, setOpportunityProductTypes] = useState({});
  const [leadDetails, setLeadDetails] = useState(null);

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
    setFormOpportunityData((prevData) => ({
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
      const referenceData = response.data.data;

      const stagesMap = {};
      const statusMap = {};
      const productMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "Opportunity Stages") {
          reference.referenceItems.forEach((item) => {
            stagesMap[item.id] = item.code;
          });
        } else if (reference.name === "Opportunity Status") {
          reference.referenceItems.forEach((item) => {
            statusMap[item.id] = item.code;
          });
        } else if (reference.name === "Opportunity Product Line") {
          reference.referenceItems.forEach((item) => {
            productMap[item.id] = item.code;
          });
        }
      });

      setOpportunityStagesTypes(stagesMap);
      setOpportunityStatusTypes(statusMap);
      setOpportunityProductTypes(productMap);
    } catch (error) {
      console.error("Error fetching table data:", error);
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
      setLeadDetails(leadData);
      setFormOpportunityData((prevData) => ({
        ...prevData,
        name: leadData.company || "Opportunity for " + leadData.company,
      firstName: leadData.firstName || "",
      lastName: leadData.lastName || "",
      leadName: leadData.company || "",
      }));
      console.log("view",leadData);
    } catch (error) {
      console.error("Error fetching lead details:", error);
    }
  };

  useEffect(() => {
    fetchOpportunityDetails();
    fetchTableData();
    fetchLeadDetails(leadId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full bg-blue-50 shadow-md rounded-lg p-6 space-y-4">
            <h2 className="text-lg md:text-md font-semibold mb-4">
              Opportunity Details
            </h2>
            <div><strong>Name:</strong> {formOpportunityData.name}</div>
            <div><strong>Description:</strong> {formOpportunityData.description}</div>
            <div>
              <strong>Status:</strong>{" "}
              {opportunityStatusTypes[formOpportunityData.statusId] || "N/A"}
            </div>
            <div>
              <strong>Stage:</strong>{" "}
              {opportunityStagesTypes[formOpportunityData.stageId] || "N/A"}
            </div>
            <div>
              <strong>Product Line:</strong>{" "}
              {opportunityProductTypes[formOpportunityData.productLineId] || "N/A"}
            </div>
            <div>
              <strong>Estimated Value:</strong> ₹{formOpportunityData.estimatedValue}
            </div>
            <div>
              <strong>Close Date:</strong> {formOpportunityData.closeDate}
            </div>
            <div>
              <strong>Lead Name:</strong>{" "}
              {formOpportunityData.leadName || leadDetails?.company || "N/A"}
            </div>
            <div>
              <strong>Customer Name:</strong>{" "}
              {formOpportunityData.firstName}{formOpportunityData.lastName}
            </div>
          </div>

          {/* <div className="w-full lg:w-64 xl:w-72">
            <div className="bg-blue-50 rounded-lg shadow-md p-4 h-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:bg-blue-100 transition">
                  <FaTasks className="text-blue-500 text-2xl mb-2" />
                  <span className="text-sm font-medium text-gray-700">Task</span>
                </button>
                <button className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:bg-blue-100 transition">
                  <IoCall className="text-green-500 text-2xl mb-2" />
                  <span className="text-sm font-medium text-gray-700">Call</span>
                </button>
                <button className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:bg-blue-100 transition">
                  <MdEmail className="text-yellow-500 text-2xl mb-2" />
                  <span className="text-sm font-medium text-gray-700">Email</span>
                </button>
                <button className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:bg-blue-100 transition">
                  <FaPeopleGroup className="text-purple-500 text-2xl mb-2" />
                  <span className="text-sm font-medium text-gray-700">Meeting</span>
                </button>
              </div>
              <div className="mt-4">
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:bg-blue-100 transition">
                  <IoSettings className="text-gray-600 text-2xl mb-2" />
                  <span className="text-sm font-medium text-gray-700">Settings</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default ViewOpportunity;
