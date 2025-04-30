import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function AddAccount() {
  const [formAccountData, setFormAccountData] = useState({
    ownershipTypeId: "",
    name: "",
    email: "",
    accountTypeId: "",
    phoneNumber: "",
    numberOfEmployees: "",
    annualRevenue: "",
    industryTypeId: "",
    assignedToId: "",
    addressTypeId: "",
    address1: "",
    city: "",
    zip: "",
    stateId: "",
    countryId: "",
    createdById: "",
  });

  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  const industriesTypes= tableData.find((item) => item.name === "Industry Types")?.referenceItems || [];
  const StateTypes = tableData.find((item) => item.name === "States")?.referenceItems || [];
  const CountryTypes = tableData.find((item) => item.name === "Countries")?.referenceItems || [];
  const AddressTypes = tableData.find((item) => item.name === "Address Types")?.referenceItems || [];
  const AccountTypes = tableData.find((item) => item.name === "Account Types")?.referenceItems || [];
  const OwnershipTypes = tableData.find((item) => item.name === "Ownership Types")?.referenceItems || [];

    const fetchTableData = async () => {
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
        setTableData(response.data.data);
        // console.log("fetched tableData:", response.data.data);
      } catch (error) {
        console.error("Error fetching Table data:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://grms-dev.gdinexus.com:49181/api/v1/User/all/true",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setUsers(response.data.data); // Assuming the response has a `data` field
        // console.log("Fetched users:", response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    useEffect(() => {
      fetchTableData();
      fetchUsers();
    }, []);

    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId =
            decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ] || "User";
          setCurrentUserId(userId);
          // console.log('nnn',name);
        } catch (error) {
          console.error("Error decoding token:", error); // Log error if token decoding fails
        }
      }
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAccountData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formAccountData.name) {
      newErrors.name = "Company name is required.";
      isValid = false;
    }
    if (!formAccountData.email) {
      newErrors.email = "Company email is required.";
      isValid = false;
    }
    if (!/^\d{10}$/.test(formAccountData.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
      isValid = false;
    }
    if (!formAccountData.ownershipTypeId) {
      newErrors.ownershipTypeId = "Accont Onwer is required.";
      isValid = false;
    }
    if (!formAccountData.numberOfEmployees) {
      newErrors.numberOfEmployees = "Number of employees is required.";
      isValid = false;
    }
    if (!formAccountData.annualRevenue) {
      newErrors.annualRevenue = "Contact Number is required.";
      isValid = false;
    }
    if (!formAccountData.assignedToId) {
      newErrors.assignedToId = "Contact Number is required.";
      isValid = false;
    }
    if (!formAccountData.accountTypeId) {
      newErrors.accountTypeId = "Account Type is required.";
      isValid = false;
    }
    if (!formAccountData.industryTypeId) {
      newErrors.industryTypeId = "Industry Type is required.";
      isValid = false;
    }
        
    setErrors(newErrors);
    return isValid;
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();

    if (!validForm()) {
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const dataPassed = {
        ...formAccountData,
        createdById: currentUserId,
      };
      const response = await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Account/create",
        dataPassed,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      toast.success("Account created successfully!");
      setTimeout(()=>{
        navigate("/getAllaccount")
      },1500);
      console.log("Account created successfully:", response.data);
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Error creating account. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <form onSubmit={handleAccountSubmit}>
        <div className="p-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Add Account Details
          </h3>
          <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-[48%]">
              <label className="block text-gray-700 font-medium">
                Account Owner:
              </label>
              <select
                name="ownershipTypeId"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                value={formAccountData.ownershipTypeId}
                onChange={handleChange}
                required
              >
                <option value="">Select Ownership</option>
                {OwnershipTypes.map((Ownership) => (
                  <option key={Ownership.id} value={Ownership.id}>
                    {Ownership.code}
                  </option>
                ))}
              </select>
              {errors.ownershipTypeId && (
                <p className="text-red-500 text-sm">{errors.ownershipTypeId}</p>
              )}
            </div>

            <div className="w-full md:w-[48%]">
              <label className="block text-gray-700 font-medium">
                Account Name:
              </label>
              <input
                type="text"
                name="name"
                placeholder="Account Name"
                value={formAccountData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="w-full md:w-[48%]">
              <label className="block text-gray-700 font-medium">
                Email:
              </label>
              <input
                type="email"
                name="email"
                placeholder="Company Email"
                value={formAccountData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="w-full md:w-[48%]">
              <label className="block text-gray-700 font-medium">
                Account Type:
              </label>
              <select
                name="accountTypeId"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                value={formAccountData.accountTypeId}
                onChange={handleChange}
                required
              >
                <option value="">Select AccountType</option>
                {AccountTypes.map((accountType) => (
                  <option key={accountType.id} value={accountType.id}>
                    {accountType.code}
                  </option>
                ))}
              </select>
              {errors.accountTypeId && (
                <p className="text-red-500 text-sm">{errors.accountTypeId}</p>
              )}
            </div>

            <div className="w-full md:w-[48%]">
              <label className="block text-gray-700 font-medium">
                Phone Number:
              </label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Contact Number"
                value={formAccountData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="w-full md:w-[48%]">
              <label className="block text-gray-700 font-medium">
                No.Of Employees:
              </label>
              <input
                type="number"
                name="numberOfEmployees"
                placeholder="Number of Employees"
                value={formAccountData.numberOfEmployees}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              />
              {errors.numberOfEmployees && (
                <p className="text-red-500 text-sm">{errors.numberOfEmployees}</p>
              )}
            </div>

            <div className="w-full md:w-[48%]">
              <label className="block text-gray-700 font-medium">
                Industry:
              </label>
              <select
                name="industryTypeId"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                value={formAccountData.industryTypeId}
                onChange={handleChange}
                required
              >
                <option value="">Select Industry</option>
                {industriesTypes.map((industry) => (
                  <option key={industry.id} value={industry.id}>
                    {industry.description}
                  </option>
                ))}
              </select>

              {errors.industryTypeId && (
                <p className="text-red-500 text-sm">{errors.industryTypeId}</p>
              )}
            </div>

            <div className="w-full md:w-[48%]">
              <label className="block text-gray-700 font-medium">Assigned To</label>
              <select
                name="assignedToId"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                value={formAccountData.assignedToId}
                onChange={handleChange}
                required
              >
                <option value="">Select User</option>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.profile?.firstName}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading users...</option>
                )}
              </select>
              {errors.assignedToId && (
                <p className="text-red-500 text-sm">{errors.assignedToId}</p>
              )}
            </div>

            <div className="w-full md:w-[48%]">
              <label className="block text-gray-700 font-medium">
                Annual Revenue:
              </label>
              <input
                type="number"
                name="annualRevenue"
                value={formAccountData.annualRevenue}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Enter Annual Revenue value..."
              />
              {errors.annualRevenue && (
                <p className="text-red-500 text-sm">{errors.annualRevenue}</p>
              )}
            </div>

            <div className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300">
              <label className="block font-medium text-gray-700">
                Add Address
              </label>

              <div className="w-full">
                
                <select
                  name="addressTypeId"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                  value={formAccountData.addressTypeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Address</option>
                  {AddressTypes.map((addressType) => (
                    <option key={addressType.id} value={addressType.id}>
                      {addressType.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Street */}
              <input
                type="text"
                name="address1"
                value={formAccountData.address1}
                onChange={handleChange}
                placeholder="Street"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"

              />

              {/* Town */}
              <input
                type="text"
                name="city"
                value={formAccountData.city}
                onChange={handleChange}
                placeholder="Town"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"

              />

              {/* Pincode */}
              <input
                type="text"
                name="zip"
                value={formAccountData.zip}
                onChange={handleChange}
                placeholder="Pincode"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"

              />

              {/* State */}
              <div className="w-full border-b-2 p-2 bg-white">
                <label className="block font-medium text-gray-700">State</label>
                <select
                  name="stateId"
                  className="w-full p-2 bg-white"
                  value={formAccountData.stateId}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {StateTypes.map((StateType) => (
                    <option key={StateType.id} value={StateType.id}>
                      {StateType.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Dropdown */}
              <div className="w-full border-b-2 p-2 bg-white">
                <label className="block font-medium text-gray-700">
                  Country
                </label>
                <select
                  name="countryId"
                  className="w-full p-2 bg-white"
                  value={formAccountData.countryId}
                  onChange={handleChange}
                >
                  <option value="">Select Country</option>
                  {CountryTypes.map((countryType) => (
                    <option key={countryType.id} value={countryType.id}>
                      {countryType.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
            >
              Save
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AddAccount;
