// FeedbackManager.cs
// Manages user feedback, storing it in the CRM data.

using Serilog;
using System;
using System.Linq;

namespace MyChatBotApp
{
    public class FeedbackManager
    {
        private readonly CRMData _crmData;

        public FeedbackManager(CRMData crmData)
        {
            _crmData = crmData ?? throw new ArgumentNullException(nameof(crmData));
        }

        public void AddFeedback(string userId, string message, string feedback)
        {
            var feedbackEntry = new Feedback
            {
                Id = _crmData.Feedbacks.Count + 1,
                UserId = userId,
                Message = message,
                UserFeedback = feedback,
                SubmittedAt = DateTime.Now
            };
            _crmData.Feedbacks.Add(feedbackEntry);
            Log.Information("Feedback recorded: User {UserId}, Message: {Message}, Feedback: {Feedback}", userId, message, feedback);
        }
    }
}