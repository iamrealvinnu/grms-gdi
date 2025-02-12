#region Copyright GDI Nexus © 2025

//
// NAME:			ReferenceConfiguration.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			EF Configuration for reference domain object
//

#endregion

using ClassLibrary.Domain.Utility;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassLibrary.Repository.Configuration;

/// <summary>
///     Represents the <see cref="ReferenceConfiguration" /> class.
/// </summary>
public class ReferenceConfiguration : IEntityTypeConfiguration<Reference>
{
    /// <summary>
    ///     Configuration.
    /// </summary>
    /// <param name="builder"></param>
    public void Configure(EntityTypeBuilder<Reference> builder)
    {
        builder.ToTable("Reference", "Utility");
        builder.HasKey(e => e.Id)
            .HasName("PK_Utility_Reference");
        builder.HasIndex(e => new { e.Name, e.CountryCode })
            .HasName("UQ_Utility_Reference")
            .IsUnique();
        builder.Property(e => e.Id).ValueGeneratedNever();
        builder.Property(e => e.Archived).HasColumnType("datetime");
        builder.Property(e => e.ChangedOnUtc)
            .HasColumnType("datetime")
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");
        builder.Property(e => e.CountryCode)
            .IsRequired()
            .HasMaxLength(2);
        builder.Property(e => e.CreatedOnUtc)
            .HasColumnType("datetime")
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");
        builder.Property(e => e.Description).HasMaxLength(512);
        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(256);

        // Many to One relationship 
        builder.HasMany(d => d.ReferenceItems)
            .WithOne(p => p.Reference)
            .HasForeignKey(d => d.ReferenceId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_Reference_ReferenceItem_Reference");
    }
}