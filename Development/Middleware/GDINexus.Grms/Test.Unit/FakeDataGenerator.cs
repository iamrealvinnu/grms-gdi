#region Copyright GDI Nexus © 2025

//
// NAME:			FakeDataGenerator.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Generic fake data generator
//

#endregion

using Bogus;
using ClassLibrary.Domain.User;
using ClassLibrary.Domain.Utility;
using Microsoft.AspNetCore.Identity;

namespace Test.Unit;

/// <summary>
///     Represents the <see cref="FakeDataGenerator" /> object.
/// </summary>
internal class FakeDataGenerator
{
    /// <summary>
    ///     Generate a fake reference object
    /// </summary>
    /// <returns></returns>
    public static IEnumerable<object[]> ReferenceGenerator()
    {
        var id = Guid.NewGuid();
        var fakeReferenceItems = new Faker<ReferenceItem>("en_US")
            .RuleFor(u => u.Id, f => Guid.NewGuid())
            .RuleFor(u => u.ReferenceId, f => id)
            .RuleFor(u => u.Code, f => f.Random.AlphaNumeric(5))
            .RuleFor(u => u.Description, f => f.Random.AlphaNumeric(25));
        var referenceItems = fakeReferenceItems.Generate(10);
        var fakeReferences = new Faker<Reference>("en_US")
            .RuleFor(u => u.Id, f => Guid.NewGuid())
            .RuleFor(u => u.CountryCode, f => "US")
            .RuleFor(u => u.Name, f => f.Random.AlphaNumeric(5))
            .RuleFor(u => u.Description, f => f.Random.AlphaNumeric(25))
            .RuleFor(u => u.ReferenceItems, f => referenceItems);

        yield return
        [
            fakeReferences.Generate(1).Single()
        ];
    }

    /// <summary>
    ///     UserGenerator
    /// </summary>
    /// <remarks>
    ///     Generates a fake user object
    /// </remarks>
    /// <returns></returns>
    public static IEnumerable<object[]> UserGenerator()
    {
        // Define the rules to generate a fake user
        var id = Guid.NewGuid();

        var fakeProfiles = new Faker<UserProfile>("en_US")
            .RuleFor(u => u.UserId, f => id)
            .RuleFor(u => u.FirstName, (f, u) => f.Name.FirstName())
            .RuleFor(u => u.LastName, (f, u) => f.Name.LastName())
            .RuleFor(u => u.Prefix, f => f.Name.Prefix(f.Person.Gender))
            .RuleFor(u => u.Suffix, f => f.Name.Suffix())
            .RuleFor(u => u.Title, f => f.Name.JobTitle())
            .RuleFor(u => u.Dob, f => f.Date.Past(85))
            .RuleFor(u => u.UserTypeId, f => Guid.Parse("58C49479-EC65-4DE2-86E7-033C546291AC"))
            .RuleFor(u => u.GenderId, f => Guid.Parse("58C49479-EC65-4DE2-86E7-033C546291AE"));
            //.RuleFor(u => u.CountryId, f => Guid.Parse("58C49479-EC65-4DE2-86E7-033C546291AA"));

        var fakeClaims = new Faker<UserClaim>("en_US")
            .RuleFor(u => u.UserId, f => id)
            .RuleFor(u => u.ClaimType, f => "Role")
            .RuleFor(u => u.ClaimValue, f => "ClaimAdmin");

        var fakeRefreshTokens = new Faker<UserRefreshToken>("en_US")
            .RuleFor(u => u.UserId, f => id)
            .RuleFor(u => u.Code, f => f.Random.AlphaNumeric(36))
            .RuleFor(u => u.Expiration, f => f.Date.Future(1));

        var fakeAddresses = new Faker<Address>("en_US")
            .RuleFor(u => u.Id, f => Guid.NewGuid())
            .RuleFor(u => u.AddressTypeId, f => Guid.Parse("58C49479-EC65-4DE2-86E7-033C546291AD"))
            .RuleFor(u => u.Address1, (f, u) => f.Address.StreetName())
            .RuleFor(u => u.Address2, (f, u) => f.Address.StreetAddress())
            .RuleFor(u => u.City, (f, u) => f.Address.City())
            .RuleFor(u => u.StateId, f => Guid.Parse("58C49479-EC65-4DE2-86E7-033C546291AB"))
            .RuleFor(u => u.Zip, (f, u) => f.Address.ZipCode())
            .RuleFor(u => u.CountryId, f => Guid.Parse("58C49479-EC65-4DE2-86E7-033C546291AA"));

        var fakeUserAddresses = new Faker<UserAddress>("en_US")
            .RuleFor(u => u.Address, f => fakeAddresses.Generate())
            .RuleFor(u => u.UserId, f => id)
            .RuleFor(u => u.Preffered, f => true);

        var profile = fakeProfiles.Generate();
        var fakeUsers = new Faker<User>("en_US")
            .RuleFor(u => u.Id, f => id)
            .RuleFor(u => u.UserName, (f, u) => f.Internet.UserName(profile.FirstName, profile.LastName))
            .RuleFor(u => u.Email, (f, u) => f.Internet.Email(profile.FirstName, profile.LastName))
            .RuleFor(u => u.EmailConfirmed, f => true)
            .RuleFor(u => u.PhoneNumberConfirmed, f => true)
            .RuleFor(u => u.PasswordHash, (f, u) => f.Internet.Password(11))
            .RuleFor(u => u.SecurityStamp, f => Guid.NewGuid().ToString())
            .RuleFor(u => u.MobileNumber, (f, u) => f.Phone.PhoneNumber("##########"))
            .RuleFor(u => u.CreatedOnUtc, f => DateTime.UtcNow)
            .RuleFor(u => u.Profile, f => profile)
            .RuleFor(u => u.Claims, f => fakeClaims.Generate(1).ToHashSet())
            .RuleFor(u => u.Addresses, f => fakeUserAddresses.Generate(1).ToHashSet())
            .RuleFor(u => u.RefreshTokens, f => fakeRefreshTokens.Generate(1).ToHashSet());

        var user = fakeUsers.Generate(1).Single();
        IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();
        var password = passwordHasher.HashPassword(user, "test");
        user.PasswordHash = passwordHasher.HashPassword(user, "test");

        yield return
        [
            user
        ];
    }
}