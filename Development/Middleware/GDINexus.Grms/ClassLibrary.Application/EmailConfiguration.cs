#region Copyright GDI Nexus © 2025

//
// NAME:			EmailConfiguration.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Email configuration 
//

#endregion

namespace ClassLibrary.Application;

/// <summary>
///     Represents the <see cref="EmailConfiguration" />
/// </summary>
public class EmailConfiguration
{
    /// <summary>
    ///     Server.
    /// </summary>
    public required string Server { get; set; }

    /// <summary>
    ///     Port.
    /// </summary>
    public int Port { get; set; }

    /// <summary>
    ///     Ssl.
    /// </summary>
    public bool Ssl { get; set; }

    /// <summary>
    ///     UserName.
    /// </summary>
    public required string UserName { get; set; }

    /// <summary>
    ///     Password.
    /// </summary>
    public required string Password { get; set; }
}