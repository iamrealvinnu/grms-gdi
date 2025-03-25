using Microsoft.SemanticKernel;
using MyChatBotApp.Backend;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyChatBotApp.Backend
{
    // Handles admin-related tasks such as listing pending tasks from CRM data.
    public class AdminTasksHandler
    {
        private readonly Kernel? _kernel; // Optional Semantic Kernel for potential AI enhancements (currently unused).

        // Constructor: Initializes the handler with an optional Semantic Kernel instance.
        public AdminTasksHandler(Kernel? kernel)
        {
            _kernel = kernel; // Store the kernel for future AI-driven admin tasks if needed.
        }

        // Processes admin commands by checking the user message and retrieving data from CRM.
        // Returns a formatted string with the result or an error message.
        public async Task<string?> HandleAdminTasksAsync(string userMessage, CRMData? crmData)
        {
            await Task.CompletedTask; // Ensures the method adheres to async signature (no actual async operations yet).

            // Check if the user wants to list pending tasks.
            if (userMessage.ToLower().Contains("list pending tasks"))
            {
                // Filter pending tasks from CRM data (loaded from crm_data.json).
                var pendingTasks = crmData?.Tasks.Where(t => t.Status == "Pending").ToList() ?? new List<TaskItem>();

                // If there are pending tasks, format them into a readable list.
                if (pendingTasks.Any())
                {
                    var sb = new StringBuilder(); // Use StringBuilder to efficiently build the response string.
                    sb.Append($"Pending tasks ({pendingTasks.Count} total):\n");

                    // Display up to 3 tasks for brevity, with details like title, assignee, and due date.
                    foreach (var task in pendingTasks.Take(3))
                        sb.Append($"- {task.Title} (Assigned to: {task.AssignedTo}, Due: {task.DueDate:yyyy-MM-dd})\n");

                    // Indicate if there are more tasks beyond the displayed limit.
                    if (pendingTasks.Count > 3) sb.Append($"...and {pendingTasks.Count - 3} more!\n");

                    return sb.ToString(); // Return the formatted list of pending tasks.
                }

                return "No pending tasks found in crm_data.json."; // Return a message if no pending tasks exist.
            }

            // Default response for unrecognized admin commands.
            return "Admin task not recognized. Try 'admin, list pending tasks'.";
        }
    }
}