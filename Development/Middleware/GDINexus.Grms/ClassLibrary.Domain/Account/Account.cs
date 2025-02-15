#region Copyright GDI Nexus © 2025

//
// NAME:			Account.cs
// AUTHOR:			Shanjanaa
// COMPANY:			GDI Nexus
// DATE:			02/13/2025
// PURPOSE:			User Entity
//

#endregion

using ClassLibrary.Domain.Marketing;

namespace ClassLibrary.Domain.Account;

/// <summary>
///     Represents the <see cref="Account" /> class.
/// </summary>
[Serializable]
public class Account : Entity<Guid>, IAggregateRoot
{
    /// <summary>
    ///     Constructor
    /// </summary>
    public Account()
    {
        Contacts = new HashSet<Contact>();
        
    }

    

    /// <summary>
    ///     The ParentId.
    /// </summary>
    public Guid? ParentId { get; set; }

    /// <summary>
    ///     The Name.
    /// </summary>
    public required string Name { get; set; }


    /// <summary>
    ///     The Description.
    /// </summary>
    public string? Description { get; set; }


    /// <summary>
    ///     The AccountNumber.
    /// </summary>
    public string? AccountNumber { get; set; }


    /// <summary>
    ///     The AccountTypeId.
    /// </summary>
    public Guid AccountTypeId { get; set; }

    /// <summary>
    ///     The Industry.
    /// </summary>
    public Guid Industry { get; set; }

    /// <summary>
    ///     The AnnualRevenue.
    /// </summary>
    public decimal? AnnualRevenue { get; set; }


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
    ///     The Url.
    /// </summary>
    public string? Url { get; set; }

    /// <summary>
    ///     The OwnershipId.
    /// </summary>
    public Guid OwnershipTypeId { get; set; }

    /// <summary>
    ///     The NumberOfEmployees.
    /// </summary>
    public int? NumberOfEmployees { get; set; }

    /// <summary>
    ///     The CampaignId.
    /// </summary>
    public Guid? CampaignId { get; set; }


    /// <summary>
    ///     The DoNotCall.
    /// </summary>
    public bool DoNotCall { get; set; }

    /// <summary>
    ///     The DoNotEmail.
    /// </summary>
    public bool DoNotEmail { get; set; }

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
    ///     The CreatedBy.
    /// </summary>
    public Guid CreatedById { get; set; }

    /// <summary>
    ///     The ModifiedBy.
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

    /// <summary>
    /// The Contacts
    /// </summary>
    public virtual ICollection<Contact> Contacts { get; set; }

}