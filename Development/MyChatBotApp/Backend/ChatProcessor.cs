using Microsoft.SemanticKernel;
using Serilog;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MyChatBotApp
{
    public class ChatProcessor
    {
        private readonly Kernel _kernel;
        private readonly CRMData _crmData;
        private readonly Dictionary<string, (string Pattern, string[] Responses)> _commands;
        private static readonly string PredefinedResponsesPath = @"D:\Second_Pro_GRMS\GDI_Nexus_Relationship_Management_System\Development\MyChatBotApp\PredefinedResponses.json";
        private static readonly ConcurrentDictionary<string, Dictionary<string, string>> ConversationStates = new();

        public ChatProcessor(Kernel kernel, CRMData crmData)
        {
            _kernel = kernel ?? throw new ArgumentNullException(nameof(kernel));
            _crmData = crmData ?? new CRMData();
            _commands = LoadPredefinedResponses();
            Log.Information("ChatProcessor initialized with {CustomerCount} customers and {LeadCount} leads.", _crmData.Customers.Count, _crmData.Leads.Count);
        }

        private Dictionary<string, (string Pattern, string[] Responses)> LoadPredefinedResponses()
        {
            try
            {
                if (File.Exists(PredefinedResponsesPath))
                {
                    string json = File.ReadAllText(PredefinedResponsesPath);
                    var data = JsonSerializer.Deserialize<PredefinedResponses>(json);
                    var commands = data.Commands.ToDictionary(
                        c => c.Action,
                        c => (c.Pattern, c.Responses)
                    );
                    Log.Information("Predefined responses loaded from {Path}.", PredefinedResponsesPath);

                    var defaultCommands = InitializeDefaultCommands();
                    foreach (var cmd in defaultCommands)
                    {
                        if (!commands.ContainsKey(cmd.Key))
                            commands[cmd.Key] = cmd.Value;
                    }
                    return commands;
                }
                Log.Warning("Predefined responses file not found at {Path}. Using defaults.", PredefinedResponsesPath);
                return InitializeDefaultCommands();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error loading predefined responses from {Path}. Using defaults.", PredefinedResponsesPath);
                return InitializeDefaultCommands();
            }
        }

        private Dictionary<string, (string Pattern, string[] Responses)> InitializeDefaultCommands()
        {
            return new Dictionary<string, (string Pattern, string[] Responses)>
            {
                ["greet"] = ("^(hi|hello|hey|good morning|good afternoon|good evening)$", new[] { "Hello! How can I assist you today? Try 'find John Doe' or 'lead add'." }),
                ["help"] = ("^help$", new[] {
                    " Welcome to CRM Assistant Help! \n" +
                    "Here’s what I can do for you:\n" +
                    "🔍 Lookup:\n  - 'find <name>' (e.g., 'find John Doe')\n  - 'info on <name>' (e.g., 'info on Bob White')\n  - 'contact details for <name>' (e.g., 'contact details for Jane Smith')\n" +
                    "📅 Scheduling:\n  - 'schedule <title>, <date>, <client>' (e.g., 'schedule team sync, 2025-04-02, Bob White')\n" +
                    "👥 Leads:\n  - 'lead add' (starts adding a new lead)\n  - 'predict lead <name>' (e.g., 'predict lead John Doe')\n" +
                    "💡 Tip: Just type a command to get started!"
                }),
                ["find"] = ("^find (.+)$", new[] { "Looking up {0}..." }),
                ["info"] = ("^info (?:on|about) (.+)$", new[] { "Here’s info on {0}:" }),
                ["contact"] = ("^contact (?:details|info) (?:for|of) (.+)$", new[] { "Contact details for {0}:" }),
                ["lead_add"] = ("^lead[, ]*add(?:[, ]*new)?$", new[] { "Let’s add a lead. What’s their name?" }),
                ["schedule"] = ("^schedule[, ]+(.+?), (.+?), (.+)$", new[] { "Scheduling {0} on {1} with {2}..." }),
                ["predict"] = ("^predict lead (.+)$", new[] { "Predicting conversion for {0}..." })
            };
        }

        public async Task<string> ProcessMessage(ChatRequest request)
        {
            string message = request.Message.Trim();
            string lowerMessage = message.ToLower();

            // Log current state for debugging
            if (ConversationStates.TryGetValue(request.UserId, out var currentState))
            {
                Log.Information("Current state for User {UserId}: {State}", request.UserId, JsonSerializer.Serialize(currentState));
            }
            else
            {
                Log.Information("No state found for User {UserId}", request.UserId);
            }

            // Check conversation state first
            if (ConversationStates.ContainsKey(request.UserId))
            {
                Log.Information("Continuing multi-step lead addition for User {UserId}", request.UserId);
                return HandleLeadAddition(request.UserId, message);
            }

            foreach (var kvp in _commands)
            {
                string action = kvp.Key;
                (string pattern, string[] responses) = kvp.Value;

                var match = Regex.Match(lowerMessage, pattern);
                if (match.Success)
                {
                    Log.Information("Matched predefined command '{Action}' for message: {Message}", action, message);
                    string response = responses[new Random().Next(responses.Length)];
                    if (match.Groups.Count > 1)
                    {
                        string[] parameters = match.Groups.Cast<Group>().Skip(1).Select(g => g.Value).ToArray();
                        response = action switch
                        {
                            "find" => HandleFind(parameters[0]),
                            "info" => HandleFind(parameters[0], "Here’s info on {0}: "),
                            "contact" => HandleFind(parameters[0], "Contact details for {0}: "),
                            "schedule" => HandleSchedule(parameters[0], parameters[1], parameters[2]),
                            "predict" => HandlePredict(parameters[0]),
                            _ => string.Format(response, parameters)
                        };
                    }
                    else if (action == "lead_add")
                    {
                        response = HandleLeadAddition(request.UserId, message); // Start lead addition
                    }
                    else
                    {
                        response = FormatResponse(response);
                    }
                    Log.Information("Returning response: {Response}", response);
                    return response;
                }
            }

            Log.Information("No predefined command matched. Falling back to AI for message: {Message}", message);
            return await HandleAIEdgeCase(message);
        }

        private string FormatResponse(string response)
        {
            string timeOfDay = DateTime.Now.Hour < 12 ? " morning" : DateTime.Now.Hour < 18 ? " afternoon" : " evening";
            return response.Replace("{timeOfDay}", timeOfDay).Replace("{mentions}", "");
        }

        private async Task<string> HandleAIEdgeCase(string message)
        {
            Log.Information("AI is processing the request: {Message}", message);
            var greetingPattern = @"^(good morning|good afternoon|good evening|hi|hello|hey)$";
            if (Regex.IsMatch(message.ToLower(), greetingPattern))
            {
                return FormatResponse(_commands["greet"].Responses[0]);
            }

            var namePattern = @"\b(?!whos|is|the|a|an|of|contact|info|details|schedule|team|sync|me|find|on|for|about\b)([a-z]+(?:\s[a-z]+)*)\b";
            var matches = Regex.Matches(message, namePattern, RegexOptions.IgnoreCase);
            foreach (Match match in matches)
            {
                string potentialName = match.Value;
                potentialName = string.Join(" ", potentialName.Split().Select(word => char.ToUpper(word[0]) + word.Substring(1).ToLower()));
                var customer = _crmData.Customers.FirstOrDefault(c => c.Name.Equals(potentialName, StringComparison.OrdinalIgnoreCase));
                if (customer != null)
                    return $"Here’s info on {customer.Name}: Email: {customer.Email}, Phone: {customer.Phone}";
                var lead = _crmData.Leads.FirstOrDefault(l => l.Name.Equals(potentialName, StringComparison.OrdinalIgnoreCase));
                if (lead != null)
                    return $"Here’s info on {lead.Name}: Contact: {lead.Contact}, Status: {lead.Status}";
            }

            if (message.ToLower().Contains("schedule"))
            {
                return "Did you mean to schedule something? Try 'schedule <title>, <date>, <client>' like 'schedule team sync, 2025-04-02, Bob White'.";
            }

            string customerNames = string.Join(", ", _crmData.Customers.Select(c => c.Name));
            string leadNames = string.Join(", ", _crmData.Leads.Select(l => l.Name));
            string context = $"Known names: {customerNames}, {leadNames}.";
            var prompt = $"User said: {message}. Context: {context}. Respond naturally without mentioning database or CRM. Suggest commands if unsure.";

            try
            {
                var result = await _kernel.InvokePromptAsync(prompt);
                return result?.ToString() ?? "Sorry, I couldn’t get that. Try 'help' or rephrase your request.";
            }
            catch (Exception ex)
            {
                Log.Error(ex, "AI failed to process: {Message}", message);
                return "Sorry, I couldn’t get that. Try 'help' or rephrase your request.";
            }
        }

        private string HandleFind(string input, string responseFormat = "Found {0}: ")
        {
            var words = input.Split().Where(w => w.ToLower() != "me" && w.ToLower() != "please");
            string name = string.Join(" ", words);

            var customer = _crmData.Customers.FirstOrDefault(c => c.Name.ToLower().Contains(name.ToLower()));
            if (customer != null)
                return $"{string.Format(responseFormat, customer.Name)} Email: {customer.Email}, Phone: {customer.Phone}";

            var lead = _crmData.Leads.FirstOrDefault(l => l.Name.ToLower().Contains(name.ToLower()));
            if (lead != null)
                return $"{string.Format(responseFormat, lead.Name)} Contact: {lead.Contact}, Status: {lead.Status}";

            return $"I couldn’t find {name}. Want me to look up something else?";
        }

        private string HandleSchedule(string title, string date, string client)
        {
            if (!DateTime.TryParse(date, out var parsedDate))
                return "Invalid date format. Use YYYY-MM-DD.";

            var meeting = new Meeting { Date = parsedDate, Title = title, Client = client };
            _crmData.Meetings.Add(meeting);
            return $"Scheduled: {title} on {parsedDate:yyyy-MM-dd} with {client}.";
        }

        private string HandlePredict(string name)
        {
            var lead = _crmData.Leads.FirstOrDefault(l => l.Name.ToLower().Contains(name));
            if (lead == null) return $"No lead named {name} found.";

            double probability = 10 + (lead.MessagesSent * 5) + (lead.CallsMade * 10) + (lead.MeetingsHeld * 15);
            probability = Math.Min(probability, 100);
            string recommendation = probability >= 70 ? "High chance" : probability >= 40 ? "Moderate chance" : "Low chance";
            return $"Prediction for {lead.Name}: {probability:F1}% chance of conversion ({recommendation}).";
        }

        private string HandleLeadAddition(string userId, string message)
        {
            var state = ConversationStates.GetOrAdd(userId, _ => new Dictionary<string, string>());
            string lowerMessage = message.ToLower();

            if (!state.ContainsKey("step") || lowerMessage.Contains("lead add"))
            {
                state.Clear();
                state["step"] = "name";
                Log.Information("Starting lead addition for User {UserId}", userId);
                return "Let’s add a lead. What’s their name?";
            }

            switch (state["step"])
            {
                case "name":
                    var name = message.Trim();
                    var existingCustomer = _crmData.Customers.FirstOrDefault(c => c.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
                    var existingLead = _crmData.Leads.FirstOrDefault(l => l.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
                    if (existingCustomer != null || existingLead != null)
                    {
                        state.Clear();
                        return $"Sorry, '{name}' is already taken. Try another name or say 'lead add' to start over.";
                    }
                    state["name"] = name;
                    state["step"] = "phone";
                    Log.Information("Name set to {Name} for User {UserId}", name, userId);
                    return "Great. What’s their phone number?";
                case "phone":
                    state["phone"] = message.Trim();
                    state["step"] = "email";
                    Log.Information("Phone set to {Phone} for User {UserId}", message.Trim(), userId);
                    return "Cool. What’s their email?";
                case "email":
                    state["email"] = message.Trim();
                    state["step"] = "status";
                    Log.Information("Email set to {Email} for User {UserId}", message.Trim(), userId);
                    return "Got it. What’s their status (e.g., New, Contacted)?";
                case "status":
                    var lead = new Lead
                    {
                        Id = _crmData.Leads.Count + 1,
                        Name = state["name"],
                        Contact = $"{state["phone"]}, {state["email"]}",
                        Status = message.Trim(),
                        Score = 10,
                        LastInteraction = DateTime.Now
                    };
                    _crmData.Leads.Add(lead);
                    Log.Information("Lead added for User {UserId}: {Lead}", userId, JsonSerializer.Serialize(lead));
                    ConversationStates.TryRemove(userId, out _);
                    return $"Lead added: {lead.Name}, Phone: {state["phone"]}, Email: {state["email"]}, Status: {lead.Status}";
                default:
                    ConversationStates.TryRemove(userId, out _);
                    Log.Warning("Invalid state for User {UserId}, resetting", userId);
                    return "Something went wrong. Say 'lead add' to start over.";
            }
        }
    }

    public class PredefinedResponses
    {
        public List<Command> Commands { get; set; } = new();
    }

    public class Command
    {
        public string Action { get; set; } = "";
        public string Pattern { get; set; } = "";
        public string[] Responses { get; set; } = Array.Empty<string>();
    }
}