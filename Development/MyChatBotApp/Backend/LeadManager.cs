// LeadManager.cs
// Manages lead-related operations, such as adding, updating, and retrieving leads.

using Serilog;
using System;
using System.Linq;

namespace MyChatBotApp
{
    public class LeadManager
    {
        private readonly CRMData _crmData; // Reference to the shared CRM data

        // Constructor: Initializes the LeadManager with CRM data
        public LeadManager(CRMData crmData)
        {
            _crmData = crmData ?? throw new ArgumentNullException(nameof(crmData));
            Log.Information("LeadManager initialized.");
        }

        // Adds a new lead to the CRM data
        public string AddLead(string name, string contact, string status)
        {
            Log.Information("Adding lead: Name={Name}, Contact={Contact}, Status={Status}", name, contact, status);
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(contact) || string.IsNullOrWhiteSpace(status))
            {
                Log.Warning("Invalid lead data: Name, contact, and status are required.");
                return "Error: Name, contact, and status are required.";
            }

            var lead = new Lead
            {
                Id = _crmData.Leads.Count + 1,
                Name = name,
                Contact = contact,
                Status = status,
                Score = 10,
                LastInteraction = DateTime.Now
            };
            _crmData.Leads.Add(lead);
            Log.Information("Lead added successfully: {LeadId}", lead.Id);
            return $"Lead added: {lead.Name}, {lead.Contact}, {lead.Status}";
        }

        // Updates the status of an existing lead
        public string UpdateLeadStatus(int leadId, string newStatus)
        {
            Log.Information("Updating lead status: LeadId={LeadId}, NewStatus={NewStatus}", leadId, newStatus);
            if (string.IsNullOrWhiteSpace(newStatus))
            {
                Log.Warning("Invalid new status: New status cannot be empty.");
                return "Error: New status cannot be empty.";
            }

            var lead = _crmData.Leads.FirstOrDefault(l => l.Id == leadId);
            if (lead == null)
            {
                Log.Warning("Lead not found: LeadId={LeadId}", leadId);
                return $"Error: Lead with ID {leadId} not found.";
            }

            lead.Status = newStatus;
            lead.LastInteraction = DateTime.Now;
            Log.Information("Lead status updated: LeadId={LeadId}, NewStatus={NewStatus}", leadId, newStatus);
            return $"Updated lead {lead.Name} status to {newStatus}.";
        }

        // Retrieves details of a lead by ID
        public string GetLeadDetails(int leadId)
        {
            Log.Information("Retrieving lead details: LeadId={LeadId}", leadId);
            var lead = _crmData.Leads.FirstOrDefault(l => l.Id == leadId);
            if (lead == null)
            {
                Log.Warning("Lead not found: LeadId={LeadId}", leadId);
                return $"Lead with ID {leadId} not found.";
            }

            Log.Information("Lead details retrieved: LeadId={LeadId}", leadId);
            return $"Lead: {lead.Name}, Contact: {lead.Contact}, Status: {lead.Status}, Score: {lead.Score}";
        }
    }
}