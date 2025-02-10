#region Copyright GDI Nexus © 2025

//
// NAME:			IEmailService.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Email Service Interface
//

#endregion

namespace ClassLibrary.Core.Communication;

/// <summary>
///     Represents the <see cref="IEmailService" />
/// </summary>
public interface IEmailService
{
    /// <summary>
    ///     Send
    /// </summary>
    /// <param name="subject"></param>
    /// <param name="message"></param>
    /// <param name="from"></param>
    /// <param name="recipients"></param>
    /// <param name="attachments"></param>
    /// <returns></returns>
    Task Send(string subject, string message, string from, IList<string> recipients,
        Dictionary<string, string>? attachments = null);
}