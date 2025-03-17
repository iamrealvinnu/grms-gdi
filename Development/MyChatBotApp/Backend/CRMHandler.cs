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

        [KernelFunction]  // Add this attribute
        public string GetCustomerDetails(string customerName)
        {
            if (string.IsNullOrWhiteSpace(customerName))
            {
                return "Invalid customer name.";
            }

            var customer = _crmData?.Customers?.FirstOrDefault(c =>
                c.Name.Equals(customerName, StringComparison.OrdinalIgnoreCase));

            return customer != null
                ? $"Customer Details: Name={customer.Name}, Email={customer.Email}, Phone={customer.Phone}"
                : "Customer not found.";
        }
    }
}
