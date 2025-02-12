#region Copyright GDI Nexus © 2025

//
// NAME:			ReferenceRepositoryTests .cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			EF Migration tests
//

#endregion

using ClassLibrary.Core.Repository;
using ClassLibrary.Domain.Utility;
using ClassLibrary.Repository;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Xunit.Abstractions;
using Xunit.Microsoft.DependencyInjection.Abstracts;

namespace Test.Unit.Repository;

/// <summary>
///     Represents the <see cref="ReferenceRepositoryTests" /> class.
/// </summary>
public class ReferenceRepositoryTests : TestBed<TestFixture>
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
    public ReferenceRepositoryTests(ITestOutputHelper testOutputHelper, TestFixture fixture) : base(testOutputHelper,
        fixture)
    {
        _output = testOutputHelper;
        // Repository.
        _uowRepository = new UnitOfWork(fixture.DbApplicationContext);
    }

    /// <summary>
    ///     Verify can create reference
    /// </summary>
    [Theory]
    [MemberData(nameof(FakeDataGenerator.ReferenceGenerator), MemberType = typeof(FakeDataGenerator))]
    [TestPriority(1)]
    public async Task VerifyCanCreateReference(Reference reference)
    {
        await _uowRepository.Repository<Reference>().InsertEntityAsync(reference);
        await _uowRepository.SaveChangesAsync();

        // Find reference item
        var specification = new Specification<Reference>();
        specification.Conditions.Add(e => e.Id == reference.Id);
        specification.Includes = ep => ep.Include(e => e.ReferenceItems);
        var untrackedResult = await _uowRepository.Repository<Reference>().GetEntityAsync(specification, true);
        Assert.True(untrackedResult.CountryCode != null, "Reference repository - Failed to create reference.");
    }

    /// <summary>
    ///     Verify can find reference
    /// </summary>
    [Fact]
    [TestPriority(2)]
    public async Task VerifyCanFindReference()
    {
        var specification = new Specification<Reference>
        {
            Includes = ep => ep.Include(e => e.ReferenceItems)
        };
        var untrackedResult = await _uowRepository.Repository<Reference>().GetEntityAsync(specification, true);
        Assert.True(untrackedResult.CountryCode != null, "Reference repository - Failed to find reference.");
        _output.WriteLine(JsonConvert.SerializeObject(untrackedResult, Formatting.Indented, new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        }));
    }
}