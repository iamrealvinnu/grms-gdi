// import axios from "axios";
// import React, { useEffect, useState } from "react";
// // import { FaTasks } from "react-icons/fa";
// // import { IoCall } from "react-icons/io5";
// // import { MdEmail } from "react-icons/md";
// // import { FaPeopleGroup } from "react-icons/fa6";
// // import { IoSettings } from "react-icons/io5";
// // import { useNavigate } from "react-router-dom";

// function GetAllActivities() {
//   // const navigate = useNavigate();

//   // const handleTask = () => {
//   //   navigate("/createTask");
//   // };

//   const [activities, setActivities] = useState("");

//   const fetchActivities = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const response = await axios.get(
//         "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Activity/all/true",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       setActivities(response.data.data);
//       console.log("fetched data:", response.data.data);
//     } catch (error) {
//       console.log("fetch datas: ", error);
//       toast.error("Fetching activities error");
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   return (
//     <div className="p-4">
//       {/* <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//         <div className="grid grid-cols-2 sm:flex sm:items-center sm:gap-8 gap-4 w-full sm:w-auto">
//           <div
//             className="p-3 bg-white border rounded shadow-md flex flex-col items-center cursor-pointer"
//             onClick={handleTask}
//           >
//             <h2 className="text-center text-sm">Task</h2>
//             <FaTasks className="size-6 sm:size-8 text-blue-500 hover:text-blue-700" />
//           </div>

//           <div className="p-3 bg-white border rounded shadow-md flex flex-col items-center cursor-pointer">
//             <h2 className="text-center text-sm">Call</h2>
//             <IoCall className="size-6 sm:size-8 text-green-500 hover:text-green-700" />
//           </div>

//           <div className="p-3 bg-white border rounded shadow-md flex flex-col items-center cursor-pointer">
//             <h2 className="text-center text-sm">Email</h2>
//             <MdEmail className="size-6 sm:size-8 text-yellow-500 hover:text-yellow-700" />
//           </div>

//           <div className="p-3 bg-white border rounded shadow-md flex flex-col items-center cursor-pointer">
//             <h2 className="text-center text-sm">Meeting</h2>
//             <FaPeopleGroup className="size-6 sm:size-8 text-purple-500 hover:text-purple-700" />
//           </div>
//         </div>

//         <div className="p-3 bg-white border rounded shadow-md self-end sm:self-auto flex justify-center">
//           <IoSettings className="size-6 sm:size-8 text-gray-600 hover:text-gray-800 transition-colors duration-200" />
//         </div>
//       </div> */}

//       <div>
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold">Upcoming Activities</h3>
//         </div>
//         <div>
//           <h5>Tasks</h5>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default GetAllActivities;

import axios from "axios";
import React, { useEffect, useState } from "react";

function GetAllActivities() {
  const [activities, setActivities] = useState("");

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Activity/all/true",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setActivities(response.data.data);
      console.log("fetched data:", response.data.data);
    } catch (error) {
      console.log("fetch datas: ", error);
      toast.error("Fetching activities error");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="p-4">
      <div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Upcoming Activities</h3>
          <div className="flex flex-wrap flex-col">
            <div>
              <h5>Task</h5>
              {activities.length > 0 ? (
                <div className="mt-4">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id || index}
                      className="p-4 mb-4 border rounded shadow-md bg-white"
                    >
                      <h4 className="font-bold text-md">{activity.name}</h4>
                      <p>
                        <strong>Type:</strong> {activity.type}
                      </p>
                      <p>
                        <strong>Description:</strong> {activity.description}
                      </p>
                      <p>
                        <strong>Notes:</strong> {activity.notes}
                      </p>
                      <p>
                        <strong>Activity Date:</strong>{" "}
                        {new Date(activity.activityDate).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mt-4">No activities found.</p>
              )}
            </div>
            <div>
              <h5>Call</h5>
            </div>
            <div>
              <h5>Meeting</h5>
            </div>
            <div>
              <h5>Email</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetAllActivities;
