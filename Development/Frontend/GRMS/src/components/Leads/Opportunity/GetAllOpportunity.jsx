import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { PlusCircle } from "lucide-react";
import axios from "axios";

function GetAllOpportunity() {
  const [opportunities, setOpportunities] = useState([]);
  const [error, setError] = useState(null);
  const [statuses, setStatuses] = useState({});
  const [stages, setStages] = useState({});
  const [leads, setLeads] = useState({});
  const navigate = useNavigate();
  const [filteredOpportunities,setFilteredOpportunities] = useState([]);
  const [searchText,setSearchText] = useState("");
  const [sortField,setSortField] = useState({ key: null,direction:"asc"});


  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Lead/all/true",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const leadsMap = {};
      response.data.data.forEach((lead) => {
        leadsMap[lead.id] = {
          firstName: lead.firstName,
          lastName: lead.lastName
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
          "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Opportunity/all/true",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
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
        "https://grms-dev.gdinexus.com:49181/api/v1/Reference/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = response.data.data || [];
      const opportunitystatusMap = {};
      const opportunitystageMap = {};
      data.forEach((reference) => {
        if (reference.name === "Opportunity Status") {
          reference.referenceItems.forEach((item) => {
            opportunitystatusMap[item.id] = item.code;
          });
        } else if (reference.name === "Opportunity Stages") {
          reference.referenceItems.forEach((item) => {
            opportunitystageMap[item.id] = item.code;
          });
        }
      });
      setStatuses(opportunitystatusMap);
      setStages(opportunitystageMap);
    } catch (error) {
      console.error("Error fetching master table data:", error);
      setError("Failed to fetch master table data");
    }
  };
  useEffect(() => {
    MasterTableData();
  }, []);

  if (error) return <p className="text-center text-red-500">{error}</p>;

  useEffect(() =>{
    handleFilterSortSearch();
  },[searchText.sortField,opportunities]);

  const handleFilterSortSearch = () => {
    let updated = [...opportunities];

    if (searchText) {
      updated = updated.filter((opportunity) => {
        const lead = leads[opportunity.leadId] || { firstName: "", lastName: "" };
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

    setFilteredOpportunities(updated);
  };

  useEffect(() => {
    handleFilterSortSearch();
  }, [searchText, sortField, opportunities, leads]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortField.key === key && sortField.direction === "asc") {
      direction = "desc";
    }
    setSortField({ key, direction });
  };

  return (
    <div className="p-5">
      {/* <div className="flex justify-end mb-4">
        <Link
          to="/createOpportunity"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} /> Create Opportunity
        </Link>
      </div> */}
      
      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Lead or Opportunity Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border px-3 py-2 rounded-lg w-64"
        />
        </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-amber-300">
            <tr>
              <th className="py-2 px-4 border-b text-left font-semibold">
                S.no
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold cursor-pointer" onClick={() => requestSort("leadName")}>
                Lead Name
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold cursor-pointer" onClick={() => requestSort("name")}>
                Opportunity Name
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold">
                Opportunity Description
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold cursor-pointer" onClick={() => requestSort("estimatedValue")}>
                Opportunity Estimated Value
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold">
                Opportunity End Date
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold">
                Opportunity Status
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold">
                Opportunity Stages
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredOpportunities.map((opportunity, index) => {
              const lead = leads[opportunity.leadId] || {
                firstName: "",
                lastName: ""
              };
              return (
                <tr key={opportunity.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">
                    {lead.firstName} {lead.lastName}
                  </td>
                  <td className="py-2 px-4 border-b">{opportunity.name}</td>
                  <td className="py-2 px-4 border-b">
                    {opportunity.description}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {opportunity.estimatedValue}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(opportunity.closeDate).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {statuses[opportunity.statusId] || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {stages[opportunity.stageId] || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() =>
                        navigate(`/updateOpportunity/${opportunity.id}`)
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetAllOpportunity;
