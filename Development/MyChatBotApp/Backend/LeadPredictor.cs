using System;

namespace MyChatBotApp.Backend
{
    // Predicts the likelihood of a lead converting based on interactions and provides a recommendation.
    public class LeadPredictor
    {
        // Calculates the conversion probability for a lead and provides a recommendation.
        public (double Probability, string Recommendation) PredictLeadConversion(Lead lead)
        {
            // Start with a base probability of 10%.
            double probability = 10.0;

            // Factor 1: Messages Sent (each message adds 5% to the probability, up to 20%).
            probability += Math.Min(lead.MessagesSent * 5, 20);

            // Factor 2: Calls Made (each call adds 10% to the probability, up to 30%).
            probability += Math.Min(lead.CallsMade * 10, 30);

            // Factor 3: Meetings Held (each meeting adds 15% to the probability, up to 30%).
            probability += Math.Min(lead.MeetingsHeld * 15, 30);

            // Factor 4: Status (Qualified leads get a 10% boost).
            if (lead.Status.ToLower() == "qualified")
                probability += 10;

            // Factor 5: Recency of Last Interaction (within 7 days adds 10%).
            if (lead.LastInteraction != DateTime.MinValue && (DateTime.Now - lead.LastInteraction).TotalDays <= 7)
                probability += 10;

            // Cap the probability at 100%.
            probability = Math.Min(probability, 100);

            // Determine the recommendation based on the probability.
            string recommendation;
            if (probability >= 70)
                recommendation = "Proceed with high confidence - this lead is very likely to convert.";
            else if (probability >= 40)
                recommendation = "Proceed with caution - this lead has a moderate chance of converting.";
            else
                recommendation = "Consider pausing efforts - this lead has a low chance of converting.";

            return (probability, recommendation); // Return the calculated probability and recommendation.
        }
    }
}