#region Copyright GDI Nexus © 2025

//
// NAME:			WorkflowConfiguration.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Workflow configuration 
//

#endregion

namespace ClassLibrary.Application;

/// <summary>
///     Represents the <see cref="WorkflowConfiguration" />
/// </summary>
public class WorkflowConfiguration
{
    /// <summary>
    ///     Gets or sets the directory.
    /// </summary>
    public required string Directory { get; set; }

    /// <summary>
    ///     Gets or sets the pattern.
    /// </summary>
    public required string Pattern { get; set; }
}