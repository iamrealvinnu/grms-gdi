using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using System;
using System.Linq;
using System.Threading.Tasks;

public class SalesReportHandler
{
    private readonly Kernel _kernel;
    private readonly CRMData _crmData;

    public SalesReportHandler(Kernel kernel, CRMData crmData)
    {
        _kernel = kernel;
        _crmData = crmData;
    }

    public async Task<string> HandleSalesReportAsync(string userMessage)
    {
        var latestReport = _crmData.SalesReports
            .OrderByDescending(r => r.Month)
            .FirstOrDefault();

        if (latestReport != null)
        {
            return $"📊 The latest sales report for {latestReport.Month:yyyy-MM} shows a revenue of **${latestReport.Revenue}**.";
        }

        string prompt = $@"
        You are an AI assistant specialized in CRM. Provide responses that are strictly related to
        customer relationship management, sales, and lead management. Here is the user's message: {userMessage}
        ";

        var salesReportFunction = _kernel.CreateFunctionFromPrompt(prompt, new OpenAIPromptExecutionSettings
        {
            Temperature = 0.7,
            MaxTokens = 1000,
        });

        KernelArguments arguments = new KernelArguments
        {
            { "user_message", userMessage }
        };

        var response = await _kernel.InvokeAsync(salesReportFunction, arguments);

        // Ensure a non-null response
        return response.GetValue<string>() ?? "No response from the AI assistant.";
    }
}
