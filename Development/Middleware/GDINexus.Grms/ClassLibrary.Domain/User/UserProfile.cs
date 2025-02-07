#region Copyright GDI Nexus © 2025

//
// NAME:			UserProfile.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			UserProfile Value Object
//

#endregion

using ClassLibrary.Domain.Utility;
using System.Text.Json.Serialization;

namespace ClassLibrary.Domain.User;

/// <summary>
///     Represents the <see cref="UserProfile" /> class.
/// </summary>
[Serializable]
public class UserProfile : ValueObject<UserProfile>
{
    /// <summary>
    ///     Creates an instance of <see cref="UserProfile" /> class.
    /// </summary>
    public UserProfile()
    {
    }

    /// <summary>
    ///     Creates an instance of <see cref="UserProfile" /> class.
    /// </summary>
    /// <param name="firstName">The FirstName.</param>
    /// <param name="lastName">The LastName.</param>
    /// <param name="userTypeId">The UserTypeId.</param>
    /// <param name="genderId">The GenderId.</param>
    /// <param name="countryId">The CountryId.</param>
    public UserProfile(string firstName, string lastName, Guid userTypeId, Guid genderId,
        Guid countryId)
    {
        FirstName = firstName;
        LastName = lastName;
        UserTypeId = userTypeId;
        GenderId = genderId;
        CountryId = countryId;
    }

    /// <summary>
    ///     The UserId.
    /// </summary>
    public virtual Guid UserId { get; set; }


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
    ///     The UserTypeId.
    /// </summary>
    public Guid UserTypeId { get; set; }


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
    ///     The GenderId.
    /// </summary>
    public Guid GenderId { get; set; }

    /// <summary>
    ///     The CountryId.
    /// </summary>
    public Guid CountryId { get; set; }

    /// <summary>
    ///     The PictureUrl.
    /// </summary>
    public string? PictureUrl { get; set; }

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
    ///     User.
    /// </summary>
    [JsonIgnore]
    public virtual User User { get; set; }

    /// <summary>
    ///     Gender.
    /// </summary>
    public virtual ReferenceItem Gender { get; set; }

    /// <summary>
    ///     Country.
    /// </summary>
    public virtual ReferenceItem Country { get; set; }
    
    /// <summary>
    ///     UserType.
    /// </summary>
    public virtual ReferenceItem UserType { get; set; }
}