#region Copyright GDI Nexus © 2025

//
// NAME:			CreatedUserNotification.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Created user notification
//

#endregion

using ClassLibrary.Core.Repository;
using ClassLibrary.Core.Workflow;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RulesEngine.Models;

namespace ClassLibrary.Application.Feature.User.Notification;

/// <summary>
///     Represents the <see cref="CreatedUserNotification" /> Command.
/// </summary>
public class CreatedUserNotification : INotification
{
    /// <summary>
    ///     Id.
    /// </summary>
    private readonly Guid _id;

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="id"></param>
    public CreatedUserNotification(Guid id)
    {
        _id = id;
    }


    /// <summary>
    ///     Represents the <see cref="CreatedUserNotificationHandler" /> Command.
    /// </summary>
    public class CreatedUserNotificationHandler : INotificationHandler<CreatedUserNotification>
    {
        /// <summary>
        ///     Logger.
        /// </summary>
        private readonly ILogger<CreatedUserNotificationHandler> _logger;

        /// <summary>
        ///     Unit of work.
        /// </summary>
        private readonly IUnitOfWork _uowRepository;

        /// <summary>
        ///     Workflow service
        /// </summary>
        private readonly IWorkflowService _workflowService;

        /// <summary>
        ///     Constructor.
        /// </summary>
        /// <param name="uowRepository"></param>
        /// <param name="workflowService"></param>
        /// <param name="logger"></param>
        public CreatedUserNotificationHandler(IUnitOfWork uowRepository, IWorkflowService workflowService,
            ILogger<CreatedUserNotificationHandler> logger)
        {
            _uowRepository = uowRepository;
            _workflowService = workflowService;
            _logger = logger;
        }

        /// <summary>
        ///     Handle.
        /// </summary>
        /// <param name="notification"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task Handle(CreatedUserNotification notification, CancellationToken cancellationToken)
        {
            var workflows = new List<string>
            {
                "CreatedUserWorkflow"
            };

            var specification = new Specification<Domain.User.User>();
            specification.Conditions.Add(e => e.Id == notification._id);
            specification.Includes = ep => ep.Include(e => e.Profile).Include(e => e.Claims);
            var found = await _uowRepository.Repository<Domain.User.User>().GetEntityAsync(specification, true);
            if (found.Id != Guid.Empty)
                foreach (var workflow in workflows)
                {
                    List<RuleResultTree> resultList =
                        await _workflowService.Bre.ExecuteAllRulesAsync(workflow, found);
                    var resultEvent = string.Empty;
                    resultList.ForEach(l =>
                    {
                        resultEvent += l.Rule.RuleName + "   ";
                        resultEvent += l.ActionResult.Output + "   ";
                        resultEvent += l.Rule.SuccessEvent + "   ";
                    });
                    _logger.LogInformation($"Workflow: {resultEvent}");
                }
        }
    }
}