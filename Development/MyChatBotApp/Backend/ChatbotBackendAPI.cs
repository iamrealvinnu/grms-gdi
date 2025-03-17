#pragma warning disable SKEXP0010

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Functions;
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
        modelId: "mistral-7b-instruct-v0.3", // Use Mistral 7B model
        endpoint: new Uri("http://192.168.0.101:1234/v1") // LM Studio endpoint
    );

    var kernel = kernelBuilder.Build();
    Console.WriteLine("✅ Semantic Kernel connected to LM Studio");
    return kernel;
});

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

// Load CRM Data from JSON file
CRMData crmData;
try
{
    string crmJson = File.ReadAllText("crm_data.json");
    crmData = JsonSerializer.Deserialize<CRMData>(crmJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new CRMData();
    Console.WriteLine($"✅ CRM Data Loaded: {crmData.Customers.Count} Customers.");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Error loading CRM data: {ex.Message}");
    crmData = new CRMData();
}

var app = builder.Build();

app.UseCors("AllowAll");

// Chat API Endpoint: Handles CRM Search & AI Responses
app.MapPost("/chat", async (HttpContext context, Kernel kernel) =>
{
    try
    {
        var request = await context.Request.ReadFromJsonAsync<ChatRequest>();
        if (request == null || string.IsNullOrWhiteSpace(request.Message))
        {
            return Results.BadRequest("Invalid request payload");
        }

        Console.WriteLine($"📩 User Input: {request.Message}");

        // Search CRM Data First (Full & Partial Name Matching)
        var matchedCustomers = crmData.Customers.Where(c =>
            request.Message.Contains(c.Name, StringComparison.OrdinalIgnoreCase)).ToList();

        if (matchedCustomers.Count == 1)
        {
            var customer = matchedCustomers.First();
            Console.WriteLine("🔍 Match Found in CRM Database");
            return Results.Ok(new ChatResponse(
                $"👤 Customer Found!\nName: {customer.Name}\n📧 Email: {customer.Email}\n📞 Phone: {customer.Phone}"
            ));
        }
        else if (matchedCustomers.Count > 1)
        {
            Console.WriteLine("🔍 Multiple Matches Found in CRM Database");
            string namesList = string.Join(", ", matchedCustomers.Select(c => c.Name));
            return Results.Ok(new ChatResponse(
                $"🔍 Multiple customers found: {namesList}. Please specify the full name."
            ));
        }

        // If no exact match, check for partial matches
        var firstNameMatches = crmData.Customers.Where(c =>
            request.Message.Split().Any(word => c.Name.StartsWith(word, StringComparison.OrdinalIgnoreCase))).ToList();

        if (firstNameMatches.Count > 0)
        {
            Console.WriteLine("🔍 Partial Matches Found in CRM Database");
            string possibleMatches = string.Join(", ", firstNameMatches.Select(c => c.Name));
            return Results.Ok(new ChatResponse(
                $"I found multiple names matching '{request.Message}'. Did you mean: {possibleMatches}?"
            ));
        }

        // If no name is found in CRM, use AI for professional response
        Console.WriteLine($"🤖 Sending prompt to AI: {request.Message}");
        var chatResult = await kernel.InvokePromptAsync(
            $"{request.Message}. If it is a greeting, respond naturally and professionally. If asking about a name, and no match is found in CRM, say there is no relevant data. Rephrase the response professionally.",
            new KernelArguments()
        );
        Console.WriteLine($"✅ AI Response: {chatResult.ToString()}");

        return Results.Ok(new ChatResponse(chatResult.ToString()));  // Added return statement for AI response
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERROR in /chat: {ex.Message}\n{ex.StackTrace}");
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

app.Run();


// Data Models
public record ChatRequest(string Message);
public record ChatResponse(string Reply);

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
