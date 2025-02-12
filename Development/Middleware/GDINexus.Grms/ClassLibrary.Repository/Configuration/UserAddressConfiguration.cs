#region Copyright GDI Nexus © 2025

//
// NAME:			UserAddressConfiguration.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			EF Configuration for User address value object
//

#endregion

using ClassLibrary.Domain.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassLibrary.Repository.Configuration;

/// <summary>
///     Represents the <see cref="UserAddressConfiguration" /> class.
/// </summary>
public class UserAddressConfiguration : IEntityTypeConfiguration<UserAddress>
{
    /// <summary>
    ///     Configure.
    /// </summary>
    /// <param name="builder"></param>
    public void Configure(EntityTypeBuilder<UserAddress> builder)
    {
        builder.ToTable("UserAddress", "User");
        builder.HasKey(e => new { e.UserId, e.AddressId });
        builder.HasIndex(e => new { e.UserId, e.AddressId })
            .HasName("UQ_User_UserAddress_Utility_Address")
            .IsUnique();
        builder.HasOne(d => d.Address)
            .WithMany(p => p.UserAddresses)
            .HasForeignKey(d => d.AddressId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_Address_UserAddress_Address");
    }
}