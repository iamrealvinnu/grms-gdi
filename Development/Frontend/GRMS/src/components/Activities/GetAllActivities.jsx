import React from "react";
import { FaTasks } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function GetAllActivities() {
  const navigate = useNavigate();

  const handleTask = () => {
    navigate("/createTask");
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:gap-8 gap-4 w-full sm:w-auto">
          <div
            className="p-3 bg-white border rounded shadow-md flex flex-col items-center cursor-pointer"
            onClick={handleTask}
          >
            <h2 className="text-center text-sm">Task</h2>
            <FaTasks className="size-6 sm:size-8 text-blue-500 hover:text-blue-700" />
          </div>

          <div className="p-3 bg-white border rounded shadow-md flex flex-col items-center cursor-pointer">
            <h2 className="text-center text-sm">Call</h2>
            <IoCall className="size-6 sm:size-8 text-green-500 hover:text-green-700" />
          </div>

          <div className="p-3 bg-white border rounded shadow-md flex flex-col items-center cursor-pointer">
            <h2 className="text-center text-sm">Email</h2>
            <MdEmail className="size-6 sm:size-8 text-yellow-500 hover:text-yellow-700" />
          </div>

          <div className="p-3 bg-white border rounded shadow-md flex flex-col items-center cursor-pointer">
            <h2 className="text-center text-sm">Meeting</h2>
            <FaPeopleGroup className="size-6 sm:size-8 text-purple-500 hover:text-purple-700" />
          </div>
        </div>

        <div className="p-3 bg-white border rounded shadow-md self-end sm:self-auto flex justify-center">
          <IoSettings className="size-6 sm:size-8 text-gray-600 hover:text-gray-800 transition-colors duration-200" />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Upcoming Activities</h3>
      </div>
    </div>
  );
}

export default GetAllActivities;
