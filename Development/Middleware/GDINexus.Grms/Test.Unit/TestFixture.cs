#region Copyright GDI Nexus © 2025

//
// NAME:			TestFixture.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			TestFixture that implements TestBedFixture
//

#endregion

using ClassLibrary.Domain.Utility;
using ClassLibrary.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Xunit.Microsoft.DependencyInjection;
using Xunit.Microsoft.DependencyInjection.Abstracts;

namespace Test.Unit;

/// <summary>
///     Represents the <see cref="TestFixture" /> class.
/// </summary>
public class TestFixture : TestBedFixture, IDisposable
{
    /// <summary>
    ///     Application Context.
    /// </summary>
    public readonly ApplicationContext DbApplicationContext;

    /// <summary>
    ///     Constructor
    /// </summary>
    public TestFixture()
    {
        // TODO: Replace with your file location.
        var dbFileNamePath = @"C:\WRK\Files\GDIGRMSDEV.db";

        // Replace with your server version and type.
        // Use 'MariaDbServerVersion' for MariaDB.
        // Alternatively, use 'ServerVersion.AutoDetect(connectionString)'.
        // For common usages, see pull request #1233.
        //var serverVersion = new MySqlServerVersion(ServerVersion.AutoDetect(connectionString));
        var dbOptions = new DbContextOptionsBuilder<ApplicationContext>()
            .UseSqlite($"Data Source={dbFileNamePath}")
            .EnableSensitiveDataLogging() // <-- These two calls are optional but help
            .EnableDetailedErrors() // <-- with debugging (remove for production).
            //.LogTo(_output.WriteLine)
            .Options;
        DbApplicationContext = new ApplicationContext(dbOptions);

        // NOTE do not use the below EnsureDeleted and EnsureCreated. When creating the DB for the first time
        // 1. Create a empty DB
        //USE [master]
        //GO
        //ALTER DATABASE [OTPV2MIGRATE] SET SINGLE_USER WITH ROLLBACK IMMEDIATE
        //GO
        //DROP DATABASE [OTPV2MIGRATE]
        //GO
        //CREATE DATABASE [OTPV2MIGRATE]
        //GO
        // 2. Create the initial migration using the normal migration steps and call it MMDDYYYY-INIT migration
        // 3. This will create a snapshot and a file called MMDDYYYYY-INIT
        // 4. Then call the applicationContext.Database.Migrate()
        // 5. Note the connection string above and the connection string in the DbApplicationContext file in the ClassLibrary project where the migration get's the connection should point to the same DB so ID's sync
        //applicationContext.Database.EnsureDeleted();
        //var created = applicationContext.Database.EnsureCreated();
        //applicationContext.Database.Migrate();

        //DbApplicationContext.Database.EnsureDeleted();
        DbApplicationContext.Database.EnsureCreated();
        DbApplicationContext.Database.Migrate();

        // Seed data
        if (!DbApplicationContext.Reference.Any())
        {
            var references = new List<Reference>
            {
                // Add Reference for country
                new()
                {
                    Id = new Guid("58c49479-ec65-4de2-86e7-033c546291aa"), CountryCode = "US", Name = "Countries",
                    Description = "List of countries", ReferenceItems = new List<ReferenceItem>
                    {
                        new()
                        {
                            Id = new Guid("58c49479-ec65-4de2-86e7-033c546291aa"), Code = "US",
                            Description = "United States"
                        }
                    }
                },

                // Add Reference for state
                new()
                {
                    Id = new Guid("58c49479-ec65-4de2-86e7-033c546291ab"), CountryCode = "US", Name = "States",
                    Description = "List of states", ReferenceItems = new List<ReferenceItem>
                    {
                        new()
                        {
                            Id = new Guid("58c49479-ec65-4de2-86e7-033c546291ab"), Code = "Virginia",
                            Description = "Virginia"
                        }
                    }
                },

                // Add Reference for user type
                new()
                {
                    Id = new Guid("58c49479-ec65-4de2-86e7-033c546291ac"), CountryCode = "US", Name = "User Types",
                    Description = "List of user types", ReferenceItems = new List<ReferenceItem>
                    {
                        new()
                        {
                            Id = new Guid("58c49479-ec65-4de2-86e7-033c546291ac"), Code = "Admin",
                            Description = "Administrator"
                        }
                    }
                },

                // Add Reference for address type
                new()
                {
                    Id = new Guid("58c49479-ec65-4de2-86e7-033c546291ad"), CountryCode = "US", Name = "Address Types",
                    Description = "List of address types", ReferenceItems = new List<ReferenceItem>
                    {
                        new()
                        {
                            Id = new Guid("58c49479-ec65-4de2-86e7-033c546291ad"), Code = "Home",
                            Description = "Home"
                        }
                    }
                },

                // Add Reference for gender type
                new()
                {
                    Id = new Guid("58c49479-ec65-4de2-86e7-033c546291ae"), CountryCode = "US", Name = "Gender Types",
                    Description = "List of gender types", ReferenceItems = new List<ReferenceItem>
                    {
                        new()
                        {
                            Id = new Guid("58c49479-ec65-4de2-86e7-033c546291ae"), Code = "Male",
                            Description = "Male"
                        }
                    }
                },
            };

            // Save the data
            DbApplicationContext.Reference.AddRange(references);
            DbApplicationContext.SaveChanges();
        }
    }

    /// <summary>
    ///     Dispose
    /// </summary>
    public new void Dispose()
    {
        // Always delete the DB on load
        // DbApplicationContext.Database.EnsureDeleted();

        // Do "global" teardown here; Only called once.
        base.Dispose();
    }

    /// <summary>
    ///     Add Services
    /// </summary>
    /// <param name="services"></param>
    /// <param name="configuration"></param>
    /// <exception cref="NotImplementedException"></exception>
    protected override void AddServices(IServiceCollection services, IConfiguration? configuration)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    ///     Get Test App Settings
    /// </summary>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    protected override IEnumerable<TestAppSettings> GetTestAppSettings()
    {
        yield return new TestAppSettings { Filename = "testsettings.json", IsOptional = false };
    }

    /// <summary>
    ///     Dispose Async Core
    /// </summary>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    protected override ValueTask DisposeAsyncCore()
    {
        return new ValueTask();
    }
}