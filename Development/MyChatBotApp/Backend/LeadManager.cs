using Microsoft.AspNetCore.Http;
using Microsoft.SemanticKernel;
using System;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyChatBotApp.Backend; // Added to reference UserIntent

namespace MyChatBotApp.Backend
{
    /// <summary>
    /// Manages lead-related operations and intent handling for the chatbot application.
    /// </summary>
    public class LeadManager
    {
        /// <summary>
        /// Processes a chat request by parsing the intent and executing the corresponding action.
        /// </summary>
        /// <param name="request">The chat request containing the user's message.</param>
        /// <param name="context">The HTTP context for the request.</param>
        /// <param name="kernel">The Semantic Kernel instance for advanced processing.</param>
        /// <param name="crmHandler">Handler for CRM operations.</param>
        /// <param name="meetingScheduler">Handler for scheduling meetings.</param>
        /// <param name="adminHandler">Handler for admin tasks.</param>
        /// <param name="advancedHandler">Handler for advanced features.</param>
        /// <param name="leadHandler">Handler for lead management.</param>
        /// <param name="salesReportHandler">Handler for sales reports.</param>
        /// <param name="conversationManager">Manager for conversation state.</param>
        /// <returns>A task returning the formatted response object.</returns>
        public async Task<object> ProcessChatRequest(ChatRequest request, HttpContext context, Kernel kernel, CRMHandler crmHandler,
            MeetingScheduler meetingScheduler, AdminTasksHandler adminHandler, AdvancedFeaturesHandler advancedHandler,
            LeadManagementHandler leadHandler, SalesReportHandler salesReportHandler, ConversationManager conversationManager)
        {
            // Determine if the input is voice-based, defaulting to false if not specified.
            bool isVoiceInput = request.IsVoice ?? false;
            if (isVoiceInput && string.IsNullOrWhiteSpace(request.Message))
            {
                // Return an error response if voice input is empty.
                return FormatResponse(new ChatResponse("Sorry, I couldn’t catch that. Please try again or switch to text input."), isVoiceInput);
            }

            // Get or create the user's conversation state.
            var conversationState = conversationManager.GetConversationState(request.UserId);
            if (!string.IsNullOrWhiteSpace(conversationState.Step))
            {
                // Handle ongoing multi-step conversations if a step is active.
                var response = await conversationManager.HandleConversationState(request.UserId, conversationState, request, isVoiceInput);
                if (response != null)
                {
                    context.Items["LastResponse"] = response; // Store the response in the context.
                    return FormatResponse(response, isVoiceInput); // Return the formatted response.
                }
            }

            // Parse the user's intent from the message.
            var intent = IntentParser.ParseIntentWithNLU(request.Message, request.UserId, kernel);
            Console.WriteLine($"Initial intent parsed - Action: '{intent.Action}', Name: '{intent.Name}'");

            if (intent.Action != null)
            {
                // Process the intent if an action is recognized.
                var response = await HandleIntent(intent, context, kernel, crmHandler, meetingScheduler, adminHandler,
                    advancedHandler, leadHandler, salesReportHandler, conversationManager);
                if (response != null)
                {
                    context.Items["LastResponse"] = response; // Store the response in the context.
                    return FormatResponse(response, isVoiceInput); // Return the formatted response.
                }
            }

            // Retry parsing and handling up to 2 times if no response is generated.
            int retryCount = 0;
            ChatResponse? chatResponse = null;
            while (chatResponse == null && retryCount < 2)
            {
                Console.WriteLine($"Retry attempt {retryCount + 1} for unrecognized input: '{request.Message}'");
                intent = IntentParser.ParseIntentWithNLU(request.Message, request.UserId, kernel); // Reparse the intent.
                Console.WriteLine($"Retry intent parsed - Action: '{intent.Action}', Name: '{intent.Name}'");
                chatResponse = await HandleIntent(intent, context, kernel, crmHandler, meetingScheduler, adminHandler,
                    advancedHandler, leadHandler, salesReportHandler, conversationManager);
                retryCount++;
            }

            if (chatResponse == null)
            {
                // Return a default response if all retries fail.
                chatResponse = new ChatResponse("Hmm, I didn’t understand that. Try 'help' for a list of commands!");
                return FormatResponse(chatResponse, isVoiceInput);
            }

            context.Items["LastResponse"] = chatResponse; // Store the final response.
            return FormatResponse(chatResponse, isVoiceInput); // Return the formatted response.
        }

        /// <summary>
        /// Handles conversation steps based on the current state.
        /// </summary>
        /// <param name="request">The chat request.</param>
        /// <param name="context">The HTTP context.</param>
        /// <param name="kernel">The Semantic Kernel instance.</param>
        /// <param name="crmHandler">CRM handler.</param>
        /// <param name="meetingScheduler">Meeting scheduler.</param>
        /// <param name="adminHandler">Admin tasks handler.</param>
        /// <param name="advancedHandler">Advanced features handler.</param>
        /// <param name="leadHandler">Lead management handler.</param>
        /// <param name="salesReportHandler">Sales report handler.</param>
        /// <param name="conversationManager">Conversation manager.</param>
        /// <param name="conversationState">Current conversation state.</param>
        /// <returns>A ChatResponse or null if no action is taken.</returns>
        private ChatResponse? HandleConversationStep(ChatRequest request, HttpContext context, Kernel kernel, CRMHandler crmHandler,
            MeetingScheduler meetingScheduler, AdminTasksHandler adminHandler, AdvancedFeaturesHandler advancedHandler,
            LeadManagementHandler leadHandler, SalesReportHandler salesReportHandler, ConversationManager conversationManager,
            ConversationState conversationState)
        {
            // Retrieve CRM data from the context.
            var crmData = context.Items["crmData"] as CRMData;
            switch (conversationState.Step)
            {
                case "ConfirmName":
                    // Check if the user confirms a customer selection.
                    if (new[] { "yes", "sure", "ok", "k" }.Contains(request.Message.ToLower()))
                    {
                        // Get the selected index and customer list from the conversation state.
                        int selectedIndex = conversationState.Data.TryGetValue("SelectedIndex", out var indexObj) && indexObj is int index ? index : 0;
                        var matches = conversationState.Data["Matches"] as List<Customer>;
                        var selectedCustomer = matches?[selectedIndex];
                        conversationState.Step = null; // Reset the step.
                        conversationState.Data.Clear(); // Clear the conversation data.
                        return selectedCustomer != null
                            ? new ChatResponse($"Here are the details for {selectedCustomer.Name}: Email: {selectedCustomer.Email}, Phone: {selectedCustomer.Phone}")
                            : new ChatResponse("No valid customer selected."); // Return customer details or an error.
                    }
                    conversationState.Step = null; // Reset the step if not confirmed.
                    conversationState.Data.Clear(); // Clear the conversation data.
                    return new ChatResponse("Okay, let me know if you need help with something else!");
                default:
                    return null; // Return null if the step is not recognized.
            }
        }

        /// <summary>
        /// Handles the intent based on the user's action.
        /// </summary>
        /// <param name="intent">The parsed user intent.</param>
        /// <param name="context">The HTTP context.</param>
        /// <param name="kernel">The Semantic Kernel instance.</param>
        /// <param name="crmHandler">CRM handler.</param>
        /// <param name="meetingScheduler">Meeting scheduler.</param>
        /// <param name="adminHandler">Admin tasks handler.</param>
        /// <param name="advancedHandler">Advanced features handler.</param>
        /// <param name="leadHandler">Lead management handler.</param>
        /// <param name="salesReportHandler">Sales report handler.</param>
        /// <param name="conversationManager">Conversation manager.</param>
        /// <returns>A task returning a ChatResponse or null if no action is taken.</returns>
        private async Task<ChatResponse?> HandleIntent(UserIntent intent, HttpContext context, Kernel kernel, CRMHandler crmHandler,
            MeetingScheduler meetingScheduler, AdminTasksHandler adminHandler, AdvancedFeaturesHandler advancedHandler,
            LeadManagementHandler leadHandler, SalesReportHandler salesReportHandler, ConversationManager conversationManager)
        {
            // Get the current date and time.
            var currentDate = DateTime.Now;

            // Extract mentions (e.g., @username) from the intent name for notifications.
            var mentions = Regex.Matches(intent.Name ?? "", "@[a-zA-Z0-9\\s]+").Cast<Match>().Select(m => m.Value).ToList();
            string mentionMessage = mentions.Any() ? $"\nNotified {string.Join(" and ", mentions)} to follow up—they will contact you soon." : "";

            // Retrieve CRM data from the context.
            var crmData = context.Items["crmData"] as CRMData;

            // Debug: Log the number of customers and their details in CRM data.
            Console.WriteLine($"Debug: crmData Customers Count: {(crmData?.Customers?.Count ?? 0)}");
            if (crmData?.Customers != null)
            {
                Console.WriteLine("Debug: Customers in crmData:");
                foreach (var customer in crmData.Customers)
                {
                    Console.WriteLine($" - Name: '{customer.Name}', Email: '{customer.Email}', Phone: '{customer.Phone}'");
                }
            }

            switch (intent.Action)
            {
                case "find":
                    // Prepare the search name and log it for debugging.
                    string searchName = intent.Name?.ToLower().Trim() ?? "";
                    Console.WriteLine($"Debug: searchName = '{searchName}'");
                    var matches = crmData?.Customers
                        ?.Where(c => c.Name?.ToLower().Contains(searchName) == true)
                        .ToList() ?? new List<Customer>();
                    Console.WriteLine($"Debug: Found {matches.Count} matches for '{searchName}'");
                    if (matches.Count == 0)
                    {
                        return new ChatResponse("No matching customers found in the database.");
                    }
                    else if (matches.Count == 1)
                    {
                        var customer = matches[0];
                        return new ChatResponse($"Here are the details for {customer.Name}: Email: {customer.Email}, Phone: {customer.Phone}");
                    }
                    else
                    {
                        // Handle multiple matches by starting a confirmation step.
                        var conversationState = conversationManager.GetConversationState(intent.UserId);
                        conversationState.Step = "ConfirmName";
                        conversationState.Data["Matches"] = matches;
                        conversationState.Data["SelectedIndex"] = 0; // Default to the first match.
                        var sb = new StringBuilder("Multiple matches found:\n");
                        for (int i = 0; i < matches.Count && i < 3; i++)
                        {
                            sb.Append($"{i}. {matches[i].Name}\n"); // List up to 3 matches.
                        }
                        if (matches.Count > 3) sb.Append($"...and {matches.Count - 3} more!\n"); // Indicate more results if applicable.
                        sb.Append("Please say 'yes' or the number of the person you meant (e.g., '0'), or 'no' to cancel.");
                        return new ChatResponse(sb.ToString());
                    }
                case "schedule":
                    // Parse the schedule command parts and validate the date.
                    var parts = (intent.Name ?? "").Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(p => p.Trim()).ToArray();
                    if (parts.Length >= 3 && DateTime.TryParse(parts[1], out var parsedDate))
                        return new ChatResponse(await meetingScheduler.ScheduleMeetingAsync(parts[0], parts[1], parts[2], crmData!) ?? "Scheduling failed.");
                    return new ChatResponse("Invalid schedule format. Try: 'schedule, title, date, client'");
                case "admin":
                    if (crmData?.Tasks == null || !crmData.Tasks.Any())
                        return new ChatResponse("No tasks found in the database.");
                    return new ChatResponse(await adminHandler.HandleAdminTasksAsync(intent.Name ?? "", crmData) ?? "No tasks found.");
                case "advanced":
                    if (crmData?.Campaigns == null || !crmData.Campaigns.Any())
                        return new ChatResponse("No campaigns found in the database.");
                    return new ChatResponse(await advancedHandler.HandleAdvancedFeaturesAsync(intent.Name ?? "", crmData) ?? "No campaigns found.");
                case "lead":
                    // Prepare the lead name and log it for debugging.
                    string leadName = intent.Name ?? "";
                    Console.WriteLine($"Debug: leadName = '{leadName}'");
                    if (leadName.ToLower() == "add new")
                    {
                        var state = conversationManager.GetConversationState(intent.UserId);
                        state.Step = "AddLeadName"; // Start the lead addition process.
                        state.CrmData = crmData; // Pass CRM data for use in the conversation.
                        return new ChatResponse("Please provide the lead’s name.");
                    }
                    if (crmData?.Leads == null || !crmData.Leads.Any())
                        return new ChatResponse("No leads found in the database. Try adding one with 'lead, add new'.");
                    return await HandleLeadIntent(intent, context, leadHandler, mentionMessage, crmData);
                case "insights":
                    if (crmData == null || (crmData.Leads == null && crmData.Meetings == null && crmData.SalesReports == null))
                        return new ChatResponse("No data available in the database for insights.");
                    return HandleInsightsIntent(crmData, currentDate, mentionMessage);
                case "report":
                    if (crmData?.SalesReports == null || !crmData.SalesReports.Any())
                        return new ChatResponse("No sales reports available in the database.");
                    return await HandleSalesReportIntent(intent, context, salesReportHandler, currentDate, mentionMessage);
                case "opportunity":
                    // Prepare the opportunity name and log it for debugging.
                    string opportunityName = intent.Name ?? "";
                    Console.WriteLine($"Debug: opportunityName = '{opportunityName}'");
                    if (opportunityName.ToLower() == "add new")
                    {
                        var state = conversationManager.GetConversationState(intent.UserId);
                        state.Step = "AddOpportunityName"; // Start the opportunity addition process.
                        state.CrmData = crmData; // Pass CRM data for use in the conversation.
                        return new ChatResponse("Please provide the opportunity’s name.");
                    }
                    if (crmData?.Opportunities == null || !crmData.Opportunities.Any())
                        return new ChatResponse("No opportunities found in the database. Try adding one with 'opportunity, add new'.");
                    return HandleOpportunityIntent(intent, crmData, mentionMessage);
                case "greet":
                    // Return a greeting based on the current time, with command examples.
                    return new ChatResponse($"Hello{(currentDate.Hour >= 12 && currentDate.Hour < 17 ? " Good afternoon" : currentDate.Hour >= 17 ? " Good evening" : " Good morning")}, I can help with 'find John Doe' or 'schedule, Team Sync, 2025-03-25, Laura'. Type 'help' for commands!{mentionMessage}");
                case "yes":
                    return HandleYesIntent(intent, context, crmData, mentionMessage);
                case "thank":
                    return new ChatResponse($"You’re welcome! How can I assist you further?{mentionMessage}");
                case "good":
                    return new ChatResponse($"Thank you! How can I assist you further?{mentionMessage}");
                case "bad":
                    return new ChatResponse($"I’m sorry to hear that. I’m here to help—please let me know what you need!{mentionMessage}");
                case "help":
                    return new ChatResponse($"Available commands:\n- Find: 'find John Doe'\n- Schedule: 'schedule, Team Sync, 2025-03-25, Laura'\n- Admin: 'admin, list pending tasks'\n- Advanced: 'advanced, list campaigns'\n- Lead: 'lead, add new'\n- Insights: 'insights'\n- Report: 'report for today'\n- Opportunity: 'opportunity, add new' or 'opportunity, list opportunities'\nTry one!{mentionMessage}");
                default:
                    return await HandleDefaultIntent(intent, kernel, mentionMessage);
            }
        }

        /// <summary>
        /// Handles specific lead-related intents.
        /// </summary>
        /// <param name="intent">The parsed user intent.</param>
        /// <param name="context">The HTTP context.</param>
        /// <param name="leadHandler">Lead management handler.</param>
        /// <param name="mentionMessage">Message about notified users.</param>
        /// <param name="crmData">CRM data object.</param>
        /// <returns>A task returning a ChatResponse.</returns>
        private async Task<ChatResponse> HandleLeadIntent(UserIntent intent, HttpContext context, LeadManagementHandler leadHandler, string mentionMessage, CRMData? crmData)
        {
            // Prepare the lead name and log it for debugging.
            string leadName = intent.Name ?? "";
            Console.WriteLine($"Debug: HandleLeadIntent leadName = '{leadName}'");
            if (leadName.ToLower().StartsWith("list new leads"))
            {
                // Filter and list new leads from the CRM data.
                var newLeads = crmData?.Leads.Where(l => l.Status == "New").ToList() ?? new List<Lead>();
                if (newLeads.Any())
                {
                    var sb = new StringBuilder();
                    sb.Append($"New leads ({newLeads.Count} total):\n");
                    foreach (var l in newLeads.Take(3))
                        sb.Append($"- {l.Name} (Contact: {l.Contact}, Score: {l.Score})\n"); // List up to 3 leads.
                    if (newLeads.Count > 3) sb.Append($"...and {newLeads.Count - 3} more!\n"); // Indicate more results if applicable.
                    sb.Append("Would you like to follow up on any?");
                    return new ChatResponse($"{sb.ToString()}{mentionMessage}");
                }
                return new ChatResponse($"No new leads found in the database. Try adding one with 'lead, add new'.{mentionMessage}");
            }

            // Delegate to the lead handler for other lead-related actions.
            string leadResponse = await leadHandler.HandleLeadManagementAsync(leadName) ?? "Lead management action not recognized. Use 'lead, add new' to add a new lead.";
            return new ChatResponse(leadResponse + mentionMessage);
        }

        /// <summary>
        /// Formats the response based on voice input status.
        /// </summary>
        /// <param name="response">The chat response to format.</param>
        /// <param name="isVoiceInput">Indicates if the input was voice-based.</param>
        /// <returns>A formatted object containing the reply and voice/transcript text.</returns>
        private static object FormatResponse(ChatResponse response, bool isVoiceInput)
        {
            // Return a formatted response object with voice and transcript fields based on input type.
            return new
            {
                Reply = response.Reply,
                VoiceText = isVoiceInput ? $"[Spoken] {response.Reply}" : "",
                Transcript = isVoiceInput ? $"[Transcript] {response.Reply}" : ""
            };
        }

        /// <summary>
        /// Handles default intent for unrecognized commands.
        /// </summary>
        /// <param name="intent">The parsed user intent.</param>
        /// <param name="kernel">The Semantic Kernel instance.</param>
        /// <param name="mentionMessage">Message about notified users.</param>
        /// <returns>A task returning a ChatResponse.</returns>
        private async Task<ChatResponse> HandleDefaultIntent(UserIntent intent, Kernel kernel, string mentionMessage)
        {
            await Task.CompletedTask; // Placeholder for potential async operations.
            try
            {
                // Prepare the intent name and log it for debugging.
                string intentName = intent.Name ?? "";
                Console.WriteLine($"Debug: HandleDefaultIntent intentName = '{intentName}'");
                if (intentName.ToLower() == "who made you")
                    return new ChatResponse($"I’m CRM Assistant, created by [CEO's Name] and the GDI Bot team! How can I help you today?{mentionMessage}");
                return new ChatResponse($"I didn’t understand that. Try 'help' for a list of commands!{mentionMessage}");
            }
            catch (Exception ex)
            {
                // Log any errors and return an error response.
                Console.WriteLine($"Error in default intent: {ex.Message}");
                return new ChatResponse($"An error occurred. Please try again or type 'help'!{mentionMessage}");
            }
        }

        /// <summary>
        /// Handles insights intent to provide CRM data summary.
        /// </summary>
        /// <param name="crmData">CRM data object.</param>
        /// <param name="currentDate">The current date for filtering.</param>
        /// <param name="mentionMessage">Message about notified users.</param>
        /// <returns>A ChatResponse with insights data.</returns>
        private ChatResponse HandleInsightsIntent(CRMData? crmData, DateTime currentDate, string mentionMessage)
        {
            // Calculate insights based on CRM data for the current date.
            var totalLeads = crmData?.Leads.Count ?? 0;
            var newLeads = crmData?.Leads.Count(l => l.Status == "New") ?? 0;
            var totalMeetings = crmData?.Meetings.Count(m => m.Date.Date == currentDate.Date) ?? 0;
            var totalRevenue = crmData?.SalesReports.Where(r => r.Month.Year == currentDate.Year && r.Month.Month == currentDate.Month).Sum(r => r.Revenue) ?? 0;
            return new ChatResponse($"Insights for {currentDate:yyyy-MM-dd}:\nTotal leads: {totalLeads}\nNew leads: {newLeads}\nMeetings today: {totalMeetings}\nRevenue this month: ${totalRevenue:F2}{mentionMessage}");
        }

        /// <summary>
        /// Handles sales report intent to generate a report.
        /// </summary>
        /// <param name="intent">The parsed user intent.</param>
        /// <param name="context">The HTTP context.</param>
        /// <param name="salesReportHandler">Sales report handler.</param>
        /// <param name="currentDate">The current date for filtering.</param>
        /// <param name="mentionMessage">Message about notified users.</param>
        /// <returns>A task returning a ChatResponse.</returns>
        private async Task<ChatResponse> HandleSalesReportIntent(UserIntent intent, HttpContext context, SalesReportHandler salesReportHandler, DateTime currentDate, string mentionMessage)
        {
            // Generate a report for the current month.
            var reportDate = currentDate.ToString("yyyy-MM");
            var report = await salesReportHandler.HandleSalesReportAsync($"report for {reportDate}");
            return new ChatResponse(report ?? "No sales report available.");
        }

        /// <summary>
        /// Handles yes intent (currently a placeholder).
        /// </summary>
        /// <param name="intent">The parsed user intent.</param>
        /// <param name="context">The HTTP context.</param>
        /// <param name="crmData">CRM data object.</param>
        /// <param name="mentionMessage">Message about notified users.</param>
        /// <returns>A ChatResponse.</returns>
        private ChatResponse HandleYesIntent(UserIntent intent, HttpContext context, CRMData? crmData, string mentionMessage)
        {
            // Placeholder response until full implementation is added.
            return new ChatResponse("Yes intent not fully implemented yet.");
        }

        /// <summary>
        /// Handles opportunity-related intents.
        /// </summary>
        /// <param name="intent">The parsed user intent.</param>
        /// <param name="crmData">CRM data object.</param>
        /// <param name="mentionMessage">Message about notified users.</param>
        /// <returns>A ChatResponse.</returns>
        private ChatResponse HandleOpportunityIntent(UserIntent intent, CRMData? crmData, string mentionMessage)
        {
            // Prepare the opportunity name and log it for debugging.
            string opportunityName = intent.Name ?? "";
            Console.WriteLine($"Debug: HandleOpportunityIntent opportunityName = '{opportunityName}'");
            if (opportunityName.ToLower() == "list opportunities")
            {
                var opportunities = crmData?.Opportunities ?? new List<Opportunity>();
                if (opportunities.Any())
                {
                    var sb = new StringBuilder();
                    sb.Append($"Opportunities ({opportunities.Count} total):\n");
                    foreach (var opp in opportunities.Take(3))
                    {
                        var customer = crmData?.Customers.FirstOrDefault(c => c.Id == opp.CustomerId);
                        sb.Append($"- {opp.Name} with {customer?.Name ?? "Unknown"} (Value: ${opp.Value:F2}, Stage: {opp.Stage})\n"); // List up to 3 opportunities.
                    }
                    if (opportunities.Count > 3) sb.Append($"...and {opportunities.Count - 3} more!\n"); // Indicate more results if applicable.
                    return new ChatResponse($"{sb.ToString()}{mentionMessage}");
                }
                return new ChatResponse($"No opportunities found in the database.{mentionMessage}");
            }
            return new ChatResponse("Please use 'opportunity, add new' to add a new opportunity or 'opportunity, list opportunities' to see the list.{mentionMessage}");
        }
    }
}