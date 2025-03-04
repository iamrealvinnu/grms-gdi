import React from "react";

function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto h-screen overflow-auto">
      <h2 className="text-xl text-center font-semibold my-7">Sign Up</h2>
      <form className="flex flex-col gap-4">
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="bg-slate-200 px-2 py-1 rounded focus:outline-blue-300"
        />

        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="bg-slate-200 px-2 py-1 rounded focus:outline-blue-300"
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="bg-slate-200 px-2 py-1 rounded focus:outline-blue-300"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="bg-slate-200 px-2 py-1 rounded focus:outline-blue-300"
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="bg-slate-200 px-2 py-1 rounded focus:outline-blue-300"
        />

        <label>User Type</label>
        <select
          name="userType"
          className="bg-slate-200 px-2 py-1 rounded focus:outline-blue-300"
        >
          <option value="">Select User Type</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
        </select>

        <label>Gender</label>
        <select
          name="gender"
          className="bg-slate-200 px-2 py-1 rounded focus:outline-blue-300"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label>Country</label>
        <select
          name="country"
          className="bg-slate-200 px-2 py-1 rounded focus:outline-blue-300"
        >
          <option value="">Select Country</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Canada">Canada</option>
          <option value="India">India</option>
          <option value="Germany">Germany</option>
          <option value="Australia">Australia</option>
        </select>

        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
