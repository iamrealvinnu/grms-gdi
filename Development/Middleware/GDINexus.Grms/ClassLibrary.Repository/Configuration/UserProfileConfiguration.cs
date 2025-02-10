#region Copyright GDI Nexus © 2025

//
// NAME:			UserProfileConfiguration.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			EF Configuration for User Profile value object
//

#endregion

using ClassLibrary.Domain.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassLibrary.Repository.Configuration;

/// <summary>
///     Represents the <see cref="UserProfileConfiguration" /> class.
/// </summary>
public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    /// <summary>
    ///     Configure.
    /// </summary>
    /// <param name="builder"></param>
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.ToTable("UserProfile", "User");
        builder.HasKey(e => e.UserId)
            .HasName("PK_User_UserProfile");
        builder.Property(e => e.UserId).ValueGeneratedNever();
        //builder.Property(e => e.Department).HasMaxLength(256);
        builder.Property(e => e.Dob).HasColumnType("date");
        builder.Property(e => e.FirstName)
            .IsRequired()
            .HasMaxLength(256);
        builder.Property(e => e.LastName)
            .IsRequired()
            .HasMaxLength(256);
        builder.Property(e => e.Degree).HasMaxLength(128).IsRequired(false);
        ;
        //builder.Property(e => e.Organization).HasMaxLength(256);
        builder.Property(e => e.PictureUrl).HasMaxLength(1024).IsRequired(false);
        ;
        builder.Property(e => e.PrefferedName).HasMaxLength(256).IsRequired(false);
        ;
        builder.Property(e => e.Prefix).HasMaxLength(256).IsRequired(false);
        ;
        builder.Property(e => e.Suffix).HasMaxLength(256).IsRequired(false);
        ;
        builder.Property(e => e.Title).HasMaxLength(256).IsRequired(false);
        ;
        builder.Property(e => e.Udf1).HasMaxLength(1024).IsRequired(false);
        ;
        builder.Property(e => e.Udf2).HasMaxLength(1024).IsRequired(false);
        ;
        builder.Property(e => e.Udf3).HasMaxLength(1024).IsRequired(false);
        ;
       // One to Many relationship 
        builder.HasOne(d => d.UserType)
            .WithMany(p => p.UserProfileUserType)
            .HasForeignKey(d => d.UserTypeId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_User_UserProfile_Utility_ReferenceItem_UserType");
        builder.HasOne(d => d.Gender)
            .WithMany(p => p.UserProfileGender)
            .HasForeignKey(d => d.GenderId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_User_UserProfile_Utility_ReferenceItem_Gender");
        builder.HasOne(d => d.Country)
            .WithMany(p => p.UserProfileCountry)
            .HasForeignKey(d => d.CountryId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_User_UserProfile_Utility_ReferenceItem_Country");
    }
}