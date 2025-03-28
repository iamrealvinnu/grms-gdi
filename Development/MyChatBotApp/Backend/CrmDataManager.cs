using MyChatBotApp.Backend;
using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace MyChatBotApp.Backend
{
    // Provides static methods to manage CRM data, including loading and saving to a JSON file.
    public static class CrmDataManager
    {
        // Defines the file path for storing CRM data (hardcoded for now).
        private const string CrmDataPath = @"D:\Second_Pro_GRMS\GDI_Nexus_Relationship_Management_System\Development\MyChatBotApp\crm_data.json";

        // Loads CRM data from the JSON file, returning an empty object if the file is missing or invalid.
        public static CRMData LoadCrmData()
        {
            try
            {
                // Check if the CRM data file exists.
                if (File.Exists(CrmDataPath))
                {
                    string crmJson = File.ReadAllText(CrmDataPath); // Read the entire file content.
                    var data = JsonSerializer.Deserialize<CRMData>(crmJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new CRMData();
                    // Deserialize JSON into CRMData, using case-insensitive property names; default to empty if null.
                    Console.WriteLine("Successfully loaded CRM data from crm_data.json.");
                    return data; // Return the loaded CRM data.
                }
                Console.WriteLine("CRM data file not found. Starting with empty data.");
                return new CRMData(); // Return an empty CRM data object if the file doesn’t exist.
            }
            catch (Exception ex)
            {
                // Log any errors and fall back to an empty CRM data object.
                Console.WriteLine($"Error loading CRM data: {ex.Message} - Starting with empty data.");
                return new CRMData(); // Return empty data as a fallback.
            }
        }

        // Asynchronously saves CRM data to the JSON file, returning success or failure.
        public static async Task<bool> SaveCrmData(CRMData data)
        {
            try
            {
                string jsonData = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true }); // Convert data to formatted JSON.
                await File.WriteAllTextAsync(CrmDataPath, jsonData); // Write the JSON data to the file.
                Console.WriteLine("Successfully saved CRM data to crm_data.json.");
                return true; // Return true to indicate success.
            }
            catch (UnauthorizedAccessException)
            {
                // Handle cases where the application lacks permission to write to the file.
                Console.WriteLine("Permission denied while saving CRM data. Check file access rights.");
                return false; // Return false due to permission issues.
            }
            catch (IOException ex)
            {
                // Handle IO-related errors during file writing.
                Console.WriteLine($"IO error saving CRM data: {ex.Message} - Data might not be saved.");
                return false; // Return false due to IO problems.
            }
            catch (Exception ex)
            {
                // Handle any other unexpected errors during file writing.
                Console.WriteLine($"Unexpected error saving CRM data: {ex.Message} - Data might not be saved.");
                return false; // Return false due to unexpected errors.
            }
        }
    }

    // Represents the main data structure for CRM, containing various entity lists.
    public class CRMData
    {
        public List<Lead> Leads { get; set; } = new(); // List to store lead records.
        public List<Customer> Customers { get; set; } = new(); // List to store customer records.
        public List<Meeting> Meetings { get; set; } = new(); // List to store meeting records.
        public List<SalesReport> SalesReports { get; set; } = new(); // List to store sales report records.
        public List<TaskItem> Tasks { get; set; } = new(); // List to store task records.
        public List<Campaign> Campaigns { get; set; } = new(); // List to store campaign records.
        public List<Opportunity> Opportunities { get; set; } = new(); // List to store opportunity records.
    }

    // Represents a customer entity with basic contact information.
    public class Customer
    {
        public int Id { get; set; } // Unique identifier for the customer.
        public string Name { get; set; } = ""; // Customer's full name.
        public string Email { get; set; } = ""; // Customer's email address.
        public string Phone { get; set; } = ""; // Customer's phone number.
    }

    // Represents a meeting entity with scheduling details.
    public class Meeting
    {
        public DateTime Date { get; set; } // Date and time of the meeting.
        public string Title { get; set; } = ""; // Title or purpose of the meeting.
        public string Client { get; set; } = ""; // Client associated with the meeting.
    }

    // Represents a sales report entity with monthly data.
    public class SalesReport
    {
        public DateTime Month { get; set; } // Month for which the report is generated.
        public decimal Revenue { get; set; } // Revenue amount for the report period.
    }

    // Represents a task entity with assignment and due date details.
    public class TaskItem
    {
        public int Id { get; set; } // Unique identifier for the task.
        public string Title { get; set; } = ""; // Title or description of the task.
        public string AssignedTo { get; set; } = ""; // User assigned to the task.
        public DateTime DueDate { get; set; } // Deadline for the task.
        public string Status { get; set; } = ""; // Current status of the task (e.g., Pending).
    }

    // Represents a campaign entity with scheduling and budget details.
    public class Campaign
    {
        public int Id { get; set; } // Unique identifier for the campaign.
        public string Name { get; set; } = ""; // Name of the campaign.
        public DateTime StartDate { get; set; } // Start date of the campaign.
        public DateTime EndDate { get; set; } // End date of the campaign.
        public decimal Budget { get; set; } // Budget allocated for the campaign.
    }

    // Represents an opportunity entity with financial and stage details.
    public class Opportunity
    {
        public int Id { get; set; } // Unique identifier for the opportunity.
        public string Name { get; set; } = ""; // Name of the opportunity.
        public int CustomerId { get; set; } // ID of the associated customer.
        public decimal Value { get; set; } // Monetary value of the opportunity.
        public string Stage { get; set; } = ""; // Current stage of the opportunity (e.g., Prospecting).
    }
}