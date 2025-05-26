// import axios from "axios";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// function GetAllActivities() {
//   const [activities, setActivities] = useState([]);
//   const [communications, setCommunications] = useState([]);
//   const navigate = useNavigate();
//   const [tableData, setTableData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [outComes,setOutComes] = useState({});

//   const communicationTypes =
//       tableData.find((item) => item.name === "CommunicationTypes")?.referenceItems || [];  

//    // Fetch reference data
//    const fetchTableData = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const response = await axios.get(
//         "https://grms-dev.gdinexus.com:49181/api/v1/Reference/all",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       const referenceData = response.data?.data || response.data;
//       const outComesMap = {};
//       referenceData.forEach((reference) =>{
//         if (reference.name === "Outcomes") {
//           reference.referenceItems.forEach((item) => {
//             outComesMap[item.id] = item.code;
//           });
//         }
//       });
//       setOutComes(outComesMap);
//       setTableData(response.data.data);
//     } catch (error) {
//       console.error("Error fetching table data:", error);
//     }
//   };

//   const fetchActivities = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const response = await axios.get(
//         "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Activity/all/true",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setActivities(response.data.data);
//       console.log("Activities: ", response.data.data);
//     } catch (error) {
//       console.log("Fetching activities error: ", error);
//       toast.error("Fetching activities error");
//     }
//   };

//   const fetchCommunications = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const response = await axios.get(
//         "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Communication/all/true",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setCommunications(response.data.data);
//       console.log("Communications: ", response.data.data);
//     } catch (error) {
//       console.log("Fetching communications error: ", error);
//       toast.error("Fetching communications error");
//     }
//   };

// useEffect(() => {
//   const fetchAllData = async () => {
//     await Promise.all([
//       fetchActivities(),
//       fetchCommunications(),
//       fetchTableData()
//     ]);
//     setLoading(false); // Now all data has been fetched
//   };

//   fetchAllData();
// }, []);


//   const handleTaskClick = (id) => {
//     navigate(`/updateTask/${id}`);
//   };

//   // Group communications by type
//   const getCommunicationsByType = (typeCode) => {
//     const type = communicationTypes.find((t) => t.code === typeCode);
//     if(!type) return [];
//     return communications.filter(comm => comm.typeId === type.id);
//   };

//   const getTypeName = (typeId) => {
//     const type = communicationTypes.find((t) => t.id === typeId);
//     return type ? type.code : "Unknown Type";
//   }

// if (loading) {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <p>Loading...</p>
//     </div>
//   );
// }


//   return (
//     <div className="p-4">
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold">Upcoming Activities</h3>
//         <div className="flex mt-4 flex-col space-y-6">
//           {/* Task Section */}
//           <div>
//             <h5 className="text-md font-medium mb-2">Task</h5>
//             {activities.length > 0 ? (
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {activities.map((activity, index) => (
//                   <div
//                     key={activity.id || index}
//                     className="relative w-1/4 p-4 mb-4 border rounded shadow-md bg-white"
//                   >
//                     <div className="absolute top-2 right-2 flex space-x-2">
//                       <button onClick={() => handleTaskClick(activity.id)}>
//                         <FaEdit className="text-blue-500 hover:text-blue-700" />
//                       </button>
//                       <button onClick={() => console.log("Delete", activity)}>
//                         <FaTrash className="text-red-500 hover:text-red-700" />
//                       </button>
//                     </div>

//                     <h4 className="font-bold text-md mt-3">{activity.name}</h4>
//                     <p><strong>Type:</strong> {activity.type}</p>
//                     <p><strong>OutCome:</strong> {outComes[activity.outcomeId] || "N/A"}</p>
//                     <p><strong>Description:</strong> {activity.description}</p>
//                     <p>
//                       <strong>Activity Date:</strong>{" "}
//                       {new Date(activity.activityDate).toLocaleString()}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-600 mt-4">No activities found.</p>
//             )}
//           </div>

//           {/* Call Section */}
//           <div>
//             <h5 className="text-md font-medium mb-2">Call</h5>
//             {getCommunicationsByType("Phone").length > 0 ? (
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {getCommunicationsByType("Phone").map((communication, index) => (
//                   <div
//                     key={communication.id || index}
//                     className="relative w-1/4 p-4 mb-4 border rounded shadow-md bg-white"
//                   >
//                     <div className="absolute top-2 right-2 flex space-x-2">
//                       <button >
//                         <FaEdit className="text-blue-500 hover:text-blue-700" />
//                       </button>
//                       <button >
//                         <FaTrash className="text-red-500 hover:text-red-700" />
//                       </button>
//                     </div>

//                     <h4 className="font-bold text-md mt-3">{communication.recipient}</h4>
//                     <p><strong>Type:</strong> {getTypeName(communication.typeId)}</p>
//                     <p><strong>Inbound:</strong>{" "}<span className={communication.inbound ? "text-green-600" : "text-red-600"}>
//                         {communication.inbound ? "Inbound" : "Outbound"}</span></p>
//                     <p><strong>Subject:</strong> {communication.subject}</p>
//                     <p>
//                       <strong>Date:</strong>{" "}
//                       {new Date(communication.initiationDate).toLocaleString()}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-600 mt-4">No Calls found.</p>
//             )}
//           </div>

//           {/* Meeting Sections */}
//           <div>
//             <h5 className="text-md font-medium mb-2">Meeting</h5>
//             {getCommunicationsByType("Online Meeting").length > 0 ? (
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {getCommunicationsByType("Online Meeting").map((communication, index) => (
//                   <div
//                     key={communication.id || index}
//                     className="relative w-1/4 p-4 mb-4 border rounded shadow-md bg-white"
//                   >
//                     <div className="absolute top-2 right-2 flex space-x-2">
//                       <button >
//                         <FaEdit className="text-blue-500 hover:text-blue-700" />
//                       </button>
//                       <button >
//                         <FaTrash className="text-red-500 hover:text-red-700" />
//                       </button>
//                     </div>

//                     <h4 className="font-bold text-md mt-3">{communication.recipient}</h4>
//                     <p><strong>Type:</strong> {getTypeName(communication.typeId)}</p>
//                     <p><strong>Subject:</strong> {communication.subject}</p>
//                     <p>
//                       <strong>Date:</strong>{" "}
//                       {new Date(communication.initiationDate).toLocaleString()}
//                     </p>
//                     {communication.location && (
//                       <p><strong>Location:</strong> {communication.location}</p>
//                     )}
//                     {communication.duration && (
//                       <p><strong>Duration:</strong> {communication.duration} minutes</p>
//                     )}
//                     </div>
//                 ))}
//                 </div> 
//               ):(
//                 <p className="text-gray-500">No meeting data available yet.</p>
//               )}
//           </div>

//            {/* Email Sections */}
//           <div>
//             <h5 className="text-md font-medium mb-2">Email</h5>
//             {getCommunicationsByType("Email").length > 0 ? (
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {getCommunicationsByType("Email").map((communication,index) =>(
//                   <div key={communication.id || index}
//                   className="relative w-1/4 p-4 mb-4 border rounded shadow-md bg-white"
//                   >
//                     <div className="absolute top-2 right-2 flex space-x-2">
//                       <button >
//                         <FaEdit className="text-blue-500 hover:text-blue-700" />
//                       </button>
//                       <button >
//                         <FaTrash className="text-red-500 hover:text-red-700" />
//                       </button>
//                     </div>
//                     <h4 className="font-bold text-md mt-3">{communication.recipient}</h4>
//                     <p><strong>Escalated:</strong> {communication.participants}</p>
//                     <p><strong>Type:</strong>{getTypeName(communication.typeId)}</p>
//                     <p><strong>Subject:</strong>{communication.subject}</p>
//                     {/* <p><strong>Description:</strong>{communication.notes}</p> */}
//                     <p><strong>Date:</strong>{" "}{new Date(communication.initiationDate).toLocaleString()}</p>
//                     {communication.attachments?.length > 0 && (
//                       <p><strong>Attachments:</strong>{communication.attachments.length}</p>
//                       )}
//                     </div>
//                 ))}
//                 </div>
//             ) : (
//               <p className="text-gray-500">No email data available yet.</p>
//               )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GetAllActivities;


import React from 'react';
import { useNavigate } from 'react-router-dom'; // import useNavigate

function GetAllActivities() {
  const navigate = useNavigate(); // initialize the navigate function

  return (
    <div className="flex justify-center items-center mt-10 gap-4 flex-wrap p-4">
      <div
        onClick={() => navigate('/getTasks')} // call navigate on click
        className="cursor-pointer bg-white shadow-md rounded-xl p-6 w-48 text-center hover:bg-slate-400 font-medium hover:shadow-lg transition"
      >
        Task
      </div>
      <div 
      onClick={() => navigate('/getCommunications')}
      className="bg-white shadow-md rounded-xl p-6 w-48 text-center hover:bg-slate-400 font-medium hover:shadow-lg transition">
        Communication
      </div>
    </div>
  );
}

export default GetAllActivities;
