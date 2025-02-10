#region Copyright GDI Nexus © 2025

//
// NAME:			ApplicationContext.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Entity framework application context
//

#endregion

using ClassLibrary.Domain.Utility;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ClassLibrary.Repository;

/// <summary>
///     Represents the <see cref="ApplicationContext" /> class.
/// </summary>
public class ApplicationContext : DbContext
{
    /// <summary>
    ///     References.
    /// </summary>
    public DbSet<Reference> Reference { get; set; }

    /// <summary>
    ///     ReferenceItems.
    /// </summary>
    public DbSet<ReferenceItem> ReferenceItem { get; set; }

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="options"></param>
    public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
    {
    }

    /// <summary>
    ///     On model creating.
    /// </summary>
    /// <param name="builder"></param>
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        //builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        builder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }

    /// <summary>
    ///     Represents the <see cref="DesignTimeDbContextFactory" /> class.
    /// </summary>
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationContext>
    {
        /// <summary>
        ///     CreateDbContext.
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        public ApplicationContext CreateDbContext(string[] args)
        {
            // TODO: Replace with your connection string.
            var connectionString =
                @"Data Source=10.0.100.229\\MSSQL2017;User ID=girish;Password=Summer123!;database=OTPV2MIGRATE;Encrypt=True;TrustServerCertificate=True;";

            // DB Options
            var dbOptions = new DbContextOptionsBuilder<ApplicationContext>()
                .UseSqlServer(connectionString)
                .EnableSensitiveDataLogging() // <-- These two calls are optional but help
                .EnableDetailedErrors() // <-- with debugging (remove for production).
                //.LogTo(_output.WriteLine)
                .Options;

            return new ApplicationContext(dbOptions);
        }
    }
}