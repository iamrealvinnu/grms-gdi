#region Copyright GDI Nexus © 2025

//
// NAME:			Reference.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Reference Entity
//

#endregion

namespace ClassLibrary.Domain.Utility;

    /// <summary>
    ///     Represents the <see cref="Reference" /> class.
    /// </summary>
    [Serializable]
    public class Reference : Entity<Guid>, IAggregateRoot
    {
        /// <summary>
        ///     Creates an instance of <see cref="Reference" /> class.
        /// </summary>
        public Reference()
        {
            ReferenceItems = new HashSet<ReferenceItem>();
        }


        /// <summary>
        ///     Creates an instance of <see cref="Reference" /> class.
        /// </summary>
        /// <param name="id">The Id.</param>
        /// <param name="name">The Name.</param>
        /// <param name="countryCode">The CountryCode.</param>
        /// <param name="createdOn">The CreatedOn.</param>
        /// <param name="changedOn">The ChangedOn.</param>
        public Reference(Guid id, string name, string countryCode, DateTime createdOn, DateTime changedOn) : this()
        {
            Id = id;
            Name = name;
            CountryCode = countryCode;
            CreatedOn = createdOn;
            ChangedOn = changedOn;
        }

        /// <summary>
        ///     The Name.
        /// </summary>
        public required string Name { get; set; }


        /// <summary>
        ///     The Description.
        /// </summary>
        public required string Description { get; set; }


        /// <summary>
        ///     The CountryCode.
        /// </summary>
        public required string CountryCode { get; set; }


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
        ///     Reference items.
        /// </summary>
        public virtual ICollection<ReferenceItem> ReferenceItems { get; set; }
}

