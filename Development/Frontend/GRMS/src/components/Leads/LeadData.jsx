import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { PlusCircle } from "lucide-react";
import { GrFormView } from "react-icons/gr";
import { FaPhone } from "react-icons/fa6";
import { CiMail, CiMenuKebab } from "react-icons/ci";
import { MdGroupAdd } from "react-icons/md";
import { motion } from 'framer-motion';


function LeadData() {
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchClients();
      await fetchUsers();
      await fetchReferenceData();
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/marketing/Lead/all/true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomers(response.data.data || []);
    } catch {
      console.error("Failed to fetch client data.");
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/User/all/true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data.data || []);
    } catch {
      console.error("Error fetching users");
    }
  };

  const fetchReferenceData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/Reference/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const statusMap = {};
      (response.data.data || []).forEach((ref) => {
        if (ref.name === "Lead Status") {
          ref.referenceItems.forEach((item) => {
            statusMap[item.id] = item.code;
          });
        }
      });
      setStatuses(statusMap);
    } catch {
      console.error("Error fetching reference data");
    }
  };

  const rows = customers.map((customer, idx) => ({
    id: customer.id,
    sno: idx + 1,
    name: `${customer.firstName} ${customer.lastName}`,
    company: customer.company || "N/A",
    owner:
      users.find((u) => u.id === customer.assignedToId)?.profile?.firstName ||
      "N/A",
    email: customer.email,
    phone: customer.phoneNumber || "N/A",
    status: statuses[customer.statusId] || "Active",
    customer,
  }));

  const columns = [
    { field: "sno", headerName: "S.No", width: 70, headerClassName: 'super-app-theme--header' },
    {
      field: "name",
      headerName: "Customer Name",
      width: 200,
      headerClassName: 'super-app-theme--header', // Add this
      renderCell: (params) => (
        <Link
          to={`/clientData/${params.row.id}`}
          className=" hover:text-blue-600 "
        >
          {params.value}
        </Link>
      ),
    },
    { field: "company", headerName: "Company Name", width: 200, headerClassName: 'super-app-theme--header'},
    { field: "owner", headerName: "Lead Owner", width: 200, headerClassName: 'super-app-theme--header'},
    {
      field: "email",
      headerName: "Email",
      width: 200,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <a href={`mailto:${params.value}`} className="text-blue-600 underline">
          {params.value}
        </a>
      ),
    },
    { field: "phone", headerName: "Phone Number", width: 200, headerClassName: 'super-app-theme--header' },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <div
          className={`${params.value === "Qualified"
            ? "text-blue-600 font-bold"
            : params.value === "Converted"
              ? "text-green-600 font-bold"
              : ""
            }`}
        >
          {params.value}
          {params.value !== "Qualified" && params.value !== "Converted" && (
            <button
              className="ml-2 text-xs bg-gray-400 px-2 py-1 rounded hover:bg-gray-300"
              onClick={() =>
                console.log("Convert to Account clicked", params.row.id)
              }
            >
              Convert
            </button>
          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      headerClassName: 'super-app-theme--header',
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2 ">
          <button
            onClick={() => navigate(`/viewleadData/${params.row.id}`)}
            title="View Opportunity"
          >
            <GrFormView className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(`/createLeadCall/${params.row.id}`)}
            title="Call"
          >
            <FaPhone className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => navigate(`/createLeadMail/${params.row.id}`)}
            title="Mail"
          >
            <CiMail className="w-5 h-5 text-orange-600" />
          </button>
          <button
            onClick={() => navigate(`/createLeadMeeting/${params.row.id}`)}
            title="Group"
          >
            <MdGroupAdd className="w-5 h-5 text-green-600" />
          </button>
          <button
            onClick={() => navigate(`/createLeadTask/${params.row.id}`)}
            title="More"
          >
            <CiMenuKebab className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Leads Data</h2>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/addLead"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            Create Lead
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-[600px] text-base shadow rounded-lg"
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
          }
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            '& .odd-row': {
              backgroundColor: '#D9E1F2',
            },
            '& .even-row': {
              backgroundColor: '#ffffff',
            },
            '& .super-app-theme--header': {
              backgroundColor: '#3f51b5',
              color: '#fff',
              fontWeight: 'bold',
            },
          }}
        />
      </motion.div>
    </div>
  );
}

export default LeadData;
