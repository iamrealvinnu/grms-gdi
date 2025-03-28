using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MyChatBotApp.Backend
{
    // Manages predefined commands and responses loaded from a JSON file.
    public class PredefinedResponseManager
    {
        private const string PredefinedResponsesPath = @"D:\Second_Pro_GRMS\GDI_Nexus_Relationship_Management_System\Development\MyChatBotApp\Backend\PredefinedResponseManager.cs"; // Path to the JSON file.
        private readonly List<PredefinedCommand> _commands; // List of loaded commands.

        // Represents a predefined command with its pattern and responses.
        private class PredefinedCommand
        {
            public string Action { get; set; } = string.Empty; // The action identifier (e.g., "greet").
            public string Pattern { get; set; } = string.Empty; // Regex pattern to match user input.
            public List<string> Responses { get; set; } = new List<string>(); // List of possible responses.
        }

        // Constructor: Loads the predefined responses from the JSON file.
        public PredefinedResponseManager()
        {
            _commands = LoadPredefinedResponses();
        }

        // Loads the predefined responses from the JSON file.
        private List<PredefinedCommand> LoadPredefinedResponses()
        {
            try
            {
                // Check if the JSON file exists.
                if (File.Exists(PredefinedResponsesPath))
                {
                    string json = File.ReadAllText(PredefinedResponsesPath); // Read the entire file content.
                    var data = JsonSerializer.Deserialize<Dictionary<string, List<PredefinedCommand>>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    Console.WriteLine("Successfully loaded predefined responses from PredefinedResponses.json.");
                    return data?["commands"] ?? new List<PredefinedCommand>(); // Return the list of commands.
                }
                Console.WriteLine("Predefined responses file not found. Starting with empty commands.");
                return new List<PredefinedCommand>(); // Return empty list if file doesn’t exist.
            }
            catch (Exception ex)
            {
                // Log any errors and return an empty list as a fallback.
                Console.WriteLine($"Error loading predefined responses: {ex.Message} - Starting with empty commands.");
                return new List<PredefinedCommand>(); // Return empty list on error.
            }
        }

        // Matches the user message against predefined patterns and returns a response.
        public async Task<(string Action, string Response)?> GetResponseAsync(string message, string userId, string mentionMessage)
        {
            await Task.CompletedTask; // Ensure async signature for future enhancements.

            // Normalize the message for consistent matching.
            message = message.ToLower().Trim();

            // Iterate through each command to find a match.
            foreach (var command in _commands)
            {
                if (Regex.IsMatch(message, command.Pattern))
                {
                    // Select a random response from the list of variations.
                    var random = new Random();
                    string response = command.Responses[random.Next(command.Responses.Count)];

                    // Replace placeholders in the response (e.g., time of day, mentions).
                    var currentDate = DateTime.Now;
                    string timeOfDay = currentDate.Hour >= 12 && currentDate.Hour < 17 ? " Good afternoon" : currentDate.Hour >= 17 ? " Good evening" : " Good morning";
                    response = response.Replace("{timeOfDay}", timeOfDay).Replace("{mentions}", mentionMessage);

                    return (command.Action, response); // Return the action and formatted response.
                }
            }

            return null; // Return null if no match is found.
        }
    }
}