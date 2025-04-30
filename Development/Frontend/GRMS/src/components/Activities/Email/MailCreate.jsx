import React, { useState } from "react";

function MailCreate({opportunityId,onClose}) {
  const [form, setForm] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    message: "",
    attachments: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachments") {
      setForm({ ...form, [name]: files });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email Form Data:", form);
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        X
      </button>
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-4">Compose Mail</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block font-semibold">To:</label>
          <input
            type="email"
            name="to"
            value={form.to}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">CC:</label>
          <input
            type="email"
            name="cc"
            value={form.cc}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">BCC:</label>
          <input
            type="email"
            name="bcc"
            value={form.bcc}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Subject:</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Message:</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="5"
            style={{ fontSize: "14px", fontFamily: "Arial" }}
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold">Attachments:</label>
          <input
            type="file"
            name="attachments"
            onChange={handleChange}
            multiple
            className="block w-full text-sm text-gray-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
    </div>
  );
}

export default MailCreate;
