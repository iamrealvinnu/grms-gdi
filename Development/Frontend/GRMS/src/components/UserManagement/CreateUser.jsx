//
// NAME:			  CreateUser.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  05/03/2025
// PURPOSE:			User's SignUp page
//
//

// Imports
import axios from "axios";
import React, { useEffect, useState } from "react";
import withAuth from "../withAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateUser() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    userTypeId: "",
    genderId: "",
    countryId: "",
    claims: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [showClaims, setShowClaims] = useState(false);

  // Extract relevant data from tableData
  const countries =
    tableData.find((item) => item.name === "Countries")?.referenceItems || [];
  const genders =
    tableData.find((item) => item.name === "Gender Types")?.referenceItems ||
    [];
  const userTypes =
    tableData.find((item) => item.name === "User Types")?.referenceItems || [];
  const claimTypes =
    tableData.find((item) => item.name === "Claim Types")?.referenceItems || [];

  const handleClaimChange = (claimId) => {
    setFormData((prevFormData) => {
      const updatedClaims = prevFormData.claims.includes(claimId)
        ? prevFormData.claims.filter((id) => id !== claimId) // Remove if already selected
        : [...prevFormData.claims, claimId]; // Add if not selected
      return { ...prevFormData, claims: updatedClaims };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });

    if (name === "password") {
      validatePasswordStrength(value);
    }
  };

  const validatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}<>]/.test(password);

    if (!minLength) {
      setPasswordStrength("Password must be at least 8 characters.");
    } else if (!hasUppercase) {
      setPasswordStrength("Include at least one uppercase letter.");
    } else if (!hasNumber) {
      setPasswordStrength("Include at least one number.");
    } else if (!hasSpecialChar) {
      setPasswordStrength("Include at least one special character.");
    } else {
      setPasswordStrength("Strong password ✅");
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.userName) {
      newErrors.userName = "User Name is required.";
      isValid = false;
    }
    if (!formData.firstName) {
      newErrors.firstName = "First Name is required.";
      isValid = false;
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required.";
      isValid = false;
    }
    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (passwordStrength !== "Strong password ✅") {
      newErrors.password = passwordStrength;
      isValid = false;
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }
    if (!formData.userTypeId) {
      newErrors.userTypeId = "User Type is required.";
      isValid = false;
    }
    if (!formData.genderId) {
      newErrors.genderId = "Gender is required.";
      isValid = false;
    }
    if (!formData.countryId) {
      newErrors.countryId = "Country is required.";
      isValid = false;
    }
    if (!formData.claims.length === 0) {
      newErrors.claims = "At least one claim must be selected";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const fetchData = async () => {
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
      console.log("Fetched Data:", response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("accessToken");
      const formattedData = {
        ...formData,
        model: "defaultModel"
      };

      const response = await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/User/create",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ Check if the response contains success:false (API-level validation)
      if (response.data?.success === false) {
        throw new Error(response.data.errors?.[0] || "Failed to create user");
      }

      // ✅ Reset form on successful user creation
      setFormData({
        userName: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        userTypeId: "",
        genderId: "",
        countryId: "",
        claims: []
      });

      // ✅ Show success toast
      toast.success("User Created Successfully!");
      console.log("User Created Successfully:", response.data);
    } catch (error) {
      let errorMessage = "Failed to create user. Please try again.";

      if (error.response) {
        const { status, data } = error.response;

        if (
          status === 400 &&
          data.errors?.includes("Username already exists")
        ) {
          errorMessage =
            "User already created. Please try a different username.";
        } else {
          errorMessage = data.errors?.[0] || errorMessage;
        }

        console.error("Error creating User:", data);
      } else if (error.message) {
        // ✅ Handle actual network errors separately
        errorMessage =
          "Network Error. Please try a different username and try again.";
        console.error("Network Error:", error.message);
      }

      // ✅ Show the extracted error message in a toast
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-3 max-w-4xl mx-auto">
      <div className="p-4">
        <h2 className="text-xl text-center font-semibold my-7">Sign Up</h2>
        <form className="flex flex-wrap gap-4" onSubmit={handleSubmit}>
          {/* User Name */}
          <div className="w-full md:w-[48%]">
            <label htmlFor="userName">User Name </label>
            <input
              type="text"
              name="userName"
              placeholder="User Name"
              className="w-full bg-slate-200 px-2 py-2 rounded focus:outline-blue-300"
              value={formData.userName}
              onChange={handleChange}
            />
            {errors.userName && (
              <p className="text-red-500 text-sm">{errors.userName}</p>
            )}
          </div>

          {/* Email */}
          <div className="w-full md:w-[48%]">
            <label htmlFor="email">Email </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full bg-slate-200 px-2 py-2 rounded focus:outline-blue-300"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* First Name */}
          <div className="w-full md:w-[48%]">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full bg-slate-200 px-2 py-2 rounded focus:outline-blue-300"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="w-full md:w-[48%]">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full bg-slate-200 px-2 py-2 rounded focus:outline-blue-300"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>

          {/* Password */}
          <div className="w-full md:w-[48%]">
            <label>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full bg-slate-200 px-2 py-2 rounded focus:outline-blue-300 pr-10"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🔒" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
            {passwordStrength && !errors.password && (
              <p
                className={`text-sm ${
                  passwordStrength === "Strong password ✅"
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {passwordStrength}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="w-full md:w-[48%]">
            <label>Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full bg-slate-200 px-2 py-2 rounded focus:outline-blue-300"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* User Type DropDown */}
          <div className="w-full md:w-[48%]">
            <label>User Type</label>
            <select
              name="userTypeId"
              className="w-full bg-slate-200 px-2 py-2 rounded focus:outline-blue-300"
              value={formData.userTypeId}
              onChange={handleChange}
            >
              <option value="">Select User Type</option>
              {userTypes.map((userType) => (
                <option key={userType.id} value={userType.id}>
                  {userType.description}
                </option>
              ))}
            </select>
            {errors.userTypeId && (
              <p className="text-red-500 text-sm">{errors.userTypeId}</p>
            )}
          </div>

          {/* Gender DropDown */}
          <div className="w-full md:w-[48%]">
            <label>Gender</label>
            <select
              name="genderId"
              className="w-full bg-slate-200 px-2 py-2 rounded focus:outline-blue-300"
              value={formData.genderId}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              {genders.map((gender) => (
                <option key={gender.id} value={gender.id}>
                  {gender.description}
                </option>
              ))}
            </select>
            {errors.genderId && (
              <p className="text-red-500 text-sm">{errors.genderId}</p>
            )}
          </div>

          {/* Country DropDown */}
          <div className="w-full md:w-[48%]">
            <label>Country</label>
            <select
              name="countryId"
              className="w-full bg-slate-200 px-2 py-2 rounded focus:outline-blue-300"
              value={formData.countryId}
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.description}
                </option>
              ))}
            </select>
            {errors.countryId && (
              <p className="text-red-500 text-sm">{errors.countryId}</p>
            )}
          </div>

          {/* Claims */}
          <div className="w-full md:w-[48%] relative">
            <label>Claims</label>
            {/* Dropdown Button */}
            <div
              className="w-full bg-slate-200 px-2 py-2 rounded focus:outline-blue-300 cursor-pointer"
              onClick={() => setShowClaims(!showClaims)}
            >
              {formData.claims.length > 0
                ? claimTypes
                    .filter((claim) => formData.claims.includes(claim.id))
                    .map((claim) => claim.description)
                    .join(", ")
                : "Select Claim Types"}
            </div>

            {/* Dropdown List with Checkboxes */}
            {showClaims && (
              <div className="absolute w-full bg-white border border-gray-300 shadow-md rounded mt-1 z-10">
                {claimTypes.map((claim) => (
                  <label
                    key={claim.id}
                    className="flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={formData.claims.includes(claim.id)}
                      onChange={() => handleClaimChange(claim.id)}
                    />
                    {claim.description}
                  </label>
                ))}
              </div>
            )}
            
            {errors.claims && (
              <p className="text-red-500 text-sm">{errors.claims}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
          >
            Sign Up
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}

export default withAuth(CreateUser);
