#region Copyright GDI Nexus © 2025

//
// NAME:			UserConfiguration.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			EF Configuration for User domain object
//

#endregion

using ClassLibrary.Domain.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassLibrary.Repository.Configuration;

/// <summary>
///     Represents the <see cref="UserConfiguration" /> class.
/// </summary>
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    /// <summary>
    ///     Configure.
    /// </summary>
    /// <param name="builder"></param>
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Map the User to table [User].[Users]
        builder.ToTable("Users", "User");
        builder.HasKey(e => e.Id)
            .HasName("PK_User_Users");
        builder.HasIndex(e => e.Id)
            .HasName("IX_User_Users_Id");
        builder.HasIndex(e => e.UserName)
            .HasName("IX_User_Users_UserName");
        builder.Property(e => e.Id).ValueGeneratedNever();
        builder.Property(e => e.ChangedOnUtc)
            .HasColumnType("datetime")
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");
        builder.Property(e => e.CreatedOnUtc)
            .HasColumnType("datetime")
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");
        builder.Property(e => e.DeactivatedDate).HasColumnType("datetime");
        builder.Property(e => e.DeletedOn).HasColumnType("datetime");
        builder.Property(e => e.Email)
            .IsRequired()
            .HasMaxLength(256);
        builder.Property(e => e.LockoutEndDate).HasColumnType("datetime");
        builder.Property(e => e.MobileNumber).HasMaxLength(256);
        builder.Property(e => e.NationalId).HasMaxLength(512).IsRequired(false);
        builder.Property(e => e.NationalIdVerificationDate).HasColumnType("datetime").IsRequired(false);
        builder.Property(e => e.PasswordHash)
            .IsRequired()
            .HasMaxLength(512);
        builder.Property(e => e.PhoneNumber).HasMaxLength(256).IsRequired(false);
        builder.Property(e => e.SecurityStamp)
            .IsRequired()
            .HasMaxLength(256);
        builder.Property(e => e.Udf1).HasMaxLength(512).IsRequired(false);
        builder.Property(e => e.Udf2).HasMaxLength(512).IsRequired(false);
        builder.Property(e => e.Udf3).HasMaxLength(512).IsRequired(false);
        builder.Property(e => e.UserName)
            .IsRequired()
            .HasMaxLength(256);

        // One to One relationship with unique constraint
        builder.HasOne(d => d.Profile)
            .WithOne(p => p.User)
            .HasForeignKey<UserProfile>(d => d.UserId)
            .HasConstraintName("FK_User_Users_UserProfile");

        // Many to One relationship 
        builder.HasMany(d => d.Claims)
            .WithOne(p => p.User)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_User_Users_UserClaim");

        // Many to One relationship 
        builder.HasMany(d => d.Addresses)
            .WithOne(p => p.User)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_User_Users_Utility_UserAddress");

        // Many to One relationship 
        builder.HasMany(d => d.RefreshTokens)
            .WithOne(p => p.User)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_User_Users_UserRefreshToken");

        // One to One optional relationship
        builder.HasOne(d => d.ReportsTo)
            .WithMany()
            .HasForeignKey(d => d.ReportsToId)
            .HasForeignKey("FK_ReportsTo_Users_Users")
            .IsRequired(false);

        // TODO: Seed data will be handled in the application layer
        // Load data for initialization
        //builder.HasData(systemUser, user);
    }
}