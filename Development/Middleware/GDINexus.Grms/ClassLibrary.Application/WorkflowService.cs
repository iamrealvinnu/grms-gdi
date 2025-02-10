#region Copyright GDI Nexus © 2025

//
// NAME:			WorkflowService.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Workflow Service
//

#endregion

using ClassLibrary.Core.Communication;
using ClassLibrary.Core.Repository;
using ClassLibrary.Core.Workflow;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RulesEngine.Actions;
using RulesEngine.Models;

namespace ClassLibrary.Application;

/// <summary>
///     Represents the <see cref="WorkflowService" /> Service
/// </summary>
public class WorkflowService : IWorkflowService
{
    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="workflowConfiguration"></param>
    /// <param name="emailService"></param>
    /// <param name="uowRepository"></param>
    public WorkflowService(IOptions<WorkflowConfiguration> workflowConfiguration,
        IEmailService emailService, IUnitOfWork uowRepository)
    {
        //Task.Run(() => emailService.Send("Test", "Test", "test@test.com", new List<string> { "test@test.com" })).Wait();

        // Setup the actions
        var bre = new RulesEngine.RulesEngine(new ReSettings
        {
            CustomActions = new Dictionary<string, Func<ActionBase>>
            {
                //{ nameof(WorkflowActionEmailUser), () => new WorkflowActionEmailUser(emailService) },
            }
        });

        var files = Directory.GetFiles(workflowConfiguration.Value.Directory, workflowConfiguration.Value.Pattern,
            SearchOption.AllDirectories);
        if (files == null || files.Length == 0)
            throw new Exception("Rules not found.");

        foreach (var file in files)
        {
            var fileData = File.ReadAllText(file);
            bre.AddWorkflow(JsonConvert.DeserializeObject<List<Workflow>>(fileData)!.ToArray());
        }

        Bre = bre;
    }

    /// <summary>
    ///     Bre.
    /// </summary>
    public RulesEngine.RulesEngine Bre { get; }
}