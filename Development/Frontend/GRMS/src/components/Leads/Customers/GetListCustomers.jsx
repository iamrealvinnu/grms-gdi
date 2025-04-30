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

  return (
    <div className="p-5">
      <ToastContainer />
      {/* Add Customer Button */}
      <div className="flex justify-end mb-4">
        <Link
          to="/createCustomerList"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} /> Add Contact
        </Link>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">S.No</th>
              <th className="py-3 px-4 text-left">First Name</th>
              <th className="py-3 px-4 text-left">Last Name</th>
              <th className="py-3 px-4 text-left">Company Name</th>
              <th className="py-3 px-4 text-left">Department</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone Number</th>
              <th className="py-3 px-4 text-left">Mobile Number</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
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
