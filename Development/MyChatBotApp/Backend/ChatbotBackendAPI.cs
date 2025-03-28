#pragma warning disable SKEXP0010 // Disable warning for Semantic Kernel experimental APIs

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.SemanticKernel;
using MyChatBotApp.Backend;
using System;

namespace MyChatBotApp
{
    // Main entry point class for the chatbot application.
    public class Program
    {
        // Entry method to configure and run the web application.
        public static void Main(string[] args)
        {
            // Create a web application builder with command-line arguments.
            var builder = WebApplication.CreateBuilder(args);

            // Enable API exploration for Swagger or similar tools.
            builder.Services.AddEndpointsApiExplorer();

            // Register Semantic Kernel as a singleton with a factory method to handle connection errors.
            builder.Services.AddSingleton<Kernel>(sp =>
            {
                var kernelBuilder = Kernel.CreateBuilder(); // Initialize a new kernel builder.

                try
                {
                    // Attempt to connect to a local Mistral model via LM Studio for AI capabilities.
                    kernelBuilder.Services.AddOpenAIChatCompletion(
                        modelId: "mistral-7b-instruct-v0.3",
                        endpoint: new Uri("http://192.168.0.101:1234/v1"),
                        apiKey: "not-needed" // LM Studio doesn't require an API key, but the field is mandatory.
                    );
                    var kernel = kernelBuilder.Build(); // Build the kernel with AI support.
                    Console.WriteLine("Semantic Kernel connected to LM Studio - AI is ready to assist!");
                    return kernel; // Return the AI-enabled kernel.
                }
                catch (Exception ex)
                {
                    // Log the error and fall back to a basic kernel if the AI connection fails.
                    Console.WriteLine($"Error connecting to Semantic Kernel: {ex.Message} - Falling back to minimal Kernel.");
                    var fallbackBuilder = Kernel.CreateBuilder(); // Create a fallback builder.
                    return fallbackBuilder.Build(); // Return a minimal kernel without AI.
                }
            });

            // Configure CORS to allow communication with the frontend (localhost:3000).
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });           
     });

            // Load CRM data from a file and register it as a singleton service.
            var crmData = CrmDataManager.LoadCrmData();
            builder.Services.AddSingleton(crmData);

            // Register scoped services (handlers) with dependency injection for processing requests.
            builder.Services.AddScoped<CRMHandler>(sp => new CRMHandler(crmData, sp.GetRequiredService<Kernel>()));
            builder.Services.AddScoped<MeetingScheduler>(sp => new MeetingScheduler(sp.GetRequiredService<Kernel>(), crmData));
            builder.Services.AddScoped<AdminTasksHandler>(sp => new AdminTasksHandler(sp.GetRequiredService<Kernel>()));
            builder.Services.AddScoped<AdvancedFeaturesHandler>(sp => new AdvancedFeaturesHandler(sp.GetRequiredService<Kernel>()));
            builder.Services.AddScoped<LeadManagementHandler>(sp => new LeadManagementHandler(sp.GetRequiredService<Kernel>()));
            builder.Services.AddScoped<SalesReportHandler>(sp => new SalesReportHandler(sp.GetRequiredService<Kernel>(), crmData));
            builder.Services.AddScoped<ConversationManager>();
            builder.Services.AddScoped<LeadManager>();
            builder.Services.AddScoped<PredefinedResponseManager>(); // Manager for predefined responses from JSON.
            builder.Services.AddScoped<LeadPredictor>(); // Predictor for lead conversion likelihood.

            // Build the application instance.
            var app = builder.Build();

            // Add optional configuration from appsettings.json with reload support.
            builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            // Apply the CORS policy to the application.
            app.UseCors("AllowFrontend");

            // Define the main chat endpoint to process user messages.
            app.MapPost("/chat", async (HttpContext context, Kernel kernel, CRMHandler crmHandler, MeetingScheduler meetingScheduler,
                AdminTasksHandler adminHandler, AdvancedFeaturesHandler advancedHandler, LeadManagementHandler leadHandler,
                SalesReportHandler salesReportHandler, CRMData crmData, LeadManager leadManager, ConversationManager conversationManager,
                PredefinedResponseManager predefinedResponseManager, LeadPredictor leadPredictor) =>
            {
                // Read and deserialize the incoming chat request from the HTTP body.
                var request = await context.Request.ReadFromJsonAsync<ChatRequest>();
                if (request == null || string.IsNullOrWhiteSpace(request.UserId))
                {
                    // Log and return a bad request if the input is invalid.
                    Console.WriteLine("Bad Request: Invalid request payload - User input or ID is missing!");
                    return Results.BadRequest("Invalid request payload");
                }

                // Log the user's input for debugging.
                Console.WriteLine($"User {request.UserId} Input: {request.Message}");

                // Store CRM data in the context for use in handlers.
                context.Items["crmData"] = crmData ?? new CRMData();

                try
                {
                    // Process the chat request using the LeadManager and return the response.
                    var response = await leadManager.ProcessChatRequest(request, context, kernel, crmHandler, meetingScheduler,
                        adminHandler, advancedHandler, leadHandler, salesReportHandler, conversationManager, predefinedResponseManager, leadPredictor);
                    return Results.Ok(response);
                }
                catch (Exception ex)
                {
                    // Log any errors and return an internal server error response.
                    Console.WriteLine($"Error processing request: {ex.Message}\n{ex.StackTrace}");
                    return Results.Json(new { error = "Internal server error" }, statusCode: 500);
                }
            });

            // Define an endpoint to collect user feedback.
            app.MapPost("/feedback", async (HttpContext context) =>
            {
                // Read and deserialize the feedback request from the HTTP body.
                var feedback = await context.Request.ReadFromJsonAsync<FeedbackRequest>();
                if (feedback == null || string.IsNullOrWhiteSpace(feedback.UserId) || string.IsNullOrWhiteSpace(feedback.MessageId) || feedback.Liked == null)
                {
                    // Log and return a bad request if the feedback data is invalid.
                    Console.WriteLine("Bad Request: Invalid feedback payload");
                    return Results.BadRequest("Invalid feedback payload");
                }

                // Log the feedback details for debugging.
                Console.WriteLine($"Feedback from {feedback.UserId} for message {feedback.MessageId}: {(feedback.Liked.Value ? "Liked" : "Disliked")}");
                return Results.Ok(new { Message = "Thank you for your feedback!" });
            });

            // Define an endpoint to set user preferences.
            app.MapPost("/set-preference", async (HttpContext context) =>
            {
                // Read and deserialize the preference request from the HTTP body.
                var request = await context.Request.ReadFromJsonAsync<PreferenceRequest>();
                if (request == null || string.IsNullOrWhiteSpace(request.UserId) || string.IsNullOrWhiteSpace(request.Preference))
                {
                    // Log and return a bad request if the preference data is invalid.
                    Console.WriteLine("Bad Request: Invalid preference payload");
                    return Results.BadRequest("Invalid preference payload");
                }

                // Store the user preference and log the action.
                UserPreferences.SetPreference(request.UserId, request.Preference);
                Console.WriteLine($"Set preference for {request.UserId}: {request.Preference}");
                return Results.Ok(new { Message = "Preference set successfully!" });
            });

            // Start the web application.
            app.Run();
        }
    }

    // Static class to manage and store user preferences in memory.
    public static class UserPreferences
    {
        private static readonly Dictionary<string, string> Preferences = new(); // In-memory storage for preferences.
        public static void SetPreference(string userId, string preference) => Preferences[userId] = preference; // Set a user's preference.
        public static string GetPreference(string userId) => Preferences.TryGetValue(userId, out var pref) ? pref : "default"; // Retrieve a user's preference (default if not found).
    }

    // Data models for API requests and responses.
    public record ChatRequest(string UserId, string Message, bool? IsVoice = null); // Model for chat input with optional voice flag.
    public record ChatResponse(string Reply); // Model for chat responses.
    public record FeedbackRequest(string UserId, string MessageId, bool? Liked); // Model for feedback submissions.
    public record PreferenceRequest(string UserId, string Preference); // Model for preference settings.

    public class Lead
    {
        public int Id { get; set; } // Unique identifier for the lead.
        public string Name { get; set; } = ""; // Lead's full name.
        public string Contact { get; set; } = ""; // Lead's contact information (e.g., email or phone).
        public string Status { get; set; } = ""; // Lead's status (e.g., New, Contacted, Qualified, Lost).
        public int Score { get; set; } = 0; // Lead's score based on engagement.
        // Added fields to track interactions for lead prediction.
        public int MessagesSent { get; set; } = 0; // Number of messages sent to the lead.
        public int CallsMade { get; set; } = 0; // Number of calls made to the lead.
        public int MeetingsHeld { get; set; } = 0; // Number of meetings held with the lead.
        public DateTime LastInteraction { get; set; } = DateTime.MinValue; // Date of the last interaction.
    } // Model for lead data with default values.

    // Ensure UserIntent is correctly defined in the Backend namespace.
    namespace MyChatBotApp.Backend
    {
        /// <summary>
        /// Represents a user's intent with an action and associated name.
        /// </summary>
        public record UserIntent(string UserId, string? Action, string? Name); // Model for representing user intent.
    }
}