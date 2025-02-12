#region Copyright GDI Nexus © 2025

//
// NAME:			UserRepositoryTests.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			EF Migration tests
//

#endregion

using ClassLibrary.Core.Repository;
using ClassLibrary.Domain.User;
using ClassLibrary.Repository;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Xunit.Abstractions;
using Xunit.Microsoft.DependencyInjection.Abstracts;

namespace Test.Unit.Repository;

/// <summary>
///     Represents the <see cref="UserRepositoryTests" /> class.
/// </summary>
public class UserRepositoryTests : TestBed<TestFixture>
{
    /// <summary>
    ///     Output.
    /// </summary>
    private readonly ITestOutputHelper _output;

    /// <summary>
    ///     uowRepository.
    /// </summary>
    private readonly IUnitOfWork _uowRepository;

    /// <summary>
    ///     Constructor
    /// </summary>
    /// <param name="testOutputHelper"></param>
    /// <param name="fixture"></param>
    public UserRepositoryTests(ITestOutputHelper testOutputHelper, TestFixture fixture) : base(testOutputHelper,
        fixture)
    {
        _output = testOutputHelper;
        // Repository.
        _uowRepository = new UnitOfWork(fixture.DbApplicationContext);
    }

    /// <summary>
    ///     Verify can create user
    /// </summary>
    [Theory]
    [MemberData(nameof(FakeDataGenerator.UserGenerator), MemberType = typeof(FakeDataGenerator))]
    [TestPriority(1)]
    public async Task VerifyCanCreateUser(User user)
    {
        await _uowRepository.Repository<User>().InsertEntityAsync(user);
        await _uowRepository.SaveChangesAsync();

        // Find user item
        var specification = new Specification<User>();
        specification.Conditions.Add(e => e.Id == user.Id);
        specification.Includes = ep => ep.Include(e => e.Profile)!;
        var untrackedResult = await _uowRepository.Repository<User>().GetEntityAsync(specification, true);
        Assert.True(untrackedResult.UserName != null, "User repository - Failed to create user.");
    }

    /// <summary>
    ///     Verify can find user
    /// </summary>
    [Fact]
    [TestPriority(2)]
    public async Task VerifyCanFindUser()
    {
        var specification = new Specification<User>
        {
            Includes = ep => ep
                .Include(e => e.Profile)
                .Include(e => e.Claims)
                .Include(e => e.Addresses).ThenInclude(c => c.Address).ThenInclude(c => c.AddressType)
                .Include(e => e.RefreshTokens)
        };
        var untrackedResult = await _uowRepository.Repository<User>().GetEntityAsync(specification, true);
        Assert.True(untrackedResult.UserName != null, "User repository - Failed to find user.");
        _output.WriteLine(JsonConvert.SerializeObject(untrackedResult, Formatting.Indented, new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        }));
    }
}