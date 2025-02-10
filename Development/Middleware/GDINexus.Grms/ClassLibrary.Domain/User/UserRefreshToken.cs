#region Copyright GDI Nexus © 2025

//
// NAME:			UserRefreshToken.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/27/2025
// PURPOSE:			User Refresh Token Value Object
//

#endregion


using System.Text.Json.Serialization;

namespace ClassLibrary.Domain.User;

/// <summary>
///     Represents the <see cref="UserRefreshToken" /> class.
/// </summary>
[Serializable]
public class UserRefreshToken : ValueObject<UserRefreshToken>
{
    /// <summary>
    ///     Creates an instance of <see cref="UserRefreshToken" /> class.
    /// </summary>
    public UserRefreshToken()
    {
    }

    /// <summary>
    ///     Creates an instance of <see cref="UserRefreshToken" /> class.
    /// </summary>
    /// <param name="userId">The UserId.</param>
    /// <param name="code">The Code.</param>
    /// <param name="expiration">The Expiration.</param>
    public UserRefreshToken(Guid userId, string code, DateTime expiration) : this()
    {
        UserId = userId;
        Code = code;
        Expiration = expiration;
    }

    /// <summary>
    ///     The UserId.
    /// </summary>
    public Guid UserId { get; set; }


    /// <summary>
    ///     The Code.
    /// </summary>
    public required string Code { get; set; }


    /// <summary>
    ///     The Expiration.
    /// </summary>
    public DateTime Expiration { get; set; }

    /// <summary>
    ///     The User.
    /// </summary>
    [JsonIgnore]
    public virtual User User { get; set; }
}