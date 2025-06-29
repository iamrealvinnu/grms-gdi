import React from 'react';
import { useNavigate } from 'react-router-dom'; // import useNavigate

function GetAllActivities() {
  const navigate = useNavigate(); 

  return (
    <div className="flex justify-center items-center mt-10 gap-4 flex-wrap p-4">
      <div
        onClick={() => navigate('/getTasks')} // call navigate on click
        className="cursor-pointer bg-white shadow-md rounded-xl p-6 w-48 text-center hover:bg-slate-400 font-medium hover:shadow-lg transition"
      >
        Task
      </div>
      <div 
      onClick={() => navigate('/getCommunications')}
      className="bg-white shadow-md rounded-xl p-6 w-48 text-center hover:bg-slate-400 font-medium hover:shadow-lg transition">
        Communication
      </div>
    </div>
  );
}

export default GetAllActivities;
