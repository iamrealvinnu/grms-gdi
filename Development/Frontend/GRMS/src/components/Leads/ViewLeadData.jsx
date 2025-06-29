import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewLeadData() {
    const [formLeadData, setFormLeadData] = useState({
        company: "",
        firstName: "",
        lastName: "",
        assignedToId: "",
        departmentId: "",
        email: "",
        industryId: "",
        phoneNumber: "",
        statusId: "",
        address1: "",
        city: "",
        zip: "",
        stateId: "",
        countryId: "",
        createdById: "",
        addressTypeId: "",
        notes: ""
    });
    const [leadStatus, setLeadStatus] = useState({});
    const [leadState, setLeadState] = useState({});
    const [leadindustries, setLeadIndustries] = useState({});
    const [leadDepartments, setLeadDepartments] = useState({});
    const [leadAddressType, setLeadAddressType] = useState({});
    const [leadCountryType, setLeadCountryType] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    const { leadId } = useParams();

    useEffect(() => {
        fetchLeadDetails();
        fetchTableData();
        fetchUserDetails();
    }, [leadId]);

    const fetchLeadDetails = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/marketing/Lead/one/${leadId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const leads = response.data?.data || response.data;
            const address =
                leads.addresses && leads.addresses.length > 0
                    ? leads.addresses[0].address
                    : {};

            setFormLeadData({
                firstName: leads.firstName || "",
                lastName: leads.lastName || "",
                company: leads.company || "",
                email: leads.email || "",
                phoneNumber: leads.phoneNumber || "",
                assignedToId: leads.assignedToId || "",
                industryId: leads.industryId || "",
                departmentId: leads.departmentId || "",
                changedById: leads.createdById || "",
                statusId: leads.statusId || "",
                notes: leads.notes || "",
                address1: address.address1 || "",
                city: address.city || "",
                zip: address.zip || "",
                stateId: address.stateId || "",
                countryId: address.countryId || "",
                addressTypeId: address.addressTypeId || "",
            });
            console.log("View Lead", response.data);
            // console.log("Full Address:", leads?.addresses?.[0]?.address);
        } catch (error) {
            setErrors(error.message);
            toast.error("Failed to fetch lead details.");
        } finally {
            setLoading(false);
        }
    };

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
            const referenceData = response.data?.data || response.data;
            const industriesMap = {};
            const departmentsMap = {};
            const statusMap = {};
            const countryMap = {};
            const stateMap = {};
            const addressMap = {};

            referenceData.forEach((reference) => {
                if (reference.name === "Industry Types") {
                    reference.referenceItems.forEach((item) => {
                        industriesMap[item.id] = item.description;
                    });
                } else if (reference.name === "Department Types") {
                    reference.referenceItems.forEach((item) => {
                        departmentsMap[item.id] = item.description;
                    });
                } else if (reference.name === "Lead Status") {
                    reference.referenceItems.forEach((item) => {
                        statusMap[item.id] = item.code;
                    });
                } else if (reference.name === "Countries") {
                    reference.referenceItems.forEach((item) => {
                        countryMap[item.id] = item.description;
                    });
                } else if (reference.name === "States") {
                    reference.referenceItems.forEach((item) => {
                        stateMap[item.id] = item.description;
                    });
                } else if (reference.name === "Address Types") {
                    reference.referenceItems.forEach((item) => {
                        addressMap[item.id] = item.description;
                    });
                }
            });
            setLeadIndustries(industriesMap);
            setLeadDepartments(departmentsMap);
            setLeadStatus(statusMap);
            setLeadCountryType(countryMap);
            setLeadState(stateMap);
            setLeadAddressType(addressMap);
        } catch (error) {
            setErrors(error.message);
            toast.error("Fetching error message.");
            console.error("Error fetching Table data:", error);
        }
    };

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/User/all/true`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("userDetails response:", response.data.data); // Check this
            setUserDetails(response.data.data); // Make sure it's an array!
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (errors)
        return <div className="text-center py-10 text-red-500">{errors}</div>;



    return (
        <div className='max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
            <form>
                <div>
                    <h4 className="text-2xl font-semibold mb-4">Company Details</h4>
                    <div className="flex flex-wrap gap-4">
                        <div className="w-full md:w-[48%]">
                            <label>Company Name</label>
                            <input type="text" value={formLeadData.company} readOnly className="w-full border text-blue-700 p-2 rounded" />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <label>Lead Owner</label>
                            {Array.isArray(userDetails) && userDetails.length > 0 && (() => {
                                const assignedUser = userDetails.find(user => user.id === formLeadData.assignedToId);
                                const fullName = assignedUser?.profile
                                    ? `${assignedUser.profile.firstName || ""} ${assignedUser.profile.lastName || ""}`
                                    : "N/A";
                                return (
                                    <input
                                        type="text"
                                        value={fullName.trim() || "N/A"}
                                        readOnly
                                        className="w-full border text-blue-700 p-2 rounded"
                                    />
                                );
                            })()}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-2xl font-semibold mb-4">Contact Information</h4>
                    <div className="flex flex-wrap gap-4">
                        <div className="w-full md:w-[48%]">
                            <label>First Name</label>
                            <input type="text" value={formLeadData.firstName} readOnly className="w-full border text-blue-700 p-2 rounded" />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <label>Last Name</label>
                            <input type="text" value={formLeadData.lastName} readOnly className="w-full border text-blue-700 p-2 rounded" />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <label>Email</label>
                            <input type="text" value={formLeadData.email} readOnly className="w-full border text-blue-700 p-2 rounded" />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <label>Phone Number</label>
                            <input type="text" value={formLeadData.phoneNumber} readOnly className="w-full border text-blue-700 p-2 rounded" />
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-2xl font-semibold mb-4">Other Details</h4>
                    <div className="flex flex-wrap gap-4">
                        <div className="w-full md:w-[48%]">
                            <label>Industry</label>
                            <input
                                type="text"
                                value={leadindustries[formLeadData.industryId] || "N/A"}
                                readOnly
                                className="w-full border text-blue-700 p-2 rounded"
                            />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <label>Department</label>
                            <input
                                type="text"
                                value={leadDepartments[formLeadData.departmentId] || "N/A"}
                                readOnly
                                className="w-full border text-blue-700 p-2 rounded"
                            />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <label>Status</label>
                            <input
                                type="text"
                                value={leadStatus[formLeadData.statusId] || "N/A"}
                                readOnly
                                className="w-full border text-blue-700 p-2 rounded"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-2xl font-semibold mb-4">Address Details</h4>
                    <div className="flex flex-wrap gap-4">
                        <div className="w-full md:w-[48%]">
                            <label>Address Line 1</label>
                            <input type="text" value={formLeadData.address1} readOnly className="w-full border text-blue-700 p-2 rounded" />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <label>City</label>
                            <input type="text" value={formLeadData.city} readOnly className="w-full border text-blue-700 p-2 rounded" />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <label>Zip</label>
                            <input type="text" value={formLeadData.zip} readOnly className="w-full border text-blue-700 p-2 rounded" />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <label>State</label>
                            <input
                                type="text"
                                value={leadState[formLeadData.stateId] || "N/A"}
                                readOnly
                                className="w-full border text-blue-700 p-2 rounded"
                            />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <label>Country</label>
                            <input
                                type="text"
                                value={leadCountryType[formLeadData.countryId] || "N/A"}
                                readOnly
                                className="w-full border text-blue-700 p-2 rounded"
                            />
                        </div>
                        <div className="w-full md:w-[48%]">
                            <label>Address Type</label>
                            <input
                                type="text"
                                value={leadAddressType[formLeadData.addressTypeId] || "N/A"}
                                readOnly
                                className="w-full border text-blue-700 p-2 rounded"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-lg font-semibold mb-2">Notes</label>
                    <textarea
                        value={formLeadData.notes}
                        readOnly
                        className="w-full border text-blue-700 p-2 rounded"
                        rows={4}
                    />
                </div>
            </form>
        </div>
    )
}

export default ViewLeadData