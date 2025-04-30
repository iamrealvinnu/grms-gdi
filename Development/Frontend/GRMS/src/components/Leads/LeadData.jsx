import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import axios from "axios";

// Register Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function LeadData() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [industries, setIndustries] = useState({});
  const [statuses, setStatuses] = useState({});
  const [countries, setCountries] = useState({});
  const [states, setStates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetchClients(); // Await here
      await fetchUsers(); // Await here
      await fetchReferenceData(); // Fetch reference data
      setLoading(false); //  Set loading to false *after* all fetches are done
    };
    fetchData();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Lead/all/true",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data && response.data.success && response.data.data) {
        setCustomers(response.data.data);
      } else {
        setCustomers([]);
      }
      console.log("fetched data:", response.data);
    } catch (err) {
      setError("Failed to fetch client data.");
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/User/all/true",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUsers(response.data.data || []); // Ensure data exists
      // console.log("abba", response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchReferenceData = async () => {
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
      const referenceData = response.data?.data || response.data;

      const industryMap = {};
      const statusMap = {};
      const countryMap = {};
      const stateMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "Industry Types") {
          reference.referenceItems.forEach((item) => {
            industryMap[item.id] = item.description;
          });
        } else if (reference.name === "Lead Status") {
          reference.referenceItems.forEach((item) => {
            statusMap[item.id] = item.code; 
          });
        } else if(reference.name === "Countries") {
          reference.referenceItems.forEach((item) => {
            countryMap[item.id] = item.description;
          });
        } else if(reference.name === "States") {
          reference.referenceItems.forEach((item) => {
            stateMap[item.id] = item.description;
          });
        }
      });
      setIndustries(industryMap);
      setStatuses(statusMap);
      setCountries(countryMap);
      setStates(stateMap);
    } catch (error) {
      console.error("Error fetching reference data:", error);
      setError("Failed to fetch reference data.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Prepare Data for Chart
  const monthlyCounts = customers.reduce((acc, customer) => {
    const month = new Date(customer.createdOnUtc).toLocaleString("default", {
      month: "long"
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(monthlyCounts),
    datasets: [
      {
        label: "Number of Clients per Month",
        data: Object.values(monthlyCounts),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: function (context) {
            const month = context.label || "Unknown";
            const clientCount = context.raw || 0;
            return `${month}: ${clientCount} clients`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month"
        }
      },
      y: {
        title: {
          display: true,
          text: "Number of Clients"
        },
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="p-5">
      {/* Add Client Button */}
      <div className="flex justify-end mb-4">
        <Link
          to="/addLead"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} /> Create Lead
        </Link>
      </div>

      {/* **Table Section** (First) */}
      <div className="overflow-x-auto shadow-lg rounded-lg mb-6">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">S.No</th>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Company Name</th>
              <th className="py-3 px-4 text-left">Lead Owner</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Industry</th>
              <th className="py-3 px-4 text-left">Number</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {customers
            .filter((customer) => statuses[customer.statusId] !== "Qualified")
            .map((customer, index) => (
              <tr key={customer.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4 hover:text-blue-700">
                  <Link to={`/clientData/${customer.id}`}>
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td className="py-2 px-4">{customer.company || "N/A"}</td>
                <td className="py-2 px-4">
                  {(() => {
                    const user = users.find(
                      (user) => user.id === customer.assignedToId
                    );
                    return user ? user.profile?.firstName : "N/A";
                  })()}
                </td>

                <td className="py-2 px-4 text-blue-600 underline">
                  <a href={`mailto:${customer.email}`}>{customer.email}</a>
                </td>
                <td className="py-2 px-4">
                  {industries[customer.industryId] || "N/A"}
                </td>
                <td className="py-2 px-4">{customer.phoneNumber || "N/A"}</td>
                <td className="py-2 px-4 font-bold text-gray-700">
                  {statuses[customer.statusId] || "Active"}
                </td>
                <td className="py-2 px-4">
                  {customer.addresses.length > 0 &&
                  customer.addresses[0].address ? (
                    <>
                      {customer.addresses[0].address.address1},{" "}
                      {customer.addresses[0].address.city},{" "}
                      {customer.addresses[0].address.zip},{" "}
                      {states[customer.addresses[0].address.stateId]},{" "}
                      {countries[customer.addresses[0].address.countryId]}
                    </>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* **Chart Section** (Below Table) */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-bold mb-2">
          Client Distribution by Company
        </h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default LeadData;



// import React, { useState, useEffect, useMemo } from "react";
// import { AgGridReact } from "ag-grid-react";
// import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
// import { ModuleRegistry } from "ag-grid-community";

// // Register required modules
// ModuleRegistry.registerModules([ClientSideRowModelModule]);
// import { Bar } from "react-chartjs-2";
// import { Link } from "react-router-dom";
// import { PlusCircle } from "lucide-react";
// import axios from "axios";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

// // Register Chart.js
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// function LeadData() {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [industries, setIndustries] = useState({});
//   const [statuses, setStatuses] = useState({});
//   const [countries, setCountries] = useState({});
//   const [states, setStates] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchClients();
//       await fetchUsers();
//       await fetchReferenceData();
//       setLoading(false);
//     };
//     fetchData();
//   }, []);

//   const fetchClients = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const response = await axios.get(
//         "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Lead/all/true",
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       if (response.data && response.data.success && response.data.data) {
//         setCustomers(response.data.data);
//       } else {
//         setCustomers([]);
//       }
//     } catch (err) {
//       setError("Failed to fetch client data.");
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const response = await axios.get(
//         "https://grms-dev.gdinexus.com:49181/api/v1/User/all/true",
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       setUsers(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const fetchReferenceData = async () => {
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

//       const industryMap = {};
//       const statusMap = {};
//       const countryMap = {};
//       const stateMap = {};

//       referenceData.forEach((reference) => {
//         if (reference.name === "Industry Types") {
//           reference.referenceItems.forEach((item) => {
//             industryMap[item.id] = item.description;
//           });
//         } else if (reference.name === "Lead Status") {
//           reference.referenceItems.forEach((item) => {
//             statusMap[item.id] = item.code;
//           });
//         } else if (reference.name === "Countries") {
//           reference.referenceItems.forEach((item) => {
//             countryMap[item.id] = item.description;
//           });
//         } else if (reference.name === "States") {
//           reference.referenceItems.forEach((item) => {
//             stateMap[item.id] = item.description;
//           });
//         }
//       });
//       setIndustries(industryMap);
//       setStatuses(statusMap);
//       setCountries(countryMap);
//       setStates(stateMap);
//     } catch (error) {
//       setError("Failed to fetch reference data.");
//     }
//   };

//   // Chart Data
//   const monthlyCounts = customers.reduce((acc, customer) => {
//     const month = new Date(customer.createdOnUtc).toLocaleString("default", {
//       month: "long"
//     });
//     acc[month] = (acc[month] || 0) + 1;
//     return acc;
//   }, {});

//   const chartData = {
//     labels: Object.keys(monthlyCounts),
//     datasets: [
//       {
//         label: "Number of Clients per Month",
//         data: Object.values(monthlyCounts),
//         backgroundColor: "rgba(54, 162, 235, 0.6)",
//         borderColor: "rgba(54, 162, 235, 1)",
//         borderWidth: 1
//       }
//     ]
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: true },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             return `${context.label}: ${context.raw} clients`;
//           }
//         }
//       }
//     },
//     scales: {
//       x: { title: { display: true, text: "Month" } },
//       y: { title: { display: true, text: "Number of Clients" }, ticks: { stepSize: 1 } }
//     }
//   };

//   // AG-Grid Column Definitions
//   const columnDefs = useMemo(() => [
//     { headerName: "S.No", valueGetter: "node.rowIndex + 1", sortable: false, width: 90 },
//     {
//       headerName: "Customer Name",
//       field: "fullName",
//       cellRenderer: (params) => {
//         return (
//           <Link to={`/clientData/${params.data.id}`} className="text-blue-700 underline">
//             {params.data.firstName} {params.data.lastName}
//           </Link>
//         );
//       },
//       sortable: true,
//       filter: true
//     },
//     { headerName: "Company", field: "company", sortable: true, filter: true },
//     {
//       headerName: "Lead Owner",
//       field: "assignedToId",
//       valueGetter: (params) => {
//         const user = users.find((u) => u.id === params.data.assignedToId);
//         return user ? user.profile?.firstName : "N/A";
//       },
//       sortable: true,
//       filter: true
//     },
//     {
//       headerName: "Email",
//       field: "email",
//       cellRenderer: (params) => (
//         <a href={`mailto:${params.value}`} className="text-blue-600 underline">
//           {params.value}
//         </a>
//       ),
//       sortable: true,
//       filter: true
//     },
//     {
//       headerName: "Industry",
//       field: "industryId",
//       valueGetter: (params) => industries[params.data.industryId] || "N/A",
//       sortable: true,
//       filter: true
//     },
//     { headerName: "Phone", field: "phoneNumber", sortable: true, filter: true },
//     {
//       headerName: "Status",
//       field: "statusId",
//       valueGetter: (params) => statuses[params.data.statusId] || "Active",
//       sortable: true,
//       filter: true,
//       cellClass: "font-bold text-gray-700"
//     },
//     {
//       headerName: "Address",
//       field: "addresses",
//       valueGetter: (params) => {
//         const addr = params.data.addresses?.[0]?.address;
//         if (!addr) return "N/A";
//         return `${addr.address1}, ${addr.city}, ${addr.zip}, ${states[addr.stateId]}, ${countries[addr.countryId]}`;
//       },
//       sortable: true,
//       filter: true
//     }
//   ], [industries, statuses, countries, states, users]);

//   const rowData = customers.filter((c) => statuses[c.statusId] !== "Qualified");

//   return (
//     <div className="p-5">
//       {/* Add Client Button */}
//       <div className="flex justify-end mb-4">
//         <Link
//           to="/addLead"
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
//         >
//           <PlusCircle size={20} /> Create Lead
//         </Link>
//       </div>

//       {/* AG Grid Table */}
//       <div className="ag-theme-alpine mb-8" style={{ height: 500, width: "100%" }}>
//         <AgGridReact
//           rowData={rowData}
//           columnDefs={columnDefs}
//           pagination={true}
//           paginationPageSize={10}
//           defaultColDef={{
//             sortable: true,
//             filter: true,
//             resizable: true
//           }}
//         />
//       </div>

//       {/* Chart Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-lg font-bold mb-2">Client Distribution by Company</h2>
//         <Bar data={chartData} options={chartOptions} />
//       </div>
//     </div>
//   );
// }

// export default LeadData;
