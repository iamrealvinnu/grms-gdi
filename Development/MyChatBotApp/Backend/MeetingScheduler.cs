using Microsoft.SemanticKernel;
using MyChatBotApp.Backend;
using System.Threading.Tasks;

namespace MyChatBotApp.Backend
{
    // Handles scheduling meetings and saving them to the CRM database.
    public class MeetingScheduler
    {
        private readonly Kernel _kernel; // Semantic Kernel instance for potential AI-driven scheduling (currently unused).
        private readonly CRMData _crmData; // Singleton instance of CRM data loaded from the database.

        // Constructor: Initializes the scheduler with a Semantic Kernel and CRM data.
        public MeetingScheduler(Kernel kernel, CRMData crmData)
        {
            _kernel = kernel ?? throw new ArgumentNullException(nameof(kernel)); // Ensure the kernel is not null.
            _crmData = crmData ?? new CRMData(); // Use provided CRM data, or fall back to an empty object if null.
        }

        // Schedules a new meeting with the given details and saves it to the database.
        public async Task<string?> ScheduleMeetingAsync(string title, string date, string client, CRMData? crmData)
        {
            // Check if CRM data is available to store the meeting.
            if (crmData == null)
                return "No CRM data available to save the meeting.";

            // Validate the date format by attempting to parse it.
            if (!DateTime.TryParse(date, out var parsedDate))
                return "Invalid date format. Please use YYYY-MM-DD.";

            // Create a new meeting object with the provided details.
            var meeting = new Meeting
            {
                Date = parsedDate,
                Title = title,
                Client = client
            };

            // Add the meeting to the CRM data's meeting list.
            crmData.Meetings.Add(meeting);
            if (await CrmDataManager.SaveCrmData(crmData)) // Persist the updated data to crm_data.json.
            {
                return $"Meeting scheduled successfully!\nTitle: {meeting.Title}\nDate: {meeting.Date:yyyy-MM-dd}\nClient: {meeting.Client}";
            }

            return "Failed to save the meeting to crm_data.json. Please try again."; // Return error if save fails.
        }
    }
}