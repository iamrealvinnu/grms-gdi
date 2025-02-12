#region Copyright GDI Nexus © 2025

//
// NAME:			UserTests.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			User tests for User domain object
//

#endregion

using ClassLibrary.Domain.User;
using Newtonsoft.Json;
using Xunit.Abstractions;
using Xunit.Microsoft.DependencyInjection.Abstracts;

namespace Test.Unit.Domain;

/// <summary>
///     Represents the <see cref="UserTests" /> class
/// </summary>
public class UserTests : TestBed<TestFixture>
{
    /// <summary>
    ///     Output.
    /// </summary>
    private readonly ITestOutputHelper _output;

    /// <summary>
    ///     Constructor
    /// </summary>
    /// <param name="testOutputHelper"></param>
    /// <param name="fixture"></param>
    public UserTests(ITestOutputHelper testOutputHelper, TestFixture fixture) : base(testOutputHelper, fixture)
    {
        _output = testOutputHelper;
    }

    /// <summary>
    ///     Verify Can Create User
    /// </summary>
    /// <param name="user"></param>
    [Theory]
    [MemberData(nameof(FakeDataGenerator.UserGenerator), MemberType = typeof(FakeDataGenerator))]
    [TestPriority(1)]
    public void VerifyCanCreateUser(User user)
    {
        Assert.True(user.UserName != null && !string.IsNullOrEmpty(user.UserName), "User Test - Failed to create user");
        _output.WriteLine(JsonConvert.SerializeObject(user, Formatting.Indented, new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        }));
    }
}