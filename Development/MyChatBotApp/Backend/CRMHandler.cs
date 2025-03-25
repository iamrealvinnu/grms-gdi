using Microsoft.SemanticKernel;
using MyChatBotApp.Backend;
using System.Linq;
using System.Threading.Tasks;

namespace MyChatBotApp.Backend
{
    // Handles CRM-related operations, such as retrieving customer details.
    public class CRMHandler
    {
        private readonly CRMData _crmData; // Singleton instance of CRM data loaded from the database.
        private readonly Kernel? _kernel; // Optional Semantic Kernel for potential AI enhancements (currently unused).

        // Constructor: Initializes the handler with CRM data and an optional Semantic Kernel.
        public CRMHandler(CRMData crmData, Kernel? kernel)
        {
            _crmData = crmData ?? new CRMData(); // Use provided CRM data, or fall back to an empty object if null.
            _kernel = kernel; // Store the kernel for future AI-driven CRM tasks if needed.
        }

        // Retrieves customer details by name from the CRM data.
        // Invoked by LeadManager for the "find" intent (e.g., "find John Doe").
        public async Task<string?> GetCustomerDetailsAsync(string customerName)
        {
            await Task.CompletedTask; // Ensures the method adheres to async signature (no async operations yet).

            // Search for a customer by name (case-insensitive) in the CRM data.
            var customer = _crmData.Customers.FirstOrDefault(c => c.Name.ToLower() == customerName.ToLower());

            // Return formatted customer details if found, or null if not found.
            return customer != null ? $"Customer: {customer.Name}, Email: {customer.Email}, Phone: {customer.Phone}" : null;
        }
    }
}