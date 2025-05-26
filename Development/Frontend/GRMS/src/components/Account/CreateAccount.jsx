import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function CreateAccount() {
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
    description: "",
    number: "",
  });

  const [errors, setErrors] = useState({});
  const [contactForms, setContactForms] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const industriesTypes =
    tableData.find((item) => item.name === "Industry Types")?.referenceItems ||
    [];
  const stateTypes =
    tableData.find((item) => item.name === "States")?.referenceItems || [];
  const countryTypes =
    tableData.find((item) => item.name === "Countries")?.referenceItems || [];
  const addressTypes =
    tableData.find((item) => item.name === "Address Types")?.referenceItems ||
    [];
  const accountTypes =
    tableData.find((item) => item.name === "Account Types")?.referenceItems ||
    [];
  const ownershipTypes =
    tableData.find((item) => item.name === "Ownership Types")?.referenceItems ||
    [];

  const fetchTableData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/Reference/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTableData(response.data.data);
    } catch (error) {
      console.error("Error fetching Table data:", error);
      toast.error("Failed to load reference data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/User/all/true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTableData(), fetchUsers()]).then(() => {
      setLoading(false);
    });
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
      } catch (error) {
        console.error("Error decoding token:", error);
        toast.error("Invalid access token.");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "numberOfEmployees" || name === "annualRevenue"
        ? parseInt(value, 10) || ""
        : value;
    setFormAccountData((prevData) => ({ ...prevData, [name]: newValue }));
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
      newErrors.ownershipTypeId = "Account Owner is required.";
      isValid = false;
    }
    if (
      formAccountData.numberOfEmployees === "" ||
      isNaN(formAccountData.numberOfEmployees)
    ) {
      newErrors.numberOfEmployees = "Number of employees is required.";
      isValid = false;
    }
    if (
      formAccountData.annualRevenue === "" ||
      isNaN(formAccountData.annualRevenue)
    ) {
      newErrors.annualRevenue = "Annual revenue is required.";
      isValid = false;
    }
    if (!formAccountData.assignedToId) {
      newErrors.assignedToId = "Assigned user is required.";
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
    if (!formAccountData.stateId) {
      newErrors.stateId = "State is required.";
      isValid = false;
    }
    if (!formAccountData.countryId) {
      newErrors.countryId = "Country is required.";
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
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const dataPassed = {
        ...formAccountData,
        createdById: currentUserId,
        annualRevenue: parseInt(formAccountData.annualRevenue || 0, 10),
        numberOfEmployees: parseInt(formAccountData.numberOfEmployees || 0, 10),
      };

      // **CRITICAL DEBUGGING STEP:**
      console.log("Data being sent:", dataPassed); // Log the data *before* sending

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/marketing/Account/create`,
        dataPassed,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response); // Log the *entire* response
      console.log("Response data:", response.data);

      if (response.data.success) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate("/getAllaccount");
        }, 1500);
      } else {
        console.error("Account creation failed on the server:", response.data);
        toast.error(
          `Error creating account: ${
            response.data.errors
              ? response.data.errors.join(", ")
              : "Server error"
          }`
        );
      }
    } catch (error) {
      console.error("Error creating account:", error);
      console.error("Error response:", error.response);
      toast.error("Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const handleAddContact = () => {
    setShowContactForm(true);
  };

  const handleCloseContactForm = (index) => {
    const updatedForms = [...contactForms];
    updatedForms.splice(index, 1);
    setContactForms(updatedForms);
  };

  const handleAddNewContact = () => {
    setContactForms([...contactForms, {}]);
    setShowContactForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-2 bg-white shadow-lg rounded-lg">
      <form onSubmit={handleAccountSubmit}>
        <div className="p-2">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Add Account Details
          </h3>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
            <div className="w-full">
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
                {ownershipTypes.map((ownership) => (
                  <option key={ownership.id} value={ownership.id}>
                    {ownership.code}
                  </option>
                ))}
              </select>
              {errors.ownershipTypeId && (
                <p className="text-red-500 text-sm">{errors.ownershipTypeId}</p>
              )}
            </div>

            <div className="w-full">
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

            <div className="w-full">
              <label className="block text-gray-700 font-medium">Email:</label>
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

            <div className="w-full">
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
                {accountTypes.map((accountType) => (
                  <option key={accountType.id} value={accountType.id}>
                    {accountType.code}
                  </option>
                ))}
              </select>
              {errors.accountTypeId && (
                <p className="text-red-500 text-sm">{errors.accountTypeId}</p>
              )}
            </div>

            <div className="w-full">
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

            <div className="w-full">
              <label className="block text-gray-700 font-medium">
                No.Of Employees:
              </label>
              <input
                type="text"
                name="numberOfEmployees"
                placeholder="Number of Employees"
                value={formAccountData.numberOfEmployees}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              />
              {errors.numberOfEmployees && (
                <p className="text-red-500 text-sm">
                  {errors.numberOfEmployees}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-gray-700 font-medium">
                Account Number:
              </label>
              <input
                type="text"
                name="number"
                placeholder="Enter the Account Number"
                value={formAccountData.number}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="w-full">
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

            <div className="w-full">
              <label className="block text-gray-700 font-medium">
                Annual Revenue:
              </label>
              <input
                type="text"
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

            <div className="w-full">
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
                placeholder="Enter Notes..."
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Address Section */}
            <div className="w-full md:w-1/2 px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300">
              <label className="block font-bold text-gray-700">
                Add Address
              </label>

              {/* Address Type */}
              <div className="w-full">
                <select
                  name="addressTypeId"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                  value={formAccountData.addressTypeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Address</option>
                  {addressTypes.map((addressType) => (
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

              {/* City & ZIP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="w-full">
                  <label className="block font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formAccountData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                  />
                </div>
                <div className="w-full">
                  <label className="block font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formAccountData.zip}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                  />
                </div>
              </div>

              {/* State & Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="w-full">
                  <label className="block font-medium text-gray-700">
                    State
                  </label>
                  <select
                    name="stateId"
                    className="w-full p-2 bg-white"
                    value={formAccountData.stateId}
                    onChange={handleChange}
                  >
                    <option value="">Select State</option>
                    {stateTypes.map((stateType) => (
                      <option key={stateType.id} value={stateType.id}>
                        {stateType.description}
                      </option>
                    ))}
                  </select>
                  {errors.stateId && (
                    <p className="text-red-500 text-sm">{errors.stateId}</p>
                  )}
                </div>
                <div className="w-full">
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
                    {countryTypes.map((countryType) => (
                      <option key={countryType.id} value={countryType.id}>
                        {countryType.description}
                      </option>
                    ))}
                  </select>
                  {errors.countryId && (
                    <p className="text-red-500 text-sm">{errors.countryId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="w-full md:w-1/2 px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300">
              <label className="block font-bold text-gray-700">
                Contact Information
              </label>

              {/* Render existing contact forms */}
              {contactForms.map((contact, index) => (
                <div
                  key={index}
                  className="relative mb-4 p-4 border rounded-lg"
                >
                  <button
                    type="button"
                    onClick={() => handleCloseContactForm(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="w-full">
                      <label className="block font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name={`firstName-${index}`}
                        value={contact.firstName || ""}
                        onChange={(e) => {
                          const updatedForms = [...contactForms];
                          updatedForms[index].firstName = e.target.value;
                          setContactForms(updatedForms);
                        }}
                        placeholder="First Name"
                        className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name={`lastName-${index}`}
                        value={contact.lastName || ""}
                        onChange={(e) => {
                          const updatedForms = [...contactForms];
                          updatedForms[index].lastName = e.target.value;
                          setContactForms(updatedForms);
                        }}
                        placeholder="Last Name"
                        className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="w-full">
                      <label className="block font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name={`email-${index}`}
                        value={contact.email || ""}
                        onChange={(e) => {
                          const updatedForms = [...contactForms];
                          updatedForms[index].email = e.target.value;
                          setContactForms(updatedForms);
                        }}
                        placeholder="Email"
                        className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium">
                        Assigned To
                      </label>
                      <select
                        name={`assignedToId-${index}`}
                        className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                        value={formAccountData.assignedToId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Assign User</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.profile?.firstName} {user.profile?.lastName}
                          </option>
                        ))}
                      </select>
                      {errors.assignedToId && (
                        <p className="text-red-500 text-sm">
                          {errors.assignedToId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mobile & Department */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="w-full">
                      <label className="block font-medium text-gray-700">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        name={`mobile-${index}`}
                        value={contact.mobile || ""}
                        onChange={(e) => {
                          const updatedForms = [...contactForms];
                          updatedForms[index].mobile = e.target.value;
                          setContactForms(updatedForms);
                        }}
                        placeholder="Mobile Number"
                        className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block font-medium text-gray-700">
                        Department
                      </label>
                      <input
                        type="text"
                        name={`department-${index}`}
                        value={contact.department || ""}
                        onChange={(e) => {
                          const updatedForms = [...contactForms];
                          updatedForms[index].department = e.target.value;
                          setContactForms(updatedForms);
                        }}
                        placeholder="Department"
                        className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Contact Button */}
              <div className="flex items-center justify-center mt-4 rounded-md p-2">
                <button
                  type="button"
                  onClick={handleAddContact}
                  className="bg-slate-300 gap-2 p-2 rounded"
                >
                  + Add Contact
                </button>
              </div>
            </div>
          </div>

          {/* Modal for new contact form */}
          {showContactForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add New Contact</h3>
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="w-full">
                    <label className="block font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="newFirstName"
                      className="w-full px-4 py-2 mt-1 border rounded-lg"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="newLastName"
                      className="w-full px-4 py-2 mt-1 border rounded-lg"
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="newEmail"
                      className="w-full px-4 py-2 mt-1 border rounded-lg"
                      placeholder="Email"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="newPhone"
                      className="w-full px-4 py-2 mt-1 border rounded-lg"
                      placeholder="Phone"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNewContact}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Add Contact
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default CreateAccount;
