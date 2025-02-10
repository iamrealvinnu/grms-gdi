#region Copyright GDI Nexus © 2025

//
// NAME:			IUnitOfWork.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Unit of Work Interface
//

#endregion

namespace ClassLibrary.Core.Repository;

/// <summary>
///     Contains all the UnitOfWork services.
/// </summary>
public interface IUnitOfWork
{
    /// <summary>
    ///     Execute raw sql command against the configured database.
    /// </summary>
    /// <param name="sql">The sql string.</param>
    /// <param name="parameters">The parameters in the sql string.</param>
    /// <returns>Returns <see cref="int" />.</returns>
    int ExecuteSqlCommand(string sql, params object[] parameters);

    /// <summary>
    ///     Execute raw sql command against the configured database asynchronously.
    /// </summary>
    /// <param name="sql">The sql string.</param>
    /// <param name="parameters">The parameters in the sql string.</param>
    /// <returns>Returns <see cref="Task" />.</returns>
    Task<int> ExecuteSqlCommandAsync(string sql, params object[] parameters);

    /// <summary>
    ///     Returns the repository for the provided type.
    /// </summary>
    /// <typeparam name="T">The database entity type.</typeparam>
    /// <returns>Returns <see cref="Repository{T}" />.</returns>
    IUnitOfWorkRepository<T> Repository<T>()
        where T : class;

    /// <summary>
    ///     Reset the DbContext state by removing all the tracked and attached entities.
    /// </summary>
    void ResetContextState();

    /// <summary>
    ///     Trigger the execution of the EF core commands against the configured database.
    /// </summary>
    /// <param name="cancellationToken">A <see cref="CancellationToken" /> to observe while waiting for the task to complete.</param>
    /// <returns>Returns <see cref="Task" />.</returns>
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}