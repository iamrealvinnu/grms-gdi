// CrmDataManager.cs
// Manages loading and storing CRM data, currently from a JSON file.

using Serilog;
using System;
using System.IO;
using System.Text.Json;

namespace MyChatBotApp
{
    public static class CrmDataManager
    {
        private const string CrmDataPath = @"D:\Second_Pro_GRMS\GDI_Nexus_Relationship_Management_System\Development\MyChatBotApp\crm_data.json";

        // Loads CRM data from a JSON file at application startup
        public static CRMData LoadCrmData()
        {
            try
            {
                if (File.Exists(CrmDataPath))
                {
                    string json = File.ReadAllText(CrmDataPath);
                    var data = JsonSerializer.Deserialize<CRMData>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    Log.Information("CRM data loaded successfully from {Path}.", CrmDataPath);
                    return data ?? new CRMData();
                }
                Log.Warning("CRM data file not found at {Path}. Starting with empty data.", CrmDataPath);
                return new CRMData();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error loading CRM data from {Path}.", CrmDataPath);
                return new CRMData();
            }
        }
    }

    // Core CRM data structure holding leads, customers, meetings, feedback, and chat messages
    public class CRMData
    {
        public List<Lead> Leads { get; set; } = new();
        public List<Customer> Customers { get; set; } = new();
        public List<Meeting> Meetings { get; set; } = new();
        public List<Feedback> Feedbacks { get; set; } = new();
        public List<ChatMessage> ChatMessages { get; set; } = new(); // Added for storing chat messages
    }

    // Represents a lead in the CRM system
    public class Lead
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Contact { get; set; } = "";
        public string Status { get; set; } = "";
        public int Score { get; set; }
        public int MessagesSent { get; set; } = 0;
        public int CallsMade { get; set; } = 0;
        public int MeetingsHeld { get; set; } = 0;
        public DateTime LastInteraction { get; set; }
    }

    // Represents a customer in the CRM system
    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
    }

    // Represents a meeting scheduled in the CRM
    public class Meeting
    {
        public DateTime Date { get; set; }
        public string Title { get; set; } = "";
        public string Client { get; set; } = "";
    }

    // Represents user feedback
    public class Feedback
    {
        public int Id { get; set; }
        public string UserId { get; set; } = "";
        public string Message { get; set; } = "";
        public string UserFeedback { get; set; } = "";
        public DateTime SubmittedAt { get; set; }
    }

    // Represents a chat message
    public class ChatMessage
    {
        public int Id { get; set; }
        public string UserId { get; set; } = "";
        public string Message { get; set; } = "";
        public string Response { get; set; } = "";
        public DateTime Timestamp { get; set; }
    }
}