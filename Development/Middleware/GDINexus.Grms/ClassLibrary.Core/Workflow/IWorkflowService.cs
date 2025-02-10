#region Copyright GDI Nexus © 2025

//
// NAME:			IWorkflowService.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Workflow Interface
//

#endregion

namespace ClassLibrary.Core.Workflow;

/// <summary>
///     Represents the <see cref="IWorkflowService" /> Service
/// </summary>
public interface IWorkflowService
{
    /// <summary>
    ///     Business rule engine.
    /// </summary>
    RulesEngine.RulesEngine Bre { get; }
}