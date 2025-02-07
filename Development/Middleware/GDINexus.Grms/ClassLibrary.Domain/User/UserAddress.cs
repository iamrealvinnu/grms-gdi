#region Copyright GDI Nexus © 2025

//
// NAME:			UserAddress.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			User Address Value Object
//

#endregion

using System.Text.Json.Serialization;
using ClassLibrary.Domain.Utility;

namespace ClassLibrary.Domain.User;

/// <summary>
///     Represents the <see cref="UserAddress" /> class.
/// </summary>
[Serializable]
public class UserAddress : ValueObject<UserAddress>
{
    /// <summary>
    ///     Creates an instance of <see cref="UserAddress" /> class.
    /// </summary>
    public UserAddress()
    {
    }


    /// <summary>
    ///     Creates an instance of <see cref="UserAddress" /> class.
    /// </summary>
    /// <param name="userId">The UserId.</param>
    /// <param name="addressId">The AddressId.</param>
    /// <param name="preffered">The Preffered.</param>
    public UserAddress(Guid userId, Guid addressId, bool preffered = true) : this()
    {
        UserId = userId;
        AddressId = addressId;
        Preffered = preffered;
    }

    /// <summary>
    ///     The UserId.
    /// </summary>
    public Guid UserId { get; set; }


    /// <summary>
    ///     The AddressId.
    /// </summary>
    public Guid AddressId { get; set; }


    /// <summary>
    ///     The Preffered.
    /// </summary>
    public bool? Preffered { get; set; }

    /// <summary>
    ///     The Address.
    /// </summary>
    public virtual Address Address { get; set; }

    /// <summary>
    ///     The User.
    /// </summary>
    [JsonIgnore]
    public virtual User User { get; set; }
}