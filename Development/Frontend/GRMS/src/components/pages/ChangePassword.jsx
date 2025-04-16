import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { MdRemoveRedEye } from "react-icons/md";
import { AiFillEyeInvisible } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";

const ChangePassword = () => {
  const { username } = useParams();
  const [formData, setFormData] = useState({
    username: username || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(0);
  const navigate =useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        const name =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ] || username || "User";
        setFormData((prev) => ({ ...prev, username: name }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [username]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "newPassword") {
      validatePasswordStrength(value);
    }

    if (name === "confirmPassword") {
      checkPasswordMatch(formData.newPassword, value);
    }
  };

  // Password strength validation
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
      setPasswordStrength("Strong password!");
    }
  };

  // Check if new and confirm password match
  const checkPasswordMatch = (newPassword, confirmPassword) => {
    if (!confirmPassword) {
      setPasswordMatch(0);
      return;
    }
    setPasswordMatch(newPassword === confirmPassword ? 100 : 50);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      console.log("Sending Payload:", formData);

      const response = await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/User/profile/changepassword",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);
      toast.success("Password changed successfully!");
      setFormData({
        username: username || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength("");
      setPasswordMatch(0);
      window.location.href = "/dashboard"; 
    } catch (error) {
      console.error("API Error:", error.response);
      toast.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit}>
        {/* Current Password */}
        <div className="mb-4">
          <label className="block text-gray-700">Current Password</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <MdRemoveRedEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-gray-700">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <MdRemoveRedEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
          {passwordStrength && (
            <p className={`text-sm mt-1 ${passwordStrength === "Strong password!" ? "text-green-600" : "text-red-600"}`}>
              {passwordStrength}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <MdRemoveRedEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded mt-2">
            <div className={`h-2 rounded ${passwordMatch === 100 ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${passwordMatch}%` }}></div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
