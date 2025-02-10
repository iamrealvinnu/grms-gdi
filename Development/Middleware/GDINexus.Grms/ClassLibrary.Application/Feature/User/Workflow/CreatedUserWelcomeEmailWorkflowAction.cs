#region Copyright GDI Nexus © 2025

//
// NAME:			CreatedUserWelcomeEmailWorkflowAction.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Created user welcome email workflow action
//

#endregion

using ClassLibrary.Core.Communication;
using RulesEngine.Actions;
using RulesEngine.Models;

namespace ClassLibrary.Application.Feature.User.Workflow;

/// <summary>
///     Represents the <see cref="CreatedUserWelcomeEmailWorkflowAction" /> Action
/// </summary>
public class CreatedUserWelcomeEmailWorkflowAction : ActionBase
{
    /// <summary>
    ///     EmailService.
    /// </summary>
    private readonly IEmailService _emailService;

    /// <summary>
    ///     Constructor.
    /// </summary>
    public CreatedUserWelcomeEmailWorkflowAction(IEmailService emailService)
    {
        _emailService = emailService;
    }

    /// <summary>
    ///     ValueTask.
    /// </summary>
    public override async ValueTask<object> Run(ActionContext context, RuleParameter[] ruleParameters)
    {
        try
        {
            var customInputSubject = context.GetContext<string>("customInputSubject");
            var customInputMessage = context.GetContext<string>("customInputMessage");
            var customInputFrom = context.GetContext<string>("customInputFrom");
            var customInputRecipients = context.GetContext<string[]>("customInputRecipients");

            // //Add your custom logic here
            var param = ruleParameters.Where(p => p.Name == "input1").FirstOrDefault().Value;
            customInputMessage = customInputMessage.Replace("{NAME}",
                $"{((Domain.User.User)param).Profile?.FirstName} {((Domain.User.User)param).Profile?.LastName}");
            await _emailService.Send(customInputSubject, customInputMessage, customInputFrom, customInputRecipients);
            // return new ValueTask<object>(await Task.FromResult(_emailService.Send(customInputSubject, customInputMessage,
            //     customInputFrom, customInputRecipients)));
            return new ValueTask<object>(await Task.FromResult<string>("Email Sent Out!"));
        }
        catch (Exception e)
        {
            return new ValueTask<object>(await Task.FromException<string>(e));
        }
    }
}