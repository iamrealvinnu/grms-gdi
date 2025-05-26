import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function GetCommunications() {
  const [communications, setCommunications] = useState([]);
  //   const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [outComes, setOutComes] = useState({});

  const communicationTypes =
    tableData.find((item) => item.name === "CommunicationTypes")
      ?.referenceItems || [];

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
      setTableData(response.data.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const fetchCommunications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/marketing/Communication/all/true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCommunications(response.data.data);
      console.log("Communications: ", response.data.data);
    } catch (error) {
      console.log("Fetching communications error: ", error);
      toast.error("Fetching communications error");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([fetchCommunications(), fetchTableData()]);
      setLoading(false); // Now all data has been fetched
    };

    fetchAllData();
  }, []);

  // Group communications by type
  const getCommunicationsByType = (typeCode) => {
    const type = communicationTypes.find((t) => t.code === typeCode);
    if (!type) return [];
    return communications.filter((comm) => comm.typeId === type.id);
  };

  const getTypeName = (typeId) => {
    const type = communicationTypes.find((t) => t.id === typeId);
    return type ? type.code : "Unknown Type";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 mt-4">
      {/* Responsive layout container */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Call Section */}
        <div className="w-full lg:w-1/3">
          <h5 className="text-md font-medium mb-2">Call</h5>
          {getCommunicationsByType("Phone").length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {getCommunicationsByType("Phone").map((communication, index) => (
                <div
                  key={communication.id || index}
                  className="relative w-full p-4 border rounded shadow-md bg-white"
                >
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button>
                      <FaEdit className="text-blue-500 hover:text-blue-700" />
                    </button>
                    <button>
                      <FaTrash className="text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                  <p><strong>Recipient:</strong>{communication.recipient}</p>
                  <p>
                    <strong>Subject:</strong> {communication.subject}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(communication.initiationDate).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mt-4">No Calls found.</p>
          )}
        </div>

        {/* Meeting Section */}
        <div className="w-full lg:w-1/3">
          <h5 className="text-md font-medium mb-2">Meeting</h5>
          {getCommunicationsByType("Online Meeting").length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {getCommunicationsByType("Online Meeting").map(
                (communication, index) => (
                  <div
                    key={communication.id || index}
                    className="relative w-full p-4 border rounded shadow-md bg-white"
                  >
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button>
                        <FaEdit className="text-blue-500 hover:text-blue-700" />
                      </button>
                      <button>
                        <FaTrash className="text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                    <p><strong>Participants:</strong>{communication.participants}</p>
                    <p>
                      <strong>Subject:</strong> {communication.subject}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(communication.initiationDate).toLocaleString()}
                    </p>
                    {communication.location && (
                      <p>
                        <strong>Location:</strong> {communication.location}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-500">No meeting data available yet.</p>
          )}
        </div>

        {/* Email Section */}
        <div className="w-full lg:w-1/3">
          <h5 className="text-md font-medium mb-2">Email</h5>
          {getCommunicationsByType("Email").length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {getCommunicationsByType("Email").map((communication, index) => (
                <div
                  key={communication.id || index}
                  className="relative w-full p-4 border rounded shadow-md bg-white"
                >
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button>
                      <FaEdit className="text-blue-500 hover:text-blue-700" />
                    </button>
                    <button>
                      <FaTrash className="text-red-500 hover:text-red-700" />
                    </button>
                  </div>  
                  <p><strong>To:</strong>{communication.recipient}</p>
                  <p>
                    <strong>Subject:</strong> {communication.subject}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(communication.initiationDate).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No email data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GetCommunications;
