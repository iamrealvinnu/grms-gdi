using Microsoft.SemanticKernel;
using System;
using System.Threading.Tasks;

public class MeetingScheduler
{
    private readonly Kernel _kernel;
    private readonly CRMData _crmData;

    public MeetingScheduler(Kernel kernel, CRMData crmData)
    {
        _kernel = kernel;
        _crmData = crmData;
    }

    public Task<string> ScheduleMeetingAsync(string title, string date, string client)
    {
        if (!DateTime.TryParse(date, out DateTime parsedDate))
        {
            return Task.FromResult("Invalid date format. Please provide a valid date.");
        }

        var newMeeting = new Meeting
        {
            Title = title,
            Date = parsedDate,
            Client = client
        };

        _crmData.Meetings.Add(newMeeting);

        return Task.FromResult($"Meeting '{title}' scheduled on {parsedDate:yyyy-MM-dd} with {client}.");
    }
}
