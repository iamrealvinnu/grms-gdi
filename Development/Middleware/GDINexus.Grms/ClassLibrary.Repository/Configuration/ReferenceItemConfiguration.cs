#region Copyright GDI Nexus © 2025

//
// NAME:			ReferenceItemConfiguration .cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			ReferenceItem Value Object
//

#endregion

using ClassLibrary.Domain.Utility;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassLibrary.Repository.Configuration;

/// <summary>
///     Represents the <see cref="ReferenceItemConfiguration" /> class.
/// </summary>
public class ReferenceItemConfiguration : IEntityTypeConfiguration<ReferenceItem>
{
    /// <summary>
    ///     Configuration.
    /// </summary>
    /// <param name="builder"></param>
    public void Configure(EntityTypeBuilder<ReferenceItem> builder)
    {
        builder.ToTable("ReferenceItem", "Utility");
        builder.HasKey(e => e.Id)
            .HasName("PK_Utility_ReferenceItem");
        //builder.HasKey(e => new { e.ReferenceId, e.Code }).HasName("PK_Utility_ReferenceItem");
        builder.HasIndex(e => new { e.ReferenceId, e.Code })
            .HasName("UQ_Utility_ReferenceItem")
            .IsUnique();
        builder.Property(e => e.Archived).HasColumnType("datetime");
        builder.Property(e => e.ChangedOnUtc)
            .HasColumnType("datetime")
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");
        builder.Property(e => e.Code)
            .IsRequired()
            .HasMaxLength(256);
        builder.Property(e => e.CreatedOnUtc)
            .HasColumnType("datetime")
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");
        builder.Property(e => e.Description)
            .IsRequired()
            .HasMaxLength(512);
        builder.Property(e => e.Udf1).HasMaxLength(512).IsRequired(false);
        builder.Property(e => e.Udf2).HasMaxLength(512).IsRequired(false);
        builder.Property(e => e.Udf3).HasMaxLength(512).IsRequired(false);
        builder.Property(e => e.SortOrder).HasMaxLength(512).IsRequired(false);
    }
}