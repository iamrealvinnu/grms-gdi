using Microsoft.SemanticKernel;
using MyChatBotApp.Backend;
using System.Threading.Tasks;
using System.Linq;

namespace MyChatBotApp.Backend
{
    // Handles requests for generating and retrieving sales reports from the CRM database.
    public class SalesReportHandler
    {
        private readonly Kernel _kernel; // Semantic Kernel instance for potential AI-driven sales analysis (currently unused).
        private readonly CRMData _crmData; // Singleton instance of CRM data loaded from the database.

        // Constructor: Initializes the handler with a Semantic Kernel and CRM data.
        public SalesReportHandler(Kernel kernel, CRMData crmData)
        {
            _kernel = kernel ?? throw new ArgumentNullException(nameof(kernel)); // Ensure the kernel is not null.
            _crmData = crmData ?? new CRMData(); // Use provided CRM data, or fall back to an empty object if null.
        }

        // Processes a request to generate or retrieve a sales report from the database.
        public async Task<string?> HandleSalesReportAsync(string userMessage)
        {
            await Task.CompletedTask; // Ensures the method adheres to async signature (no async operations yet).

            // Check if there are any sales reports available in the CRM data.
            if (_crmData.SalesReports == null || !_crmData.SalesReports.Any())
                return "No sales reports available in the database.";

            // Retrieve the latest sales report based on the month (simple implementation for now).
            var latestReport = _crmData.SalesReports.OrderByDescending(r => r.Month).FirstOrDefault();
            if (latestReport != null)
            {
                return $"Latest Sales Report ({latestReport.Month:yyyy-MM}): Revenue: ${latestReport.Revenue:F2}"; // Return formatted report details.
            }
            return "No sales report available for the requested period."; // Return error if no report is found.
        }
    }
}