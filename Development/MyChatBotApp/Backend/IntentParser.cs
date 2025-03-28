using Microsoft.SemanticKernel;
using System.Text.RegularExpressions;
using MyChatBotApp.Backend;
using MyChatBotApp.MyChatBotApp.Backend;

namespace MyChatBotApp.Backend
{
    // Static class for parsing user input into intents using rule-based Natural Language Understanding (NLU).
    public static class IntentParser
    {
        // Parses the user's message into a UserIntent object based on predefined regex patterns.
        public static UserIntent ParseIntentWithNLU(string message, string userId, Kernel kernel)
        {
            // Log the input message for debugging purposes.
            Console.WriteLine($"Parsing intent for message: '{message}'");

            // Normalize the message by converting to lowercase and trimming whitespace for consistent matching.
            message = message.ToLower().Trim();

            // Define an array of intent patterns with associated actions to match user input.
            var patterns = new (string Action, string Pattern)[]
            {
                ("find", @"^find\s*(.+?)(?:\s*in\s*.+)?$"),              // Matches "find <name>" or "find <name> in <context>"
                ("schedule", @"^schedule\s*,+\s*(\S+.*)$"),              // Matches "schedule, <details>"
                ("admin", @"^admin\s*,+\s*(\S+.*)$"),                    // Matches "admin, <task>"
                ("advanced", @"^advanced\s*,+\s*(\S+.*)$"),              // Matches "advanced, <feature>"
                ("lead", @"^lead\s*,+\s*(\S+.*)$"),                      // Matches "lead, <action>" (e.g., "lead, add new")
                ("insights", @"^insights$"),                             // Matches "insights"
                ("report", @"^report\s*(.+)$"),                          // Matches "report <period>"
                ("opportunity", @"^opportunity\s*,+\s*(\S+.*)$"),        // Matches "opportunity, <action>"
                ("yes", @"^(yes|sure|ok|k)$"),                          // Matches affirmative responses
                ("predict_lead", @"^predict lead\s*(.+)$")               // Matches "predict lead <name>" for lead prediction
            };

            // Iterate through each pattern to find a match in the user message.
            foreach (var (action, pattern) in patterns)
            {
                var match = Regex.Match(message, pattern); // Attempt to match the message against the pattern.
                if (match.Success)
                {
                    // Extract the name or details from the first capture group; default to empty if not present.
                    string extractedName = match.Groups.Count > 1 ? match.Groups[1].Value.Trim() : "";
                    Console.WriteLine($"Matched intent: '{pattern}', Extracted: '{extractedName}'");

                    // Log all regex capture groups for debugging purposes.
                    Console.WriteLine("Debug: Regex Groups:");
                    for (int i = 0; i < match.Groups.Count; i++)
                    {
                        Console.WriteLine($" Group {i}: '{match.Groups[i].Value}'");
                    }

                    // Create and return a UserIntent object with the user ID, matched action, and extracted name.
                    return new UserIntent(userId, action, extractedName);
                }
            }

            // If no patterns match, fall back to a default intent with the original message.
            Console.WriteLine("No intent matched, falling back to default.");
            return new UserIntent(userId, "default", message);
        }
    }
}