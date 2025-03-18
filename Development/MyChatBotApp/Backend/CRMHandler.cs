using Microsoft.SemanticKernel;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MyChatBotApp.Backend
{
    public class CRMHandler
    {
        private readonly CRMData _crmData;

        public CRMHandler(CRMData crmData)
        {
            _crmData = crmData ?? throw new ArgumentNullException(nameof(crmData));
        }

        [KernelFunction]
        public string GetCustomerDetails(string message)
        {
            if (string.IsNullOrWhiteSpace(message))
            {
                return "Invalid customer name.";
            }

            // Clean up "find me" or "find" from the message
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
}