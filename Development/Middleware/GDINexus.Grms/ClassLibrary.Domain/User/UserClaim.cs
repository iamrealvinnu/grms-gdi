#region Copyright GDI Nexus © 2025

//
// NAME:			UserClaim.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			User Claim Value Object
//

#endregion

using System.Text.Json.Serialization;

namespace ClassLibrary.Domain.User;

/// <summary>
///     Represents the <see cref="UserClaim" /> class.
/// </summary>
[Serializable]
public class UserClaim : ValueObject<UserClaim>
{
    /// <summary>
    ///     Creates an instance of <see cref="UserClaim" /> class.
    /// </summary>
    public UserClaim()
    {
    }


    /// <summary>
    ///     Creates an instance of <see cref="UserClaim" /> class.
    /// </summary>
    /// <param name="userId">The UserId.</param>
    /// <param name="claimType">The ClaimType.</param>
    /// <param name="claimValue">The ClaimValue.</param>
    public UserClaim(Guid userId, string claimType, string claimValue):this()
    {
        UserId = userId;
        ClaimType = claimType;
        ClaimValue = claimValue;
    }


    /// <summary>
    ///     The UserId.
    /// </summary>
    public Guid UserId { get; set; }


    /// <summary>
    ///     The ClaimType.
    /// </summary>
    public required string ClaimType { get; set; }


    /// <summary>
    ///     The ClaimValue.
    /// </summary>
    public required string ClaimValue { get; set; }

    /// <summary>
    ///     The User.
    /// </summary>
    [JsonIgnore]
    public virtual User User { get; set; }
}