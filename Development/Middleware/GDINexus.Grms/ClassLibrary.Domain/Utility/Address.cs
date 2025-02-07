#region Copyright GDI Nexus © 2025

//
// NAME:			Address.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Address Value Object
//

#endregion

using System.Text.Json.Serialization;
using ClassLibrary.Domain.User;

namespace ClassLibrary.Domain.Utility;

/// <summary>
///     Represents the <see cref="Address" /> class.
/// </summary>
[Serializable]
public class Address : ValueObject<Address>
{
    /// <summary>
    ///     Creates an instance of <see cref="Address" /> class.
    /// </summary>
    public Address()
    {
        UserAddresses = new HashSet<UserAddress>();
    }

    /// <summary>
    ///     Creates an instance of <see cref="Address" /> class.
    /// </summary>
    /// <param name="id">The Id.</param>
    /// <param name="address1">The Address1.</param>
    /// <param name="city">The City.</param>
    /// <param name="stateId">The StateId.</param>
    /// <param name="zip">The Zip.</param>
    /// <param name="countryId">The CountryId.</param>
    /// <param name="addressTypeId">The AddressTypeId.</param>
    public Address(Guid id, string address1, string city, Guid stateId, string zip, Guid countryId,
        Guid addressTypeId) : this()
    {
        Id = id;
        Address1 = address1;
        City = city;
        StateId = stateId;
        Zip = zip;
        CountryId = countryId;
        AddressTypeId = addressTypeId;
    }

    /// <summary>
    ///     Creates an instance of <see cref="Address" /> class.
    /// </summary>
    /// <param name="id">The Id.</param>
    /// <param name="address1">The Address1.</param>
    /// <param name="city">The City.</param>
    /// <param name="stateId">The StateId.</param>
    /// <param name="zip">The Zip.</param>
    /// <param name="countryId">The CountryId.</param>
    /// <param name="addressTypeId">The AddressTypeId.</param>
    /// <param name="createdOn">The CreatedOn.</param>
    /// <param name="changedOn">The ChangedOn.</param>
    public Address(Guid id, string address1, string city, Guid stateId, string zip, Guid countryId,
        Guid addressTypeId,
        DateTime createdOn, DateTime changedOn) : this(id, address1, city, stateId, zip, countryId, addressTypeId)
    {
        CreatedOn = createdOn;
        ChangedOn = changedOn;
    }

    /// <summary>
    ///     Creates an instance of <see cref="Address" /> class.
    /// </summary>
    /// <param name="id">The Id.</param>
    /// <param name="address1">The Address1.</param>
    /// <param name="address2"></param>
    /// <param name="city">The City.</param>
    /// <param name="stateId">The StateId.</param>
    /// <param name="zip">The Zip.</param>
    /// <param name="countryId">The CountryId.</param>
    /// <param name="addressTypeId">The AddressTypeId.</param>
    /// <param name="createdOn">The CreatedOn.</param>
    /// <param name="changedOn">The ChangedOn.</param>
    public Address(Guid id, string address1, string address2, string city, Guid stateId, string zip, Guid countryId,
        Guid addressTypeId,
        DateTime createdOn, DateTime changedOn) : this(id, address1, city, stateId, zip, countryId, addressTypeId,
        createdOn, changedOn)
    {
        Address2 = address2;
    }


    /// <summary>
    ///     The Id.
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    ///     The Address1.
    /// </summary>
    public required string Address1 { get; set; }


    /// <summary>
    ///     The Address2.
    /// </summary>
    public string? Address2 { get; set; }


    /// <summary>
    ///     The City.
    /// </summary>
    public required string City { get; set; }


    /// <summary>
    ///     The County.
    /// </summary>
    public string? County { get; set; }


    /// <summary>
    ///     The StateId.
    /// </summary>
    public Guid StateId { get; set; }


    /// <summary>
    ///     The Zip.
    /// </summary>
    public required string Zip { get; set; }


    /// <summary>
    ///     The CountryId.
    /// </summary>
    public Guid CountryId { get; set; }


    /// <summary>
    ///     The AddressTypeId.
    /// </summary>
    public Guid AddressTypeId { get; set; }


    /// <summary>
    ///     The Latitude.
    /// </summary>
    public decimal? Latitude { get; set; }


    /// <summary>
    ///     The Longitude.
    /// </summary>
    public decimal? Longitude { get; set; }


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
    ///     AddressType.
    /// </summary>
    public virtual ReferenceItem AddressType { get; set; }

    /// <summary>
    ///     Country.
    /// </summary>
    public virtual ReferenceItem Country { get; set; }

    /// <summary>
    ///     State.
    /// </summary>
    public virtual ReferenceItem State { get; set; }

    /// <summary>
    ///     UserAddresses
    /// </summary>
    [JsonIgnore]
    public virtual ICollection<UserAddress> UserAddresses { get; set; }
}