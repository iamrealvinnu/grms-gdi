import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdRemoveRedEye } from "react-icons/md";
import { AiFillEyeInvisible } from "react-icons/ai";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate password strength for newPassword field
    if (name === "newPassword") {
      validatePasswordStrength(value);
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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/User/profile/changepassword",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password changed successfully!");
      setFormData({ username: "", currentPassword: "", newPassword: "" });
      setPasswordStrength("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Current Password Field */}
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
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <MdRemoveRedEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
        </div>

        {/* New Password Field */}
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
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <MdRemoveRedEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
          {/* Password Strength Indicator */}
          {passwordStrength && (
            <p
              className={`text-sm mt-1 ${
                passwordStrength === "Strong password!"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {passwordStrength}
            </p>
          )}
        </div>

        {/* Submit Button */}
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
