#pragma warning disable SKEXP0010 // Suppress experimental warning for AddOpenAIChatCompletion

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.SemanticKernel;
using Serilog;
using System;

namespace MyChatBotApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.Console()
                .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();

            Log.Information("Starting MyChatBotApp...");

            var builder = WebApplication.CreateBuilder(args);
            builder.Host.UseSerilog();
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSingleton<Kernel>(sp =>
            {
                var kernelBuilder = Kernel.CreateBuilder();
                try
                {
#pragma warning disable SKEXP0010
                    kernelBuilder.Services.AddOpenAIChatCompletion(
                        modelId: "mistral-7b-instruct-v0.3",
                        endpoint: new Uri("http://192.168.0.101:1234"),
                        apiKey: "not-needed"
                    );
#pragma warning restore SKEXP0010
                    var kernel = kernelBuilder.Build();
                    Log.Information("Connected to Mistral 7B via LM Studio - AI is ready!");
                    return kernel;
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "AI connection failed - Falling back to minimal kernel.");
                    return Kernel.CreateBuilder().Build();
                }
            });

            var crmData = CrmDataManager.LoadCrmData();
            builder.Services.AddSingleton(crmData);
            builder.Services.AddScoped<ChatProcessor>();
            builder.Services.AddScoped<FeedbackManager>();

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

            var app = builder.Build();
            app.UseCors("AllowFrontend");

            app.MapPost("/chat", async (ChatProcessor processor, CRMData crmData, ChatRequest request) =>
            {
                if (request == null || string.IsNullOrWhiteSpace(request.UserId) || string.IsNullOrWhiteSpace(request.Message))
                {
                    Log.Warning("Invalid chat request: Missing user ID or message.");
                    return Results.BadRequest(new { Error = "Invalid request: Please provide a user ID and message." });
                }

                Log.Information("Received chat request from User {UserId}: {Message}", request.UserId, request.Message);

                try
                {
                    var response = await processor.ProcessMessage(request);
                    Log.Information("Chat response for User {UserId}: {Response}", request.UserId, response);

                    var messageId = crmData.ChatMessages.Count + 1;
                    crmData.ChatMessages.Add(new ChatMessage
                    {
                        Id = messageId,
                        UserId = request.UserId,
                        Message = request.Message,
                        Response = response,
                        Timestamp = DateTime.Now
                    });

                    return Results.Ok(new { MessageId = messageId, Reply = response });
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "Error processing chat request for User {UserId}: {Message}", request.UserId, request.Message);
                    return Results.Json(
                        new { Error = "An error occurred while processing your request. Please try again or use 'help' for commands." },
                        statusCode: 500
                    );
                }
            });

            app.MapPost("/chat/feedback", (FeedbackManager feedbackManager, CRMData crmData, ChatFeedbackRequest request) =>
            {
                if (request == null || request.MessageId <= 0)
                {
                    Log.Warning("Invalid chat feedback request: Missing message ID or feedback.");
                    return Results.BadRequest(new { Error = "Invalid request: Please provide a message ID and feedback." });
                }

                Log.Information("Received chat feedback for MessageId {MessageId}: {Liked}", request.MessageId, request.Liked);

                try
                {
                    var chatMessage = crmData.ChatMessages.FirstOrDefault(m => m.Id == request.MessageId);
                    if (chatMessage == null)
                    {
                        Log.Warning("Chat message not found for MessageId {MessageId}", request.MessageId);
                        return Results.NotFound(new { Error = "Chat message not found." });
                    }

                    string feedback = request.Liked ? "👍" : "👎";
                    feedbackManager.AddFeedback(chatMessage.UserId, chatMessage.Message, feedback);
                    Log.Information("Feedback successfully recorded for MessageId {MessageId}.", request.MessageId);
                    return Results.Ok(new { Message = "Thank you for your feedback!" });
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "Error recording feedback for MessageId {MessageId}: {Liked}", request.MessageId, request.Liked);
                    return Results.Json(
                        new { Error = "An error occurred while recording your feedback. Please try again." },
                        statusCode: 500
                    );
                }
            });

            app.MapPost("/feedback", (FeedbackManager feedbackManager, FeedbackRequest request) =>
            {
                if (request == null || string.IsNullOrWhiteSpace(request.UserId) || string.IsNullOrWhiteSpace(request.Message) || string.IsNullOrWhiteSpace(request.Feedback))
                {
                    Log.Warning("Invalid feedback request: Missing user ID, message, or feedback.");
                    return Results.BadRequest(new { Error = "Invalid request: Please provide a user ID, message, and feedback." });
                }

                try
                {
                    feedbackManager.AddFeedback(request.UserId, request.Message, request.Feedback);
                    return Results.Ok(new { Message = "Thank you for your feedback!" });
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "Error recording feedback for User {UserId}: {Feedback}", request.UserId, request.Feedback);
                    return Results.Json(
                        new { Error = "An error occurred while recording your feedback. Please try again." },
                        statusCode: 500
                    );
                }
            });

            Log.Information("Application started. Listening for requests...");
            app.Run();
            Log.CloseAndFlush();
        }
    }

    public record ChatRequest(string UserId, string Message);
    public record FeedbackRequest(string UserId, string Message, string Feedback);
    public record ChatFeedbackRequest(int MessageId, bool Liked);
}