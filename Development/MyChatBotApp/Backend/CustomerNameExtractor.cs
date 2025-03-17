using System;
using System.Text.Json;

namespace MyChatBotApp.Utilities
{
    public static class CustomerNameExtractor
    {
        public static string ExtractCustomerName(string jsonResponse)
        {
            if (string.IsNullOrEmpty(jsonResponse))
            {
                return string.Empty;
            }

            try
            {
                var jsonDoc = JsonDocument.Parse(jsonResponse);
                if (jsonDoc.RootElement.TryGetProperty("customerName", out var customerNameElement))
                {
                    return customerNameElement.GetString() ?? string.Empty;
                }
                return string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error extracting customer name: {ex.Message}");
                return string.Empty;
            }
        }
    }
}
