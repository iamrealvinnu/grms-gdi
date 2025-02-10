#region Copyright GDI Nexus © 2025

//
// NAME:			EmailService.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Email Service
//

#endregion

using System.Net;
using System.Net.Mail;
using ClassLibrary.Core.Communication;
using FluentEmail.Core;
using FluentEmail.Smtp;
using Microsoft.Extensions.Options;

namespace ClassLibrary.Application;

/// <summary>
///     Represents the <see cref="EmailService" /> Service
/// </summary>
public class EmailService : IEmailService
{
    /// <summary>
    ///     Email.
    /// </summary>
    private readonly Email _email;

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="emailConfiguration"></param>
    public EmailService(IOptions<EmailConfiguration> emailConfiguration)
    {
        _email = new Email
        {
            Sender = new SmtpSender(() => new SmtpClient(emailConfiguration.Value.Server)
            {
                EnableSsl = emailConfiguration.Value.Ssl,
                Port = emailConfiguration.Value.Port,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials =
                    new NetworkCredential(emailConfiguration.Value.UserName, emailConfiguration.Value.Password)
            })
        };
    }

    /// <summary>
    ///     Send.
    /// </summary>
    /// <param name="subject"></param>
    /// <param name="message"></param>
    /// <param name="from"></param>
    /// <param name="recipients"></param>
    /// <param name="attachments"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public async Task Send(string subject, string message, string from, IList<string> recipients,
        Dictionary<string, string>? attachments = null)
    {
        _email.SetFrom(from);
        _email.To(recipients.FirstOrDefault());
        _email.Subject(subject);
        _email.Body(message, true);
        if (recipients.Count > 1)
            foreach (var recipient in recipients.Skip(1))
                _email.CC(recipient);

        if (attachments != null && attachments.Any())
            foreach (var attachment in attachments)
                _email.AttachFromFilename(attachment.Key, null, attachment.Value);
        await _email.SendAsync();
    }
}