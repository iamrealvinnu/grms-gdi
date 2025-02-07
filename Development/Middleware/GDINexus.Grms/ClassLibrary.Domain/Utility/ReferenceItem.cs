#region Copyright GDI Nexus © 2025

//
// NAME:			ReferenceItem.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			ReferenceItem Value Object
//

#endregion

using System.Text.Json.Serialization;
using ClassLibrary.Domain.User;

namespace ClassLibrary.Domain.Utility;

/// <summary>
///     Represents the <see cref="ReferenceItem" /> class.
/// </summary>
[Serializable]
public class ReferenceItem : ValueObject<ReferenceItem>
{
    /// <summary>
    ///     Creates an instance of <see cref="ReferenceItem" /> class.
    /// </summary>
    public ReferenceItem()
    {
        UserProfileCountry = new HashSet<UserProfile>();
        UserProfileGender = new HashSet<UserProfile>();
        UserProfileUserType = new HashSet<UserProfile>();
        AddressState = new HashSet<Address>();
        AddressCountry = new HashSet<Address>();
        AddressType = new HashSet<Address>();
    }

    /// <summary>
    ///     Creates an instance of <see cref="ReferenceItem" /> class.
    /// </summary>
    /// <param name="referenceId">The ReferenceId.</param>
    /// <param name="code">The Code.</param>
    /// <param name="description">The Description.</param>
    /// <param name="createdOn">The CreatedOn.</param>
    /// <param name="changedOn">The ChangedOn.</param>
    public ReferenceItem(Guid referenceId, string code, string description, DateTime createdOn,
        DateTime changedOn) : this()
    {
        ReferenceId = referenceId;
        Code = code;
        Description = description;
        CreatedOn = createdOn;
        ChangedOn = changedOn;
    }

    /// <summary>
    ///     The ReferenceId.
    /// </summary>
    public Guid ReferenceId { get; set; }


    /// <summary>
    ///     The Code.
    /// </summary>
    public required string Code { get; set; }


    /// <summary>
    ///     The Description.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    ///     The SortOrder.
    /// </summary>
    public string? SortOrder { get; set; }


    /// <summary>
    ///     The Archived.
    /// </summary>
    public DateTime? Archived { get; set; }


    /// <summary>
    ///     The CreatedOn.
    /// </summary>
    public DateTime CreatedOn { get; set; }


    /// <summary>
    ///     The ChangedOn.
    /// </summary>
    public DateTime ChangedOn { get; set; }


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
    ///     The Id.
    /// </summary>
    public virtual Guid Id { get; set; }

    /// <summary>
    ///     Reference.
    /// </summary>
    [JsonIgnore]
    public virtual Reference Reference { get; set; }

    /// <summary>
    ///     The UserProfileCountry.
    /// </summary>
    [JsonIgnore]
    public virtual ICollection<UserProfile> UserProfileCountry { get; set; }

    /// <summary>
    ///     The UserProfileGender.
    /// </summary>
    [JsonIgnore]
    public virtual ICollection<UserProfile> UserProfileGender { get; set; }

    /// <summary>
    ///     The UserProfileUserType
    /// </summary>
    [JsonIgnore]
    public virtual ICollection<UserProfile> UserProfileUserType { get; set; }

    /// <summary>
    ///     AddressType.
    /// </summary>
    [JsonIgnore]
    public virtual ICollection<Address> AddressType { get; set; }

    /// <summary>
    ///     AddressState.
    /// </summary>
    [JsonIgnore]
    public virtual ICollection<Address> AddressState { get; set; }

    /// <summary>
    ///     AddressCountry.
    /// </summary>
    [JsonIgnore]
    public virtual ICollection<Address> AddressCountry { get; set; }
}