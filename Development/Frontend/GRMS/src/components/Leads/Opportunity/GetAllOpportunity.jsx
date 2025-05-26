import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { PlusCircle } from "lucide-react";
import axios from "axios";
import Papa from "papaparse";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrFormView } from "react-icons/gr";
import { FaPhone } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import { MdGroupAdd } from "react-icons/md";
import { FaTasks } from "react-icons/fa";

function GetAllOpportunity() {
  const [opportunities, setOpportunities] = useState([]);
  const [error, setError] = useState(null);
  const [statuses, setStatuses] = useState({});
  const [stages, setStages] = useState({});
  const [products, setProducts] = useState({});
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState({ key: null, direction: "asc" });
  const [selectStages, setSelectStages] = useState("All");

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/marketing/Lead/all/true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const leadsMap = {};
      response.data.data.forEach((lead) => {
        leadsMap[lead.id] = {
          firstName: lead.firstName,
          lastName: lead.lastName,
        };
      });
      setLeads(leadsMap);
      // console.log("Leads:", response.data.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/marketing/Opportunity/all/true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOpportunities(response.data.data || []);
        setFilteredOpportunities(response.data.data || []);
        console.log("Opportunities:", response.data.data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      }
    };
    fetchOpportunities();
    fetchLeads();
  }, []);

  const MasterTableData = async () => {
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
      const data = response.data.data || [];
      const opportunitystatusMap = {};
      const opportunitystageMap = {};
      const productsMap = {};
      data.forEach((reference) => {
        if (reference.name === "Opportunity Status") {
          reference.referenceItems.forEach((item) => {
            opportunitystatusMap[item.id] = item.code;
          });
        } else if (reference.name === "Opportunity Stages") {
          reference.referenceItems.forEach((item) => {
            opportunitystageMap[item.id] = item.code;
          });
        } else if (reference.name === "Opportunity Product Line") {
          reference.referenceItems.forEach((item) => {
            productsMap[item.id] = item.code;
          });
        }
      });
      setStatuses(opportunitystatusMap);
      setStages(opportunitystageMap);
      setProducts(productsMap);
    } catch (error) {
      console.error("Error fetching master table data:", error);
      setError("Failed to fetch master table data");
    }
  };
  useEffect(() => {
    MasterTableData();
  }, []);

  if (error) return <p className="text-center text-red-500">{error}</p>;

  useEffect(() => {
    handleFilterSortSearch();
  }, [searchText, sortField, opportunities]);

  const handleFilterSortSearch = () => {
    let updated = [...opportunities];

    if (searchText) {
      updated = updated.filter((opportunity) => {
        const lead = leads[opportunity.leadId] || {
          firstName: "",
          lastName: "",
        };
        const leadName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
        const opportunityName = opportunity.name?.toLowerCase() || "";
        return (
          leadName.includes(searchText.toLowerCase()) ||
          opportunityName.includes(searchText.toLowerCase())
        );
      });
    }

    if (sortField.key) {
      updated.sort((a, b) => {
        let aValue = a[sortField.key];
        let bValue = b[sortField.key];

        if (sortField.key === "leadName") {
          const leadA = leads[a.leadId] || { firstName: "", lastName: "" };
          const leadB = leads[b.leadId] || { firstName: "", lastName: "" };
          aValue = `${leadA.firstName} ${leadA.lastName}`;
          bValue = `${leadB.firstName} ${leadB.lastName}`;
        }

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortField.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortField.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    if (selectStages !== "All") {
      updated = updated.filter(
        (opportunities) => stages[opportunities.stageId] === selectStages
      );
    }

    setFilteredOpportunities(updated);
  };

  useEffect(() => {
    handleFilterSortSearch();
  }, [searchText, sortField, opportunities, leads, selectStages]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortField.key === key && sortField.direction === "asc") {
      direction = "desc";
    }
    setSortField({ key, direction });
  };

  const handleDownloadDataCsv = () => {
    if (!filteredOpportunities || filteredOpportunities.length === 0) return;

    const dataToExport = filteredOpportunities.map((opportunity) => {
      const lead = leads[opportunity.leadId]; // works if leads is an object
      const product = products[opportunity.productLineId];
      const stage = stages[opportunity.stageId];

      return {
        OpportunityName: opportunity.name,
        LeadName: lead ? `${lead.firstName} ${lead.lastName}` : "N/A",
        EstimatedValue: opportunity.estimatedValue,
        ProductLine: product || "N/A",
        Stage: stage || "N/A",
        // Add more fields if needed
      };
    });

    const csv = Papa.unparse(dataToExport); // ✅ Works now with import
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "opportunities.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully");
    console.log("CSV file downloaded successfully");
  };

  return (
    <div className="p-5">
      <div className="flex flex-wrap justify-between items-center mb-4">
        {/* Search and Filter Section */}
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search by Lead or Opportunity Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border px-3 py-2 rounded-lg w-64"
          />
          <select
            className="border px-3 py-2 rounded-lg"
            value={selectStages}
            onChange={(e) => setSelectStages(e.currentTarget.value)}
          >
            <option value="All">All Stages</option>
            {Object.values(stages).map((stage, idx) => (
              <option key={idx} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {/* Export Button */}
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleDownloadDataCsv}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-amber-300 border-b border-gray-300">
            <tr>
              <th className="py-2 px-4 border-r border-gray-300 text-left font-semibold">
                S.no
              </th>

              <th
                className="py-2 px-4 border-r border-gray-300 text-left font-semibold cursor-pointer"
                onClick={() => requestSort("name")}
              >
                Opportunity Name
              </th>
              <th
                className="py-2 px-4 border-r border-gray-300 text-left font-semibold cursor-pointer"
                onClick={() => requestSort("leadName")}
              >
                Lead Name
              </th>
              <th
                className="py-2 px-4 border-r border-gray-300 text-left font-semibold cursor-pointer"
                onClick={() => requestSort("estimatedValue")}
              >
                Opportunity Estimated Value
              </th>
              <th className="py-2 px-4 border-r border-gray-300 text-left font-semibold">
                Opportunity Products
              </th>
              <th className="py-2 px-4 border-r border-gray-300 text-left font-semibold">
                Opportunity Stages
              </th>
              <th className="py-2 px-4 border-r border-gray-300 text-left font-semibold hidden md:table-cell">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredOpportunities.map((opportunity, index) => {
              const lead = leads[opportunity.leadId] || {
                firstName: "",
                lastName: "",
              };
              return (
                <React.Fragment key={opportunity.id}>
                  {/* Main data row */}
                  <tr className="hover:bg-gray-300 border-b border-gray-200">
                    <td className="py-2 px-4 border-r border-gray-200">
                      {index + 1}
                    </td>

                    <td className="py-2 px-4 border-r border-gray-200 hover:text-amber-700">
                      <Link to={`/updateOpportunity/${opportunity.id}`}>
                        {opportunity.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      {lead.firstName} {lead.lastName}
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      {opportunity.estimatedValue}
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      {products[opportunity.productLineId] || "N/A"}
                    </td>
                    <td
                      className={`py-2 px-4 border-r border-gray-200 ${
                        stages[opportunity.stageId] === "Closed Won"
                          ? "text-amber-700 font-bold"
                          : ""
                      } `}
                    >
                      {stages[opportunity.stageId] || "N/A"}
                    </td>

                    {/* Action buttons only visible on md and up */}
                    <td className="py-2 px-4 border-b hidden md:table-cell">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/viewOpportunity/${opportunity.id}/${opportunity.leadId}`
                            )
                          }
                          className="text-green-600 hover:text-green-800"
                          title="View Opportunity"
                        >
                          <GrFormView className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/createCall/${opportunity.id}/${opportunity.leadId}`
                            )
                          }
                          className="text-orange-600 hover:text-orange-800"
                          title="Call"
                        >
                          <FaPhone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/createMail/${opportunity.id}/${opportunity.leadId}`
                            )
                          }
                          className="text-emerald-600 hover:text-emerald-800"
                          title="Mail"
                        >
                          <CiMail className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/createMeeting/${opportunity.id}/${opportunity.leadId}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800"
                          title="Group"
                        >
                          <MdGroupAdd className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/createTask/${opportunity.id}/${opportunity.leadId}`
                            )
                          }
                          className="text-stone-600 hover:text-stone-800"
                          title="Tasks"
                        >
                          <FaTasks className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Action buttons row only on small screens */}
                  <tr className="border-b-4 hover:bg-gray-300 md:hidden">
                    <td colSpan="7" className="py-2 px-4">
                      <div className="flex flex-wrap gap-5 justify-end">
                        <button
                          onClick={() =>
                            navigate(
                              `/viewOpportunity/${opportunity.id}/${opportunity.leadId}`
                            )
                          }
                          className="text-green-600 hover:text-green-800"
                          title="View Opportunity"
                        >
                          <GrFormView className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/createCall/${opportunity.id}/${opportunity.leadId}`
                            )
                          }
                          className="text-orange-600 hover:text-orange-800"
                          title="Call"
                        >
                          <FaPhone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/createMail/${opportunity.id}/${opportunity.leadId}`
                            )
                          }
                          className="text-emerald-600 hover:text-emerald-800"
                          title="Mail"
                        >
                          <CiMail className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/createMeeting/${opportunity.id}/${opportunity.leadId}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800"
                          title="Group"
                        >
                          <MdGroupAdd className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/createTask/${opportunity.id}/${opportunity.leadId}`
                            )
                          }
                          className="text-stone-600 hover:text-stone-800"
                          title="Tasks"
                        >
                          <FaTasks className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default GetAllOpportunity;
