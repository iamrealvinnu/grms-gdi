#region Copyright GDI Nexus © 2025

//
// NAME:			EfMigrationTests .cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			EF Migration tests
//

#endregion

using Xunit.Abstractions;
using Xunit.Microsoft.DependencyInjection.Abstracts;

namespace Test.Unit.Repository;

/// <summary>
///     Represents the <see cref="EfMigrationTests" /> class.
/// </summary>
public class EfMigrationTests : TestBed<TestFixture>
{
    /// <summary>
    ///     Output.
    /// </summary>
    private readonly ITestOutputHelper _output;

    /// <summary>
    ///     Fixture
    /// </summary>
    private readonly TestFixture _testFixture;

    /// <summary>
    ///     Constructor
    /// </summary>
    /// <param name="testOutputHelper"></param>
    /// <param name="testFixture"></param>
    public EfMigrationTests(ITestOutputHelper testOutputHelper, TestFixture testFixture) : base(testOutputHelper,
        testFixture)
    {
        _output = testOutputHelper;
        _testFixture = testFixture;
    }

    /// <summary>
    ///     Verify DB created
    /// </summary>
    [Fact]
    [TestPriority(1)]
    public void VerifyDbCreated()
    {
        var results = _testFixture.DbApplicationContext.Database.CanConnect();
        Assert.True(results, "EfRepository Test - Database creation failed.");
    }
}