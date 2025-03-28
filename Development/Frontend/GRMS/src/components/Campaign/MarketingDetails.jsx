//
// NAME:			  MarketingDetails.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  14/03/2025
// PURPOSE:			Marketing manager Get Campaign Details
//
//

// Imports
import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import withAuth from "../withAuth";

function MarketingDetails() {
  return (
    <div className="p-5">
      <div className="flex justify-end mb-4">
        <Link
          to="/campaignCreate"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} /> Create Campaign
        </Link>
      </div>
    </div>
  );
}

export default withAuth(MarketingDetails);
