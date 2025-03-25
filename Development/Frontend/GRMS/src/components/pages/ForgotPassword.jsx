//
// NAME:			  ForgotPassword.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  11/03/2025
// PURPOSE:			User's Forgot-Password Page
//
//

// Imports
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/Auth/forgotpassword",
        email, // ✅ Send raw string as the request body
        {
          headers: {
            "Content-Type": "application/json", // ✅ Set JSON content type
          },
        }
      );

      console.log("Response:", response.data);
      toast.success("Check your email for the reset link");
      navigate("/resetPassword");
    } catch (error) {
      console.error("Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <div className="flex items-center justify-center mt-[150px] w-full">
      <div className="w-full max-w-[600px] p-6 bg-blue-100 shadow-lg rounded-xl text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Forgot Password</h2>
        <p className="text-gray-500 mb-6">Enter your email to receive a reset link</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-blue-300"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
