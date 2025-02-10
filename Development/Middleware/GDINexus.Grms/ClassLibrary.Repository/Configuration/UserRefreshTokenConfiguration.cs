#region Copyright GDI Nexus © 2025

//
// NAME:			UserRefreshTokenConfiguration.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			EF Configuration for user refresh token value object
//

#endregion

using ClassLibrary.Domain.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassLibrary.Repository.Configuration;

/// <summary>
///     Represents the <see cref="UserRefreshTokenConfiguration" /> class.
/// </summary>
public class UserRefreshTokenConfiguration : IEntityTypeConfiguration<UserRefreshToken>
{
    /// <summary>
    ///     Configuration.
    /// </summary>
    /// <param name="builder"></param>
    public void Configure(EntityTypeBuilder<UserRefreshToken> builder)
    {
        builder.ToTable("UserRefreshToken", "User");
        builder.HasKey(e => new { e.UserId, e.Code })
            .HasName("PK_User_UserRefreshToken");
        builder.HasIndex(e => new { e.UserId, e.Code })
            .HasName("IX_User_UserRefreshToken_UserId_RefreshToken");
        builder.Property(e => e.Code).HasMaxLength(900);
        builder.Property(e => e.Expiration).HasColumnType("datetime");
    }
}