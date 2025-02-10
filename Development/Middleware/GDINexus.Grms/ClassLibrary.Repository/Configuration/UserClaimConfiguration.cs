#region Copyright GDI Nexus © 2025

//
// NAME:			UserClaimConfiguration.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			EF Configuration for User claim value object
//

#endregion

using ClassLibrary.Domain.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassLibrary.Repository.Configuration;

/// <summary>
///     Represents the <see cref="UserClaimConfiguration" /> class.
/// </summary>
public class UserClaimConfiguration : IEntityTypeConfiguration<UserClaim>
{
    /// <summary>
    ///     Configuration.
    /// </summary>
    /// <param name="builder"></param>
    public void Configure(EntityTypeBuilder<UserClaim> builder)
    {
        builder.ToTable("UserClaim", "User");
        builder.HasKey(e => new { e.UserId, e.ClaimType, e.ClaimValue })
            .HasName("PK_User_UserClaim");
        builder.Property(e => e.ChangedOnUtc)
            .HasColumnType("datetime")
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");
        builder.Property(e => e.CreatedOnUtc)
            .HasColumnType("datetime")
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");
        builder.HasIndex(e => e.UserId)
            .HasName("IX_User_UserClaim_UserId");
        builder.HasIndex(e => new { e.UserId, e.ClaimValue })
            .HasName("IX_User_UserClaim_UserId_ClaimValue");
        builder.Property(e => e.ClaimType).HasMaxLength(256);
        builder.Property(e => e.ClaimValue).HasMaxLength(256);
    }
}