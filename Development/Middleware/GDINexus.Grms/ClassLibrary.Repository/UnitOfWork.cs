#region Copyright GDI Nexus © 2025

//
// NAME:			UnitOfWork.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Implementing the Unit of Work
//

#endregion

using System.Collections;
using ClassLibrary.Core.Repository;
using Microsoft.EntityFrameworkCore;

namespace ClassLibrary.Repository;

/// <summary>
///     Represents the <see cref="UnitOfWork" /> class.
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    /// <summary>
    ///     DB Context.
    /// </summary>
    private readonly ApplicationContext _dbContext;

    /// <summary>
    ///     Repositories.
    /// </summary>
    private Hashtable _repositories;

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="dbContext"></param>
    public UnitOfWork(ApplicationContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    ///     Execute SQL Command.
    /// </summary>
    /// <param name="sql"></param>
    /// <param name="parameters"></param>
    /// <returns></returns>
    public int ExecuteSqlCommand(string sql, params object[] parameters)
    {
        return _dbContext.Database.ExecuteSqlRaw(sql, parameters);
    }

    /// <summary>
    ///     Execute SQL Command Async.
    /// </summary>
    /// <param name="sql"></param>
    /// <param name="parameters"></param>
    /// <returns></returns>
    public async Task<int> ExecuteSqlCommandAsync(string sql, params object[] parameters)
    {
        return await _dbContext.Database.ExecuteSqlRawAsync(sql, parameters);
    }

    /// <summary>
    ///     Unit of Work Repository
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    public IUnitOfWorkRepository<T> Repository<T>()
        where T : class
    {
        if (_repositories == null) _repositories = new Hashtable();
        var type = typeof(T).Name;

        if (!_repositories.ContainsKey(type))
        {
            var repositoryType = typeof(UnitOfWorkRepository<>);

            var repositoryInstance =
                Activator.CreateInstance(repositoryType.MakeGenericType(typeof(T)), _dbContext);

            _repositories.Add(type, repositoryInstance);
        }

        return (IUnitOfWorkRepository<T>)_repositories[type];
    }

    /// <summary>
    ///     Reset context state.
    /// </summary>
    public void ResetContextState()
    {
        _dbContext.ChangeTracker.Entries().Where(e => e.Entity != null).ToList()
            .ForEach(e => e.State = EntityState.Detached);
    }

    /// <summary>
    ///     Save changes Async.
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}