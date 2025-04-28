import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function GetListCustomers() {
  const [contacts, setContacts] = useState([]);
  const [departments, setDepartments] = useState({});
  const [accounts, setAccounts] = useState({});
  const [filteredContacts,setFilteredContacts] = useState([]);
  const [searchTerm,setSearchTerm] = useState("");
  const [sortConfig,setSortConfig] = useState({key:null, direction:"asc"});
  const navigate = useNavigate();


  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Account/contact/all/true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContacts(response.data.data);
      setFilteredContacts(response.data.data);
      // console.log('fetched Contacts:', response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data. Please try again later.");
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

      const departmentMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "Department Types") {
          reference.referenceItems.forEach((item) => {
            departmentMap[item.id] = item.description;
          });
        } 
      });
     setDepartments(departmentMap);
    } catch (error) {
      console.error("Error fetching reference data:", error);
      setError("Failed to fetch reference data.");
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Account/all/true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Create a map from accountId to accountName
      const accountMap = {};
      response.data.data.forEach((account) => {
        accountMap[account.id] = account.name;
      });
  
      setAccounts(accountMap);
      // console.log('fetched Accounts:', response.data.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to fetch account data.");
    }
  };
  

  useEffect(() => {
    fetchContacts();
    fetchReferenceData();
    fetchAccounts();
  }, []);

  useEffect(() =>{
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter((contact) => {
        const accountName = accounts[contact.accountId] || "";
        const departmentName = departments[contact.departmentId] || "";
    
        return (
          (contact.firstName && contact.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (contact.lastName && contact.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (accountName && accountName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (departmentName && departmentName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }
    
    setFilteredContacts(filtered);
  },[contacts,searchTerm]);

  const handleSort = (field) =>{
    let direction = "asc";
    if(sortConfig.key === field && sortConfig.direction === "asc"){
      direction = "desc";
    }
    setSortConfig({key:field,direction});

    const sorted = [...filteredContacts].sort((a,b) =>{
      if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
      if (b[field] > b[field]) return direction === "asc" ? 1: -1;
      return 0;
    });
    setFilteredContacts(sorted);
  }

  return (
    <div className="p-5">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        {/* Search and Filter Section */}
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            className="border p-2 rounded w-[48%]"
            placeholder="Search Contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      {/* Add Customer Button */}
      <div className="flex justify-end mb-4">
        <Link
          to="/createCustomerList"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} /> Add Contact
        </Link>
      </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">S.No</th>
              <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort("firstName")}>First Name{" "}{sortConfig.key === "firstName" ? sortConfig.direction === "asc" ?  " ▲" : " ▼" : ""}</th>
              <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort("lastName")}>Last Name{" "}{sortConfig.key === "lastName" ? sortConfig.direction === "asc" ? "▲" : " ▼" : ""}</th>
              <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort("accountId")}>Company Name{" "}{sortConfig.key === "accountId" ? sortConfig.direction === "asc" ? "▲" : " ▼" : ""}</th>
              <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort("departmentId")}>Department{" "}{sortConfig.key === "departmentId" ? sortConfig.direction === "asc" ? "▲" : " ▼" : ""}</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone Number</th>
              <th className="py-3 px-4 text-left">Mobile Number</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact, index) => (
              <tr key={contact.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{contact.firstName}</td>
                <td className="py-3 px-4">{contact.lastName}</td>
                <td className="py-3 px-4">{accounts[contact.accountId] || "—"}</td>
                <td className="py-3 px-4">{departments[contact.departmentId] || "—"}</td>
                <td className="py-3 px-4">{contact.email}</td>
                <td className="py-3 px-4">{contact.phoneNumber || "—"}</td>
                <td className="py-3 px-4">{contact.mobileNumber || "—"}</td>
                <td className="py-3 px-4">
                  <button 
                  onClick={() => navigate(`/updateCustomer/${contact.id}`)}
                  className="text-blue-500 hover:text-blue-700">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetListCustomers;
