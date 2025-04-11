import React, { useState } from "react";
import { FaTasks } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { GiSatelliteCommunication } from "react-icons/gi";


function GetAllActivities() {
    const [activeOpen, setActiveOpen] = useState("");

  return (
    <div>
      <div className="flex justify-between items-center px-4 py-4 ">
        <div className="flex items-center gap-8">
          <div className="p-3 mt-2 bg-white border rounded shadow-md ">
            <h2 className="text-center cursor-pointer">Task</h2>
            <FaTasks className="size-8 text-blue-500 hover:text-blue-700"/>
            <select className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap">
                <option value="1"></option>
                <option value="1">Completed</option>
                <option value="1">Pending Review</option>
                <option value="1">Open task</option>
                <option value="1">Canceled</option>
            </select>
          </div>
          <div className=" p-3 mt-2 bg-white border rounded shadow-md ">
            <h2 className="text-center cursor-pointer">Call</h2>
            <IoCall className="size-8 text-green-500 hover:text-green-700" />
            <select>
                <option value="1"></option>
                <option value="1">SuccessFull</option>
                <option value="1">Voicemail</option>
                <option value="1">Follow-Up Required</option>
            </select>
          </div>
          <div className="p-3 mt-2 bg-white border rounded shadow-md ">
            <h2 className="text-center cursor-pointer">Email</h2>
            <MdEmail className="size-8 text-yellow-500 hover:text-yellow-700"/>
            <select>
                <option value="1"></option>
                <option value="1">Read</option>
                <option value="1">Replied</option>
                <option value="1">Ignored</option>
                </select>
          </div>
          <div className="p-3 mt-2 bg-white border rounded shadow-md ">
            <h2 className="text-center cursor-pointer">Meeting</h2>
            <FaPeopleGroup className="size-8 text-purple-500 hover:text-purple-700" />
            <select>
                <option value="1"></option>
                <option value="1">Completed</option>
                <option value="1">ReScheduled</option>
                <option value="1">Canceled</option>
                </select>
          </div>
          <div className="p-3 mt-2 bg-white border rounded shadow-md ">
            <h2>Communication</h2>
            <GiSatelliteCommunication className="size-8 text-red-500 hover:text-red-700"/>
          </div>
        </div>
        <div className="p-3 mt-2 bg-white border rounded shadow-md ">
        <IoSettings className="size-8 text-gray-600 hover:text-gray-800 transition-colors duration-200" />
        </div>
      </div>
    </div>
  );
}

export default GetAllActivities;
