import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function EditAccount() {
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
    changedById: "",
    description: "",
    number: ""
  });

  const [errors, setErrors] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [states, setStates] = useState({});
  const [countries, setCountries] = useState({});
  const [accountTypes, setAccountTypes] = useState({});
  const [addressTypes, setAddressTypes] = useState({});
  const [ownershipTypes, setOwnershipTypes] = useState({});
  const [industries, setIndustries] = useState({});

  const fetchAccountDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://grms-dev.gdinexus.com:49181/api/v1/marketing/Account/one/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const AccountData = response.data?.data || response.data;
      const address =
        AccountData.addresses && AccountData.addresses.length > 0
          ? AccountData.addresses[0].address
          : {};
      setFormAccountData({
        ownershipTypeId: AccountData.ownershipTypeId || "",
        name: AccountData.name || "",
        email: AccountData.email || "",
        accountTypeId: AccountData.accountTypeId || "",
        phoneNumber: AccountData.phoneNumber || "",
        numberOfEmployees: AccountData.numberOfEmployees || "",
        annualRevenue: AccountData.annualRevenue || "",
        industryTypeId: AccountData.industryTypeId || "",
        assignedToId: AccountData.assignedToId || "",
        addressTypeId: address.addressTypeId || "",
        address1: address.address1 || "",
        city: address.city || "",
        zip: address.zip || "",
        stateId: address.stateId || "",
        countryId: address.countryId || "",
        changedById: AccountData.changedById || "",
        description: AccountData.description || "",
        number: AccountData.number || ""
      });

      console.log("anna", response.data);
    } catch (error) {
      toast.error("Error fetching account details");
      console.log(error);
    }
  };

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
      const referenceData = response.data?.data || response.data;
      const industriesMap = {};
      const countryMap = {};
      const stateMap = {};
      const ownershipMap = {};
      const accountTypesMap = {};
      const addressMap = {};

      referenceData.forEach((reference) => {
        if (reference.name === "Industry Types") {
          reference.referenceItems.forEach((item) => {
            industriesMap[item.id] = item.description;
          });
        } else if (reference.name === "Account Types") {
          reference.referenceItems.forEach((item) => {
            accountTypesMap[item.id] = item.description;
          });
        } else if (reference.name === "Ownership Types") {
          reference.referenceItems.forEach((item) => {
            ownershipMap[item.id] = item.code;
          });
        } else if (reference.name === "Countries") {
          reference.referenceItems.forEach((item) => {
            countryMap[item.id] = item.description;
          });
        } else if (reference.name === "States") {
          reference.referenceItems.forEach((item) => {
            stateMap[item.id] = item.description;
          });
        } else if (reference.name === "Address Types") {
          reference.referenceItems.forEach((item) => {
            addressMap[item.id] = item.description;
          });
        }
      });
      setIndustries(industriesMap);
      setCountries(countryMap);
      setStates(stateMap);
      setAddressTypes(addressMap);
      setOwnershipTypes(ownershipMap);
      setAccountTypes(accountTypesMap);
    } catch (error) {
      setErrors(error.message);
      toast.error("Fetching error message.");
      console.error("Error fetching Table data:", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://grms-dev.gdinexus.com:49181/api/v1/User/all/true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setUserDetails(response.data.data);
      console.log("abaha", response.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
    fetchTableData();
    fetchUserDetails();
  }, [accountId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAccountData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");

      const updateAccountData = {
        ...formAccountData,
        id: accountId,
        changedById: formAccountData.changedById
      };

      await axios.put(
        "https://grms-dev.gdinexus.com:49181/api/v1/marketing/Account/update",
        updateAccountData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      toast.success("Account updated successfully");
      setTimeout(() => {
        navigate("/getAllaccount");
      }, 1000);
    } catch (error) {
      console.error("Error submitting account data:", error);
      // Show more detailed error message
      toast.error(error.response?.data?.message || "Failed to update account");
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <form onSubmit={handleAccountSubmit}>
          <div className="p-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Edit Account Details
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
                  {Object.entries(ownershipTypes).map(([id, description]) => (
                    <option key={id} value={id}>
                      {description}
                    </option>
                  ))}
                </select>
                {errors.ownershipTypeId && (
                  <p className="text-red-500 text-sm">
                    {errors.ownershipTypeId}
                  </p>
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
                  {Object.entries(accountTypes).map(([id, description]) => (
                    <option key={id} value={id}>
                      {description}
                    </option>
                  ))}
                </select>
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
              </div>

              <div className="w-full md:w-[48%]">
                <label className="block text-gray-700 font-medium">
                  Account Number:
                </label>
                <input
                  type="number"
                  name="number"
                  placeholder="Number of Employees"
                  value={formAccountData.number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                />
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
                  {Object.entries(industries).map(([id, description]) => (
                    <option key={id} value={id}>
                      {description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-[48%]">
                <label className="block text-gray-700 font-medium">
                  Assigned To
                </label>
                <select
                  name="assignedToId"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                  value={formAccountData.assignedToId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Assign User</option>
                  {userDetails &&
                    Array.isArray(userDetails) &&
                    userDetails.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.profile?.firstName}
                        {user.profile?.lastName}
                      </option>
                    ))}
                </select>
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
              </div>

              <div className="w-full md:w-[48%]">
                <label className="block text-gray-700 font-medium">
                  Description:
                </label>
                <textarea
                  rows="4"
                  type="text"
                  name="description"
                  value={formAccountData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Enter Annual Revenue value..."
                />
              </div>

              <div className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300">
                {/* <label className="block font-medium text-gray-700">
                  Add Address
                </label> */}

                <div className="w-full">
                  <label className="block font-medium text-gray-700">
                    Address
                  </label>
                  <select
                    name="addressTypeId"
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                    value={formAccountData.addressTypeId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Address</option>
                    {Object.entries(addressTypes).map(([id, description]) => (
                      <option key={id} value={id}>
                        {description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Street */}
                <div className="w-full mt-4">
                  <label className="block font-medium  text-gray-700 p-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="address1"
                    value={formAccountData.address1}
                    onChange={handleChange}
                    placeholder="Street"
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                  />
                </div>

                {/* Town */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="w-full md:w-[48%]">
                    <label className="block font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formAccountData.city}
                      onChange={handleChange}
                      placeholder="Town"
                      className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                    />
                  </div>

                  {/* Pincode */}
                  <div className="w-full md:w-[48%]">
                    <label className="block font-medium text-gray-700">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formAccountData.zip}
                      onChange={handleChange}
                      placeholder="Pincode"
                      className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                    />
                  </div>
                </div>

                {/* State */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="w-full md:w-[48%]">
                    {" "}
                    <label className="block font-medium text-gray-700">
                      State
                    </label>
                    <select
                      name="stateId"
                      className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                      value={formAccountData.stateId}
                      onChange={handleChange}
                    >
                      <option value="">Select State</option>
                      {Object.entries(states).map(([id, description]) => (
                        <option key={id} value={id}>
                          {description}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country Dropdown */}
                  <div className="w-full md:w-[48%]">
                    <label className="block font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      name="countryId"
                      className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                      value={formAccountData.countryId}
                      onChange={handleChange}
                    >
                      <option value="">Select Country</option>
                      {Object.entries(countries).map(([id, description]) => (
                        <option key={id} value={id}>
                          {description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
              >
                UPDATE
              </button>
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default EditAccount;
