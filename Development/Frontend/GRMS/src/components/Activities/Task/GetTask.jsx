import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

function GetTask() {
  return (
    <div className="p-5">
      <div className="flex justify-end mb-4">
        <Link
          to="/createTask"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} /> Create Task
        </Link>
      </div>
    </div>
  );
}

export default GetTask;
