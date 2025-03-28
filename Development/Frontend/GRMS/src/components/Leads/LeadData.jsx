// import React from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Link, useNavigate } from "react-router-dom";
// import { PlusCircle } from "lucide-react";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// function ClientData() {
//   const navigate = useNavigate();

//   const handleDetails = (userId) =>{
//     navigate(`/clientData/${userId}`);
//   }
//   const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

//   const data = {
//     labels: labels,
//     datasets: [
//       {
//         label: "Monthly Clients",
//         data: [65, 59, 80, 81, 56, 55, 40],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.6)",
//           "rgba(255, 159, 64, 0.6)",
//           "rgba(255, 205, 86, 0.6)",
//           "rgba(75, 192, 192, 0.6)",
//           "rgba(54, 162, 235, 0.6)",
//           "rgba(153, 102, 255, 0.6)",
//           "rgba(201, 203, 207, 0.6)",
//         ],
//         borderColor: [
//           "rgb(255, 99, 132)",
//           "rgb(255, 159, 64)",
//           "rgb(255, 205, 86)",
//           "rgb(75, 192, 192)",
//           "rgb(54, 162, 235)",
//           "rgb(153, 102, 255)",
//           "rgb(201, 203, 207)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: true,
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: "Client Statistics",
//         font: {
//           size: 18,
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   const customers = [
//     {
//       id: 1,
//       name: "John Prashanth",
//       company: "Tech Innovation",
//       leadOwner: "Anupama",
//       email: "john@example.com",
//       number: "+1 234 567 8901",
//       status: "Active",
//       address: "123 Main St, Delhi, india",
//     },
//     {
//       id: 2,
//       name: "Mari muthu",
//       company: "JS auto cast Ltd",
//       leadOwner: "Michael",
//       email: "mari.muthu@example.com",
//       number: "+91 8989565520",
//       status: "Pending",
//       address: "456 Elm St, Avadi,chennai",
//     },
//     {
//       id: 3,
//       name: "Mary",
//       company: "FinTech Solutions",
//       leadOwner: "Abdul",
//       email: "mary@example.com",
//       number: "+91 9988556644",
//       status: "Inactive",
//       address: "789 Oak St,Kilpauk, chennai",
//     },
//   ];

//   return (
//     <div className="p-5">

//       {/* Add Client Button */}
//       <div className="flex justify-end mb-4">
//         <Link
//           to="/addClient"
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
//         >
//           <PlusCircle size={20} /> Create Lead
//         </Link>
//       </div>
//       {/* Table Section */}
//       <div className="overflow-x-auto shadow-lg rounded-lg">

//         <table className="min-w-full border border-gray-300 bg-white">
//           <thead className="bg-gray-800 text-white">
//             <tr>
//               <th className="py-3 px-4 text-left">S.No</th>
//               <th className="py-3 px-4 text-left">Customer Name</th>
//               <th className="py-3 px-4 text-left">Company Name</th>
//               <th className="py-3 px-4 text-left">Lead Owner</th>
//               <th className="py-3 px-4 text-left">Email</th>
//               <th className="py-3 px-4 text-left">Number</th>
//               <th className="py-3 px-4 text-left">Status</th>
//               <th className="py-3 px-4 text-left">Address</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((customer, index) => (
//               <tr key={customer.id} className="border-b hover:bg-gray-100">
//                 <td className="py-2 px-4">{index + 1}</td>
//                 <td className="py-2 px-4 hover:text-blue-700"><Link to="/clientData/:userId" >{customer.name} </Link></td>
//                 <td className="py-2 px-4">{customer.company}</td>
//                 <td className="py-2 px-4">{customer.leadOwner}</td>
//                 <td className="py-2 px-4 text-blue-600 underline">
//                   <a href={`mailto:${customer.email}`}>{customer.email}</a>
//                 </td>
//                 <td className="py-2 px-4">{customer.number}</td>
//                 <td
//                   className={`py-2 px-4 font-bold ${
//                     customer.status === "Active"
//                       ? "text-green-600"
//                       : customer.status === "Pending"
//                       ? "text-yellow-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {customer.status}
//                 </td>
//                 <td className="py-2 px-4">{customer.address}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Chart Section */}
//       <div className="w-full max-w-3xl mx-auto p-5 mt-8 bg-white shadow-lg rounded-lg">
//         <h2 className="text-center text-2xl font-bold mb-4">Client Data Chart</h2>
//         <Bar data={data} options={options} />
//       </div>
//     </div>
//   );
// }

// export default ClientData;


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

  useEffect(() => {
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
      } catch (err) {
        setError("Failed to fetch client data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return <p className="text-center text-gray-600">Loading data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

// Prepare Data for Chart
const monthlyCounts = customers.reduce((acc, customer) => {
  const month = new Date(customer.createdOn).toLocaleString('default', { month: 'long' });
  acc[month] = (acc[month] || 0) + 1;
  return acc;
}, {});

const chartData = {
  labels: Object.keys(monthlyCounts),
  datasets: [
    {
      label: 'Number of Clients per Month',
      data: Object.values(monthlyCounts),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
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
          const month = context.label || 'Unknown';
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
        text: 'Month'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Number of Clients'
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
              <th className="py-3 px-4 text-left">Number</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
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
                <td className="py-2 px-4">{customer.phoneNumber || "N/A"}</td>
                <td className="py-2 px-4 font-bold text-gray-700">Active</td>
                <td className="py-2 px-4">
                  {customer.addresses.length > 0
                    ? customer.addresses[0]
                    : "N/A"}
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
