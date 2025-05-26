import React, { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function GetAllAccount() {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [ownerships, setOwnerships] = useState({});
  const [accountTypes, setAccountTypes] = useState({});
  const [industries, setIndustries] = useState({});
  const [assignedTos, setAssignedTos] = useState([]);
  const navigate = useNavigate();

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/marketing/Account/all/true`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAccounts(response.data.data);
      console.log("fetch accounts:", response.data.data);
    } catch (error) {
      setError("Failed to fetch accounts. Please try again later.");
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
    MasterTable();
    fetchUsers();
  }, []);

  const MasterTable = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/Reference/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const referenceData = response.data?.data || response.data;
      const ownershipMap = {};
      const accountTypeMap = {};
      const industryMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "Ownership Types") {
          reference.referenceItems.forEach((item) => {
            ownershipMap[item.id] = item.description;
          });
        } else if (reference.name === "Account Types") {
          reference.referenceItems.forEach((item) => {
            accountTypeMap[item.id] = item.description;
          });
        } else if (reference.name === "Industry Types") {
          reference.referenceItems.forEach((item) => {
            industryMap[item.id] = item.description;
          });
        }
      });
      setAccountTypes(accountTypeMap);
      setOwnerships(ownershipMap);
      setIndustries(industryMap);
    } catch (error) {
      console.error("Error fetching master table data:", error);
      toast.error("Error fetching master table data");
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/User/all/true`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAssignedTos(response.data.data || []);
      // console.log("fetched users", response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;


  return (
    <div className="p-5">
      <div className="flex justify-end mb-4">
        <Link
          to="/addAccount"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} /> Add Account
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-emerald-700 text-white">
            <tr>
              <th className="py-2 px-4 border-b text-left font-semibold">
                S.no
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold">
                Account Owner
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold">
                Account Name
              </th>
              {/* <th className="py-2 px-4 border-b text-left font-semibold">
                Account Type
              </th> */}
              <th className="py-2 px-4 border-b text-left font-semibold">
                Account Industry
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold">
                Phone Number
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold">
                Email
              </th>
              <th className="py-2 px-4 border-b text-left font-semibold">
                Assigned To
              </th>
              {/* <th className="py-2 px-4 border-b text-left font-semibold">
                Annual Revenue
              </th> */}
              {/* <th className="py-2 px-4 border-b text-left font-semibold">
                Address
              </th> */}
              <th className="py-2 px-4 border-b text-left font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={account.id} className="">
                <td className="py-2 px-4 border-b">
                  {index + 1}
                </td>
                <td className="py-2 px-4 border-b">
                  {ownerships[account.ownershipTypeId] || "N/A"}
                </td>
                <td className="py-2 px-4 border-b">
                  {account.name}
                </td>
                {/* <td className="py-2 px-4 border-b">
                  {accountTypes[account.accountTypeId] || "N/A"}
                </td> */}
                <td className="py-2 px-4 border-b">
                  {industries[account.industryTypeId] || "N/A"}
                </td>
                <td className="py-2 px-4 border-b">
                  {account.phoneNumber}
                </td>
                <td className="py-2 px-4 border-b">
                  {account.email}
                </td>
                <td className="py-2 px-4 border-b">
                  {(() => {
                    const assignedTo = assignedTos.find(
                      (assignedTo) => assignedTo.id === account.assignedToId
                    );
                    return assignedTo
                      ? `${assignedTo.profile?.firstName} ${assignedTo.profile?.lastName}`
                      : "N/A";
                  })()}
                </td>
                {/* <td className="py-2 px-4 border-b">
                  {account.annualRevenue}
                </td> */}
                {/* <td className="py-2 px-4 border-b">
                  {account.addresses?.[0]?.address
                    ? `${account.addresses[0].address.address1}, ${account.addresses[0].address.city}, ${account.addresses[0].address.zip}`
                    : "N/A"}
                </td> */}
                <td className="py-2 px-4 border-b">
                  <button onClick={()=> navigate(`/updateAccount/${account.id}`)} className="text-emerald-600 hover:text-blue-800">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default GetAllAccount;
