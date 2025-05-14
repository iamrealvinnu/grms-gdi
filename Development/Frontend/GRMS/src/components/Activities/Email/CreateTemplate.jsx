import React from "react";

function CreateTemplate() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-8">
      
      {/* Subject Section */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Subject:</h4>
        <div className="flex flex-col gap-2">
          <label className="text-gray-700">Welcome to</label>
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter subject"
          />
        </div>
      </div>

      {/* Greeting Section */}
      <div className="flex flex-col gap-2">
        <label className="text-md font-semibold text-gray-800">Dear</label>
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Recipient name"
        />
      </div>

      {/* Intro Paragraph */}
      <div>
        <p className="text-gray-700 leading-relaxed">
          Welcome to <span className="font-semibold">!</span> We are excited to help you optimize workflows and
          customer interactions.
        </p>
      </div>

      {/* Key Features Section */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Key Features:</h4>
        <textarea
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="List key features here"
        />
      </div>

      {/* Contact Section */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold">Need help? Contact:</h4>
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-medium">Support Email:</label>
          <input
            type="email"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="support@example.com"
          />
        </div>
        <p className="text-gray-700">
          We are here to support you. Let’s achieve great results together!
        </p>
        <p className="text-gray-700">Let me know if you need further refinement!</p>
      </div>
      <div>
        <button>Submit</button>
      </div>

      {/* Closing Section */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Best Regards,</h4>
        <div className="text-gray-700 space-y-1">
          <p>Name</p>
          <p>Position</p>
          <p>Company</p>
          <p>Contact Information</p>
        </div>
      </div>
    </div>
  );
}

export default CreateTemplate;









