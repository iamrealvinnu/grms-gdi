using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.OpenAI;

public class AdminTasksHandler
{
    private readonly Kernel _kernel;

    public AdminTasksHandler(Kernel kernel)
    {
        _kernel = kernel;
    }

    public async Task HandleAdminTasksAsync(string userMessage)
    {
        // Example of asynchronous operation
        string prompt = "Handle admin task: " + userMessage;
        var response = await _kernel.InvokePromptAsync(prompt);
        Console.WriteLine(response.GetValue<string>());
    }
}
