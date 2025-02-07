#region Copyright GDI Nexus © 2025

//
// NAME:			User.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			User Entity
//

#endregion

namespace ClassLibrary.Domain.User;

/// <summary>
///     Represents the <see cref="User" /> class.
/// </summary>
[Serializable]
public class User : Entity<Guid>, IAggregateRoot
{
    /// <summary>
    ///     Constructor
    /// </summary>
    public User()
    {
        Claims = new HashSet<UserClaim>();
        Addresses = new HashSet<UserAddress>();
        RefreshTokens = new HashSet<UserRefreshToken>();
    }

    /// <summary>
    ///     The UserName.
    /// </summary>
    public required string UserName { get; set; }


    /// <summary>
    ///     The Email.
    /// </summary>
    public required string Email { get; set; }


    /// <summary>
    ///     The EmailConfirmed.
    /// </summary>
    public bool EmailConfirmed { get; set; }


    /// <summary>
    ///     The PasswordHash.
    /// </summary>
    public required string PasswordHash { get; set; }


    /// <summary>
    ///     The SecurityStamp.
    /// </summary>
    public required string SecurityStamp { get; set; }


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
    ///     The NationalId.
    /// </summary>
    public string? NationalId { get; set; }

    /// <summary>
    ///     The NationalIdVerificationDateUtc.
    /// </summary>
    public DateTime? NationalIdVerificationDateUtc { get; set; }


    /// <summary>
    ///     The TwoFactorEnabled.
    /// </summary>
    public bool TwoFactorEnabled { get; set; }


    /// <summary>
    ///     The LockoutEndDateUtc.
    /// </summary>
    public DateTime? LockoutEndDateUtc { get; set; }


    /// <summary>
    ///     The LockoutEnabled.
    /// </summary>
    public bool LockoutEnabled { get; set; }


    /// <summary>
    ///     The AccessFailedCount.
    /// </summary>
    public int AccessFailedCount { get; set; }


    /// <summary>
    ///     The CreatedOn.
    /// </summary>
    public DateTime CreatedOn { get; set; }


    /// <summary>
    ///     The ChangedOn.
    /// </summary>
    public DateTime ChangedOn { get; set; }


    /// <summary>
    ///     The DeletedOn.
    /// </summary>
    public DateTime? DeletedOn { get; set; }


    /// <summary>
    ///     The DeactivatedDate.
    /// </summary>
    public DateTime? DeactivatedDate { get; set; }


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
    ///     Gets or sets the user profile.
    /// </summary>
    public virtual UserProfile? Profile { get; set; }

    /// <summary>
    ///     The UserClaim
    /// </summary>
    public virtual ICollection<UserClaim> Claims { get; set; }

    /// <summary>
    ///     The UserAddress
    /// </summary>
    public virtual ICollection<UserAddress> Addresses { get; set; }

    // <summary>
    /// The RefreshTokens
    /// </summary>
    public virtual ICollection<UserRefreshToken> RefreshTokens { get; set; }
}