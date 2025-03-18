#pragma warning disable SKEXP0010

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.SemanticKernel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();

// Configure Semantic Kernel for LM Studio API
builder.Services.AddSingleton(sp =>
{
    var kernelBuilder = Kernel.CreateBuilder();
    kernelBuilder.Services.AddOpenAIChatCompletion(
        modelId: "mistral-7b-instruct-v0.3",
        endpoint: new Uri("http://192.168.0.101:1234/v1")
    );
    var kernel = kernelBuilder.Build();
    Console.WriteLine("✅ Semantic Kernel connected to LM Studio");
    return kernel;
});

// Add CRMHandler as a singleton
builder.Services.AddSingleton(sp => new CRMHandler(LoadCRMData()));

// Enable CORS
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

// Load CRM Data from JSON file
CRMData LoadCRMData()
{
    try
    {
        string crmJson = File.ReadAllText("crm_data.json");
        var data = JsonSerializer.Deserialize<CRMData>(crmJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new CRMData();
        Console.WriteLine($"✅ CRM Data Loaded: {data.Customers.Count} Customers.");
        return data;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error loading CRM data: {ex.Message}");
        return new CRMData();
    }
}

var app = builder.Build();

app.UseCors("AllowFrontend");

// Chat API Endpoint
app.MapPost("/chat", async (HttpContext context, Kernel kernel, CRMHandler crmHandler) =>
{
    try
    {
        var request = await context.Request.ReadFromJsonAsync<ChatRequest>();
        if (request == null || string.IsNullOrWhiteSpace(request.Message))
        {
            return Results.BadRequest("Invalid request payload");
        }

        Console.WriteLine($"📩 User Input: {request.Message}");

        // Use CRMHandler for customer lookups
        string crmResponse = crmHandler.GetCustomerDetails(request.Message);
        if (!crmResponse.Contains("not found", StringComparison.OrdinalIgnoreCase) && !crmResponse.Contains("Invalid"))
        {
            Console.WriteLine("🔍 Match Found via CRMHandler");
            return Results.Ok(new ChatResponse(crmResponse));
        }

        // If no match, fall back to AI
        Console.WriteLine($"🤖 Sending prompt to AI: {request.Message}");
        var chatResult = await kernel.InvokePromptAsync(
            $"{request.Message}. If it is a greeting, respond naturally and professionally. If asking about a name, and no match is found in CRM, say there is no relevant data. Rephrase the response professionally.",
            new KernelArguments()
        );
        Console.WriteLine($"✅ AI Response: {chatResult.ToString()}");

        return Results.Ok(new ChatResponse(chatResult.ToString()));
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERROR in /chat: {ex.Message}\n{ex.StackTrace}");
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

// Feedback API Endpoint (for ChatbotUI.jsx)
app.MapPost("/feedback", async (HttpContext context) =>
{
    try
    {
        var feedback = await context.Request.ReadFromJsonAsync<FeedbackRequest>();
        if (feedback == null || string.IsNullOrWhiteSpace(feedback.MessageId))
        {
            return Results.BadRequest("Invalid feedback payload");
        }

        Console.WriteLine($"👍 Feedback received: MessageId={feedback.MessageId}, Liked={feedback.Liked}");
        return Results.Ok(new { Message = "Feedback recorded, thanks dude!" });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERROR in /feedback: {ex.Message}");
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

app.Run();

// Data Models
public record ChatRequest(string UserId, string Message); // Updated to match ChatbotUI.jsx
public record ChatResponse(string Reply);
public record FeedbackRequest(string UserId, string MessageId, bool Liked);

public class CRMData
{
    public List<Customer> Customers { get; set; } = new();
    public List<Lead> Leads { get; set; } = new();
    public List<Meeting> Meetings { get; set; } = new();
    public List<SalesReport> SalesReports { get; set; } = new();
}

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
}

public class Lead
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Contact { get; set; } = "";
    public string Status { get; set; } = "";
}

public class Meeting
{
    public DateTime Date { get; set; } = DateTime.MinValue;
    public string Title { get; set; } = "";
    public string Client { get; set; } = "";
}

public class SalesReport
{
    public DateTime Month { get; set; } = DateTime.MinValue;
    public decimal Revenue { get; set; } = 0;
}

// CRMHandler (from your earlier share)
public class CRMHandler
{
    private readonly CRMData _crmData;

    public CRMHandler(CRMData crmData)
    {
        _crmData = crmData ?? throw new ArgumentNullException(nameof(crmData));
    }

    public string GetCustomerDetails(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
        {
            return "Invalid customer name.";
        }

        string customerName = message
            .Replace("find me", "", StringComparison.OrdinalIgnoreCase)
            .Replace("find", "", StringComparison.OrdinalIgnoreCase)
            .Trim();

        if (string.IsNullOrWhiteSpace(customerName))
        {
            return "Please tell me a customer name to find!";
        }

        var customer = _crmData?.Customers?.FirstOrDefault(c =>
            c.Name.Equals(customerName, StringComparison.OrdinalIgnoreCase));

        return customer != null
            ? $"Customer Details: Name={customer.Name}, Email={customer.Email}, Phone={customer.Phone}"
            : $"Customer '{customerName}' not found, dude!";
    }
}