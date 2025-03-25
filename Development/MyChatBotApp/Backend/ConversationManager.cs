using Microsoft.AspNetCore.Http;
using MyChatBotApp.Backend;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyChatBotApp.Backend
{
    // Manages multi-step conversations for tasks like adding leads and opportunities.
    public class ConversationManager
    {
        // In-memory storage for conversation states, keyed by user ID.
        private static readonly Dictionary<string, ConversationState> UserConversationStates = new();

        // Retrieves or creates a conversation state for a given user.
        public ConversationState GetConversationState(string userId)
        {
            // Check if the user already has a conversation state.
            if (!UserConversationStates.TryGetValue(userId, out var state))
            {
                state = new ConversationState(); // Create a new state if none exists.
                UserConversationStates[userId] = state; // Store the new state for the user.
            }
            return state; // Return the user's conversation state.
        }

        // Handles multi-step conversations (e.g., adding leads or opportunities) and saves to the database.
        public async Task<ChatResponse?> HandleConversationState(string userId, ConversationState state, ChatRequest request, bool isVoiceInput)
        {
            try
            {
                switch (state.Step)
                {
                    // Step 1: Collect the lead's name for adding a new lead.
                    case "AddLeadName":
                        if (string.IsNullOrWhiteSpace(request.Message))
                            return new ChatResponse("The lead’s name cannot be empty. Please provide the lead’s name.");
                        state.LeadName = request.Message; // Store the provided lead name.
                        UserConversationStates[userId] = state; // Update the user's state.
                        state.Step = "AddLeadContact"; // Move to the next step: collecting contact info.
                        return new ChatResponse($"Thank you. Please provide the lead’s contact information (e.g., email or phone).");

                    // Step 2: Collect the lead's contact information.
                    case "AddLeadContact":
                        if (string.IsNullOrWhiteSpace(request.Message))
                            return new ChatResponse("The contact cannot be empty. Please provide the lead’s contact information.");
                        state.LeadContact = request.Message; // Store the contact information.
                        UserConversationStates[userId] = state; // Update the user's state.
                        state.Step = "AddLeadStatus"; // Move to the next step: collecting status.
                        return new ChatResponse($"Thank you. Please provide the lead’s status (e.g., New, Contacted, Qualified, Lost).");

                    // Step 3: Collect the lead's status and save the lead to the database.
                    case "AddLeadStatus":
                        if (string.IsNullOrWhiteSpace(request.Message))
                            return new ChatResponse("The status cannot be empty. Please provide the lead’s status.");
                        state.LeadStatus = request.Message; // Store the lead's status.
                        state.CrmData ??= new CRMData(); // Initialize CRM data if not already loaded.
                        var newLead = new Lead
                        {
                            Id = state.CrmData.Leads.Any() ? state.CrmData.Leads.Max(l => l.Id) + 1 : 1, // Generate a new ID.
                            Name = state.LeadName!, // Set the lead's name.
                            Contact = state.LeadContact!, // Set the lead's contact.
                            Status = state.LeadStatus!, // Set the lead's status.
                            Score = CalculateLeadScore(state.LeadName!, state.LeadContact!, state.LeadStatus!) // Calculate the lead's score.
                        };
                        state.CrmData.Leads.Add(newLead); // Add the lead to the CRM data.
                        if (await CrmDataManager.SaveCrmData(state.CrmData)) // Save the updated data to crm_data.json.
                        {
                            var response = new ChatResponse($"Lead added successfully and saved to the database!\nName: {newLead.Name}\nContact: {newLead.Contact}\nStatus: {newLead.Status}\nScore: {newLead.Score}");
                            UserConversationStates.Remove(userId); // Clear the state after completion.
                            return response; // Return success message with lead details.
                        }
                        return new ChatResponse("Failed to save the lead to crm_data.json. Please try again."); // Return error if save fails.

                    // Step 1: Collect the opportunity's name for adding a new opportunity.
                    case "AddOpportunityName":
                        if (string.IsNullOrWhiteSpace(request.Message))
                            return new ChatResponse("The opportunity’s name cannot be empty. Please provide the opportunity’s name.");
                        state.OpportunityName = request.Message; // Store the opportunity name.
                        UserConversationStates[userId] = state; // Update the user's state.
                        state.Step = "AddOpportunityCustomerId"; // Move to the next step: collecting customer ID.
                        return new ChatResponse($"Thank you. Please provide the customer ID for this opportunity (e.g., 1).");

                    // Step 2: Collect the customer ID for the opportunity.
                    case "AddOpportunityCustomerId":
                        if (!int.TryParse(request.Message, out int customerId) || customerId <= 0)
                            return new ChatResponse("Invalid customer ID. Please provide a valid number (e.g., 1).");
                        state.CrmData ??= new CRMData(); // Initialize CRM data if not already loaded.
                        if (state.CrmData.Customers.All(c => c.Id != customerId))
                            return new ChatResponse("Customer ID not found in the database. Please provide a valid customer ID.");
                        state.OpportunityCustomerId = customerId; // Store the customer ID.
                        UserConversationStates[userId] = state; // Update the user's state.
                        state.Step = "AddOpportunityValue"; // Move to the next step: collecting value.
                        return new ChatResponse($"Thank you. Please provide the opportunity’s value (e.g., 5000).");

                    // Step 3: Collect the opportunity's value.
                    case "AddOpportunityValue":
                        if (!decimal.TryParse(request.Message, out decimal value) || value <= 0)
                            return new ChatResponse("Invalid value. Please provide a valid number (e.g., 5000).");
                        state.OpportunityValue = value; // Store the opportunity value.
                        UserConversationStates[userId] = state; // Update the user's state.
                        state.Step = "AddOpportunityStage"; // Move to the next step: collecting stage.
                        return new ChatResponse($"Thank you. Please provide the opportunity’s stage (e.g., Prospecting, Negotiation, Closed).");

                    // Step 4: Collect the opportunity's stage and save to the database.
                    case "AddOpportunityStage":
                        if (string.IsNullOrWhiteSpace(request.Message))
                            return new ChatResponse("The stage cannot be empty. Please provide the opportunity’s stage.");
                        state.OpportunityStage = request.Message; // Store the opportunity stage.
                        state.CrmData ??= new CRMData(); // Initialize CRM data if not already loaded.
                        var newOpportunity = new Opportunity
                        {
                            Id = state.CrmData.Opportunities.Any() ? state.CrmData.Opportunities.Max(o => o.Id) + 1 : 1, // Generate a new ID.
                            Name = state.OpportunityName!, // Set the opportunity name.
                            CustomerId = state.OpportunityCustomerId!.Value, // Set the customer ID.
                            Value = state.OpportunityValue!.Value, // Set the opportunity value.
                            Stage = state.OpportunityStage! // Set the opportunity stage.
                        };
                        state.CrmData.Opportunities.Add(newOpportunity); // Add the opportunity to the CRM data.
                        if (await CrmDataManager.SaveCrmData(state.CrmData)) // Save the updated data to crm_data.json.
                        {
                            var customer = state.CrmData.Customers.FirstOrDefault(c => c.Id == newOpportunity.CustomerId);
                            var response = new ChatResponse($"Opportunity added successfully and saved to the database!\nName: {newOpportunity.Name}\nCustomer: {customer?.Name ?? "Unknown"}\nValue: ${newOpportunity.Value:F2}\nStage: {newOpportunity.Stage}");
                            UserConversationStates.Remove(userId); // Clear the state after completion.
                            return response; // Return success message with opportunity details.
                        }
                        return new ChatResponse("Failed to save the opportunity to crm_data.json. Please try again."); // Return error if save fails.

                    // Handle invalid conversation steps.
                    default:
                        Console.WriteLine($"Invalid Conversation State Step: {state.Step} - Resetting state.");
                        UserConversationStates.Remove(userId); // Clear the state if the step is invalid.
                        return new ChatResponse("An error occurred. Let’s start over—how can I assist you?");
                }
            }
            catch (Exception ex)
            {
                // Log any errors and reset the conversation state.
                Console.WriteLine($"Error in Conversation State handling: {ex.Message}\n{ex.StackTrace}");
                UserConversationStates.Remove(userId); // Clear the state on error.
                return new ChatResponse("An error occurred. Let’s reset—how can I assist you?");
            }
        }

        // Calculates a lead score based on status and contact type.
        private static int CalculateLeadScore(string name, string contact, string status)
        {
            int baseScore = 10; // Start with a base score for every lead.
            if (status.ToLower() == "qualified") baseScore += 30; // Add bonus for qualified leads.
            if (contact.Contains("@")) baseScore += 20; // Add bonus if contact includes an email.
            return Math.Min(baseScore, 100); // Cap the score at 100.
        }
    }

    // Represents the state of a multi-step conversation for a user.
    public class ConversationState
    {
        public string Step { get; set; } = ""; // Tracks the current step in the conversation (e.g., "AddLeadName").
        public string? LeadName { get; set; } // Stores the lead's name during lead creation.
        public string? LeadContact { get; set; } // Stores the lead's contact information.
        public string? LeadStatus { get; set; } // Stores the lead's status.
        public string? OpportunityName { get; set; } // Stores the opportunity's name during opportunity creation.
        public int? OpportunityCustomerId { get; set; } // Stores the customer ID for the opportunity.
        public decimal? OpportunityValue { get; set; } // Stores the opportunity's value.
        public string? OpportunityStage { get; set; } // Stores the opportunity's stage.
        public CRMData? CrmData { get; set; } // Holds the CRM data loaded from the database.
        public Dictionary<string, object> Data { get; set; } = new Dictionary<string, object>(); // Stores additional data for disambiguation (used by LeadManager).
    }
}