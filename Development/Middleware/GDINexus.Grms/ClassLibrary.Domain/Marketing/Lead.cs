#region Copyright GDI Nexus © 2025

//
// NAME:			Lead.cs
// AUTHOR:			Shanjanaa
// COMPANY:			GDI Nexus
// DATE:			02/13/2025
// PURPOSE:			User Entity
//

#endregion

using System.Text.Json.Serialization;
using ClassLibrary.Domain.Marketing;

namespace ClassLibrary.Domain.Marketing;

/// <summary>
///     Represents the <see cref="Lead" /> class.
/// </summary>
[Serializable]
public class Lead : Entity<Guid>, IAggregateRoot
{
    /// <summary>
    ///     Creates an instance of <see cref="Lead" /> class.
    /// </summary>
    public Lead()
    {
    }

    /// <summary>
    ///     The FirstName.
    /// </summary>
    public required string FirstName { get; set; }


    /// <summary>
    ///     The LastName.
    /// </summary>
    public required string LastName { get; set; }


    /// <summary>
    ///     The Degree.
    /// </summary>
    public string? Degree { get; set; }

    /// <summary>
    ///     The Title.
    /// </summary>
    public string? Title { get; set; }


    /// <summary>
    ///     The Suffix.
    /// </summary>
    public string? Suffix { get; set; }


    /// <summary>
    ///     The Prefix.
    /// </summary>
    public string? Prefix { get; set; }

    /// <summary>
    ///     The PrefferedName.
    /// </summary>
    public string? PrefferedName { get; set; }

    /// <summary>
    ///     The Dob.
    /// </summary>
    public DateTime? Dob { get; set; }

    /// <summary>
    ///     The Company.
    /// </summary>
    public string? Company { get; set; }

    /// <summary>
    ///     The Email.
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    ///     The EmailConfirmed.
    /// </summary>
    public bool EmailConfirmed { get; set; }

    /// <summary>
    ///     The PhoneNumber.
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    ///     The PhoneNumberConfirmed.
    /// </summary>
    public bool PhoneNumberConfirmed { get; set; }

    /// <summary>
    ///     The MobileNumber.
    /// </summary>
    public string? MobileNumber { get; set; }

    /// <summary>
    ///     The MobileNumberConfirmed.
    /// </summary>
    public bool MobileNumberConfirmed { get; set; }

    /// <summary>
    ///     The DoNotCall.
    /// </summary>
    public bool DoNotCall { get; set; }

    /// <summary>
    ///     The DoNotEmail.
    /// </summary>
    public bool DoNotEmail { get; set; }

    /// <summary>
    ///     The CampaignId.
    /// </summary>
    public Guid? CampaignId { get; set; }

    /// <summary>
    ///     The AssignedToId.
    /// </summary>
    public Guid? AssignedToId { get; set; }

    /// <summary>
    ///     The CreatedOnUtc.
    /// </summary>
    public DateTime CreatedOnUtc { get; set; }


    /// <summary>
    ///     The ChangedOnUtc.
    /// </summary>
    public DateTime ChangedOnUtc { get; set; }

    /// <summary>
    ///     The DeletedOn.
    /// </summary>
    public DateTime? DeletedOn { get; set; }

    /// <summary>
    ///     The CreatedById.
    /// </summary>
    public Guid CreatedById { get; set; }

    /// <summary>
    ///     The ModifiedById.
    /// </summary>
    public Guid ModifiedById { get; set; }

    /// <summary>
    ///     The Udf1.
    /// </summary>
    public string? Udf1 { get; set; }


    /// <summary>
    ///     The Udf2.
    /// </summary>
    public string? Udf2 { get; set; }


    /// <summary>
    ///     The Udf3.
    /// </summary>
    public string? Udf3 { get; set; }

}