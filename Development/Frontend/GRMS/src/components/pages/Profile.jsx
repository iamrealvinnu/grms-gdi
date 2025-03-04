//
// NAME:			  App.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  02/12/2025
// PURPOSE:			All component import To User's Dispaly
//


import React from "react";
import withAuth from '../withAuth'; // Higher-order component (HOC) for authentication
import { FiEdit } from "react-icons/fi"; // Importing edit icon

function Profile() {
  return (
    <div className="max-w-3xl mx-auto bg-gray-300 rounded-lg shadow-md p-6 mt-5 mb-5">
      <div className="grid grid-cols-1  md:grid-cols-2 gap-6 items-center">
        {/* Left Side - Profile Image, Name, Role, Email */}
        <div className="flex flex-col bg-white p-5 rounded-md items-center md:items-start text-center md:text-left">
          <img
            className="rounded-full w-24 h-24 md:w-32 md:h-32 object-cover border-4 border-gray-400"
            src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
            alt="Profile"
          />
          <p className="text-lg font-semibold mt-3">Mani Rathnam</p>
          <p className="text-sm text-gray-600">Full Stack Developer</p>
          <p className="text-sm text-gray-600">abcd@gmail.com</p>
        </div>

        {/* Right Side - Contact Details */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="grid gap-4">
            <div className="flex justify-between">
              <span className="font-medium">Full Name</span>
              <span className="text-gray-700">Mani Vel</span>
            </div>-
            <div className="flex justify-between">
              <span className="font-medium">Email</span>
              <span className="text-gray-700">xyz@gmail.com</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date Of Birth</span>
              <span className="text-gray-700">01-01-1977</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Mobile</span>
              <span className="text-gray-700">(320) 380-4539</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Address</span>
              <span className="text-gray-700">
                Erode <br />
                Tirupur <br />
                coimbatore
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-5 flex justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center">
              <FiEdit size={16} className="mr-2" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Profile);
