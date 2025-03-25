import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [code, setCode] = useState(new Array(6).fill("")); // 6 boxes for OTP
  const inputRefs = useRef([]);

  const handleCodeChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move focus to next input if a number is entered
      if (value && index < code.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const validPasswordStrength = (password) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resetCode = code.join(""); // Combine the 6-digit reset code

    if (resetCode.length < 6) {
      toast.error("Please enter the full reset code.");
      return;
    }

    try {
      await axios.post(
        "https://grms-dev.gdinexus.com:49181/api/v1/Auth/resetpassword",
        { code: resetCode, password },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Password reset successful! Redirecting...");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.errors?.join(" ") || "Reset failed.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Reset Password
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          Enter the reset code sent to your email
        </p>

        {/* Reset Code Inputs */}
        <div className="flex justify-center gap-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validPasswordStrength(e.target.value);
                }}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
