#region Copyright GDI Nexus © 2025

//
// NAME:			Campaign.cs
// AUTHOR:			Shanjanaa
// COMPANY:			GDI Nexus
// DATE:			02/13/2025
// PURPOSE:			User Entity
//

#endregion

namespace ClassLibrary.Domain.Marketing;

/// <summary>
///     Represents the <see cref="Campaign" /> class.
/// </summary>
[Serializable]
public class Campaign : Entity<Guid>, IAggregateRoot
{
    /// <summary>
    ///     Constructor
    /// </summary>
    public Campaign()
    {
        Lead = new HashSet<Lead>();

    }

    /// <summary>
    ///     The Name.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    ///     The Description.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    ///     The StartDate.
    /// </summary>
    public DateTime StartDate{ get; set; }

    /// <summary>
    ///     The EndDate.
    /// </summary>
    public DateTime EndDate { get; set; }

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