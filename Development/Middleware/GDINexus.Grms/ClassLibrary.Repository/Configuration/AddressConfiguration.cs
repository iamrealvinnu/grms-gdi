#region Copyright GDI Nexus © 2025

//
// NAME:			AddressConfiguration.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			EF Configuration for address value object
//

#endregion

using ClassLibrary.Domain.Utility;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassLibrary.Repository.Configuration;

/// <summary>
///     Represents the <see cref="AddressConfiguration" /> class.
/// </summary>
public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    /// <summary>
    ///     Configuration.
    /// </summary>
    /// <param name="builder"></param>
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.ToTable("Address", "Utility");
        builder.HasKey(e => e.Id)
            .HasName("PK_Utility_Address");
        builder.Property(e => e.Id).ValueGeneratedNever();
        builder.Property(e => e.Address1)
            .IsRequired()
            .HasMaxLength(512);
        builder.Property(e => e.Address2).HasMaxLength(256).IsRequired(false);
        builder.Property(e => e.ChangedOn)
            .HasColumnType("datetime")
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");
        builder.Property(e => e.City)
            .IsRequired()
            .HasMaxLength(256);
        builder.Property(e => e.Zip)
            .IsRequired()
            .HasMaxLength(256);
        builder.Property(e => e.County).HasMaxLength(256).IsRequired(false);
        builder.Property(e => e.CreatedOn)
            .HasColumnType("datetime")
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");
        builder.Property(e => e.Latitude).HasColumnType("decimal(9, 6)").IsRequired(false);
        builder.Property(e => e.Longitude).HasColumnType("decimal(9, 6)").IsRequired(false);
        builder.Property(e => e.Udf1).HasMaxLength(512).IsRequired(false);
        builder.Property(e => e.Udf2).HasMaxLength(512).IsRequired(false);
        builder.Property(e => e.Udf3).HasMaxLength(512).IsRequired(false);
        builder.HasOne(d => d.AddressType)
            .WithMany(p => p.AddressType)
            .HasForeignKey(d => d.AddressTypeId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_Utility_Address_ReferenceItem_AddressType");
        builder.HasOne(d => d.State)
            .WithMany(p => p.AddressState)
            .HasForeignKey(d => d.StateId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_UtilityAddress_ReferenceItem_State");
        builder.HasOne(d => d.Country)
            .WithMany(p => p.AddressCountry)
            .HasForeignKey(d => d.CountryId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_UtilityAddress_ReferenceItem_Country");
    }
}