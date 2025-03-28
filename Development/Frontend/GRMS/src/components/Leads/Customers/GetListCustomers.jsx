import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";



function GetListCustomers() {
  
  
  const customers = [
    {
      id: 1,
      name: "John Prashanth",
      company: "Tech Innovation",
      leadOwner: "Anupama",
      email: "john@example.com",
      number: "+1 234 567 8901",
      status: "Active",
      address: "123 Main St, Delhi, india",
    },
    {
      id: 2,
      name: "Mari muthu",
      company: "JS auto cast Ltd",
      leadOwner: "Michael",
      email: "mari.muthu@example.com",
      number: "+91 8989565520",
      status: "Pending",
      address: "456 Elm St, Avadi,chennai",
    },
    {
      id: 3,
      name: "Mary",
      company: "FinTech Solutions",
      leadOwner: "Abdul",
      email: "mary@example.com",
      number: "+91 9988556644",
      status: "Inactive",
      address: "789 Oak St,Kilpauk, chennai",
    },
  ];

  return (
    <div className="p-5">

      {/* Add Client Button */}
      <div className="flex justify-end mb-4">
        <Link
          to="/createCustomerList"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} /> Add Customer
        </Link>
      </div>
      {/* Table Section */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        
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
                <td className="py-2 px-4 hover:text-blue-700"><Link to="/clientData/:userId" >{customer.name} </Link></td>
                <td className="py-2 px-4">{customer.company}</td>
                <td className="py-2 px-4">{customer.leadOwner}</td>
                <td className="py-2 px-4 text-blue-600 underline">
                  <a href={`mailto:${customer.email}`}>{customer.email}</a>
                </td>
                <td className="py-2 px-4">{customer.number}</td>
                <td
                  className={`py-2 px-4 font-bold ${
                    customer.status === "Active"
                      ? "text-green-600"
                      : customer.status === "Pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {customer.status}
                </td>
                <td className="py-2 px-4">{customer.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetListCustomers;
