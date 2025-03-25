using System;

namespace MyChatBotApp.Utilities
{
    // Utility class for extracting customer names from user input messages.
    public static class CustomerNameExtractor
    {
        // Extracts a customer name by removing specific keywords like "find" from the input.
        public static string ExtractCustomerName(string input)
        {
            // Check if the input is empty or consists only of whitespace.
            if (string.IsNullOrWhiteSpace(input))
            {
                return string.Empty; // Return an empty string for invalid input.
            }

            try
            {
                // Remove the keyword "find" (case-insensitive) and trim whitespace to isolate the customer name.
                var name = input.ToLower().Replace("find", "").Trim();

                // Return the extracted name, or an empty string if the result is blank.
                return string.IsNullOrWhiteSpace(name) ? string.Empty : name;
            }
            catch (Exception ex)
            {
                // Log any errors during extraction and return an empty string as a fallback.
                Console.WriteLine($"❌ Error extracting customer name: {ex.Message}");
                return string.Empty; // Return empty string if an error occurs.
            }
        }
    }
}