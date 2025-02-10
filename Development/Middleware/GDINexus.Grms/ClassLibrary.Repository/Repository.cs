#region Copyright GDI Nexus © 2025

//
// NAME:			Repository.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Implementing the Repository
//

#endregion

using System.Globalization;
using System.Linq.Expressions;
using ClassLibrary.Core.Repository;
using Microsoft.EntityFrameworkCore;

namespace ClassLibrary.Repository;

/// <summary>
///     Represents the <see cref="Repository" /> class.
/// </summary>
internal class Repository : IRepository
{
    /// <summary>
    ///     Context.
    /// </summary>
    private readonly ApplicationContext _dbContext;

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="dbContext"></param>
    public Repository(ApplicationContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    ///     Delete Range.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="entities"></param>
    public void DeleteEntities<T>(IEnumerable<T> entities)
        where T : class
    {
        _dbContext.Set<T>().RemoveRange(entities);
    }

    /// <summary>
    ///     Delete.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="entity"></param>
    public void DeleteEntity<T>(T entity)
        where T : class
    {
        _dbContext.Set<T>().Remove(entity);
    }

    /// <summary>
    ///     Execute SQL.
    /// </summary>
    /// <param name="sql"></param>
    /// <param name="parameters"></param>
    /// <returns></returns>
    public int ExecuteSqlCommand(string sql, params object[] parameters)
    {
        return _dbContext.Database.ExecuteSqlRaw(sql, parameters);
    }

    /// <summary>
    ///     Execute SQL.
    /// </summary>
    /// <param name="sql"></param>
    /// <param name="parameters"></param>
    /// <returns></returns>
    public async Task<int> ExecuteSqlCommandAsync(string sql, params object[] parameters)
    {
        return await _dbContext.Database.ExecuteSqlRawAsync(sql, parameters);
    }

    /// <summary>
    ///     Get Count.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    public async Task<int> GetCountAsync<T>()
        where T : class
    {
        var count = await _dbContext.Set<T>().CountAsync();
        return count;
    }

    /// <summary>
    ///     Get Count.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="conditions"></param>
    /// <returns></returns>
    public async Task<int> GetCountAsync<T>(params Expression<Func<T, bool>>[] conditions)
        where T : class
    {
        IQueryable<T> query = _dbContext.Set<T>();
        if (conditions == null) return await query.CountAsync();
        foreach (var expression in conditions) query = query.Where(expression);
        return await query.CountAsync();
    }

    /// <summary>
    ///     Get entities.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="condition"></param>
    /// <param name="asNoTracking"></param>
    /// <returns></returns>
    public async Task<T> GetEntityAsync<T>(Expression<Func<T, bool>> condition, bool asNoTracking = false)
        where T : class
    {
        IQueryable<T> query = _dbContext.Set<T>();

        if (condition != null) query = query.Where(condition);

        if (asNoTracking) query = query.AsNoTracking();

        return await query.FirstOrDefaultAsync();
    }

    /// <summary>
    ///     GetEntityAsync.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="specification"></param>
    /// <param name="asNoTracking"></param>
    /// <returns></returns>
    public async Task<T> GetEntityAsync<T>(Specification<T> specification, bool asNoTracking = false)
        where T : class
    {
        IQueryable<T> query = _dbContext.Set<T>();

        if (specification != null) query = query.GetSpecifiedQuery(specification);

        if (asNoTracking) query = query.AsNoTracking();

        return await query.FirstOrDefaultAsync();
    }

    public async Task<T> GetEntityByIdAsync<T>(object id, bool asNoTracking = false)
        where T : class
    {
        if (id == null) throw new ArgumentNullException(nameof(id));

        var entityType = _dbContext.Model.FindEntityType(typeof(T));

        var primaryKeyName = entityType.FindPrimaryKey().Properties.Select(p => p.Name).FirstOrDefault();
        var primaryKeyType = entityType.FindPrimaryKey().Properties.Select(p => p.ClrType).FirstOrDefault();

        if (primaryKeyName == null || primaryKeyType == null)
            throw new ArgumentException("Entity does not have any primary key defined", nameof(id));

        object primayKeyValue = null;

        try
        {
            primayKeyValue = Convert.ChangeType(id, primaryKeyType, CultureInfo.InvariantCulture);
        }
        catch (Exception)
        {
            throw new ArgumentException(
                $"You can not assign a value of type {id.GetType()} to a property of type {primaryKeyType}");
        }

        var pe = Expression.Parameter(typeof(T), "entity");
        var me = Expression.Property(pe, primaryKeyName);
        var constant = Expression.Constant(primayKeyValue, primaryKeyType);
        var body = Expression.Equal(me, constant);
        var expressionTree = Expression.Lambda<Func<T, bool>>(body, pe);

        IQueryable<T> query = _dbContext.Set<T>();

        if (asNoTracking)
        {
            var noTrackedEntity = await query.AsNoTracking().FirstOrDefaultAsync(expressionTree);
            return noTrackedEntity;
        }

        var trackedEntity = await query.FirstOrDefaultAsync(expressionTree);
        return trackedEntity;
    }

    /// <summary>
    ///     GetEntityList.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="asNoTracking"></param>
    /// <returns></returns>
    public async Task<List<T>> GetEntityListAsync<T>(bool asNoTracking = false)
        where T : class
    {
        IQueryable<T> query = _dbContext.Set<T>();
        if (asNoTracking) query = query.AsNoTracking();
        var entities = await query.ToListAsync();
        return entities;
    }

    /// <summary>
    ///     GetEntityList.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="condition"></param>
    /// <param name="asNoTracking"></param>
    /// <returns></returns>
    public async Task<List<T>> GetEntityListAsync<T>(Expression<Func<T, bool>> condition, bool asNoTracking = false)
        where T : class
    {
        IQueryable<T> query = _dbContext.Set<T>();
        if (condition != null) query = query.Where(condition);
        if (asNoTracking) query = query.AsNoTracking();
        var entities = await query.ToListAsync();
        return entities;
    }

    /// <summary>
    ///     GetEntityList.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="specification"></param>
    /// <param name="asNoTracking"></param>
    /// <returns></returns>
    public async Task<List<T>> GetEntityListAsync<T>(Specification<T> specification, bool asNoTracking = false)
        where T : class
    {
        IQueryable<T> query = _dbContext.Set<T>();
        if (specification != null) query = query.GetSpecifiedQuery(specification);
        if (asNoTracking) query = query.AsNoTracking();
        return await query.ToListAsync();
    }

    /// <summary>
    ///     GetCount.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    public async Task<long> GetLongCountAsync<T>()
        where T : class
    {
        var count = await _dbContext.Set<T>().LongCountAsync();
        return count;
    }

    /// <summary>
    ///     Get Count.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="conditions"></param>
    /// <returns></returns>
    public async Task<long> GetLongCountAsync<T>(params Expression<Func<T, bool>>[] conditions)
        where T : class
    {
        IQueryable<T> query = _dbContext.Set<T>();

        if (conditions == null) return await query.LongCountAsync();

        foreach (var expression in conditions) query = query.Where(expression);

        return await query.LongCountAsync();
    }

    /// <summary>
    ///     Get Projected Type.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TProjectedType"></typeparam>
    /// <param name="condition"></param>
    /// <param name="selectExpression"></param>
    /// <returns></returns>
    public async Task<TProjectedType> GetProjectedEntityAsync<T, TProjectedType>(
        Expression<Func<T, bool>> condition,
        Expression<Func<T, TProjectedType>> selectExpression)
        where T : class
    {
        if (selectExpression == null) throw new ArgumentNullException(nameof(selectExpression));

        IQueryable<T> query = _dbContext.Set<T>();

        if (condition != null) query = query.Where(condition);

        return await query.Select(selectExpression).FirstOrDefaultAsync();
    }

    /// <summary>
    ///     Get projected type.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TProjectedType"></typeparam>
    /// <param name="specification"></param>
    /// <param name="selectExpression"></param>
    /// <returns></returns>
    public async Task<TProjectedType> GetProjectedEntityAsync<T, TProjectedType>(
        Specification<T> specification,
        Expression<Func<T, TProjectedType>> selectExpression)
        where T : class
    {
        if (selectExpression == null) throw new ArgumentNullException(nameof(selectExpression));

        IQueryable<T> query = _dbContext.Set<T>();

        if (specification != null) query = query.GetSpecifiedQuery(specification);

        return await query.Select(selectExpression).FirstOrDefaultAsync();
    }

    /// <summary>
    ///     Get Projected Type.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TProjectedType"></typeparam>
    /// <param name="id"></param>
    /// <param name="selectExpression"></param>
    /// <returns></returns>
    public async Task<TProjectedType> GetProjectedEntityByIdAsync<T, TProjectedType>(
        object id,
        Expression<Func<T, TProjectedType>> selectExpression)
        where T : class
    {
        if (id == null) throw new ArgumentNullException(nameof(id));

        if (selectExpression == null) throw new ArgumentNullException(nameof(selectExpression));

        var entityType = _dbContext.Model.FindEntityType(typeof(T));

        var primaryKeyName = entityType.FindPrimaryKey().Properties.Select(p => p.Name).FirstOrDefault();
        var primaryKeyType = entityType.FindPrimaryKey().Properties.Select(p => p.ClrType).FirstOrDefault();

        if (primaryKeyName == null || primaryKeyType == null)
            throw new ArgumentException("Entity does not have any primary key defined", nameof(id));

        object primayKeyValue = null;

        try
        {
            primayKeyValue = Convert.ChangeType(id, primaryKeyType, CultureInfo.InvariantCulture);
        }
        catch (Exception)
        {
            throw new ArgumentException(
                $"You can not assign a value of type {id.GetType()} to a property of type {primaryKeyType}");
        }

        var pe = Expression.Parameter(typeof(T), "entity");
        var me = Expression.Property(pe, primaryKeyName);
        var constant = Expression.Constant(primayKeyValue, primaryKeyType);
        var body = Expression.Equal(me, constant);
        var expressionTree = Expression.Lambda<Func<T, bool>>(body, pe);

        IQueryable<T> query = _dbContext.Set<T>();

        return await query.Where(expressionTree).Select(selectExpression).FirstOrDefaultAsync();
    }

    /// <summary>
    ///     GetProjected.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TProjectedType"></typeparam>
    /// <param name="selectExpression"></param>
    /// <returns></returns>
    public async Task<List<TProjectedType>> GetProjectedEntityListAsync<T, TProjectedType>(
        Expression<Func<T, TProjectedType>> selectExpression)
        where T : class
    {
        if (selectExpression == null) throw new ArgumentNullException(nameof(selectExpression));

        var entities = await _dbContext.Set<T>().Select(selectExpression).ToListAsync();

        return entities;
    }

    /// <summary>
    ///     GetProjected.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TProjectedType"></typeparam>
    /// <param name="condition"></param>
    /// <param name="selectExpression"></param>
    /// <returns></returns>
    public async Task<List<TProjectedType>> GetProjectedEntityListAsync<T, TProjectedType>(
        Expression<Func<T, bool>> condition,
        Expression<Func<T, TProjectedType>> selectExpression)
        where T : class
    {
        if (selectExpression == null) throw new ArgumentNullException(nameof(selectExpression));

        IQueryable<T> query = _dbContext.Set<T>();

        if (condition != null) query = query.Where(condition);

        var projectedEntites = await query.Select(selectExpression).ToListAsync();

        return projectedEntites;
    }

    /// <summary>
    ///     GetProjected.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TProjectedType"></typeparam>
    /// <param name="specification"></param>
    /// <param name="selectExpression"></param>
    /// <returns></returns>
    public async Task<List<TProjectedType>> GetProjectedEntityListAsync<T, TProjectedType>(
        Specification<T> specification,
        Expression<Func<T, TProjectedType>> selectExpression)
        where T : class
    {
        if (selectExpression == null) throw new ArgumentNullException(nameof(selectExpression));

        IQueryable<T> query = _dbContext.Set<T>();

        if (specification != null) query = query.GetSpecifiedQuery(specification);

        return await query.Select(selectExpression).ToListAsync();
    }

    /// <summary>
    ///     GetQueryable.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    public IQueryable<T> GetQueryable<T>()
        where T : class
    {
        return _dbContext.Set<T>();
    }

    /// <summary>
    ///     Insert.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="entities"></param>
    /// <returns></returns>
    public async Task InsertEntitiesAsync<T>(IEnumerable<T> entities)
        where T : class
    {
        await _dbContext.Set<T>().AddRangeAsync(entities);
    }

    /// <summary>
    ///     Insert.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="entity"></param>
    /// <returns></returns>
    public async Task InsertEntityAsync<T>(T entity)
        where T : class
    {
        await _dbContext.Set<T>().AddAsync(entity);
    }

    /// <summary>
    ///     Exists.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="condition"></param>
    /// <returns></returns>
    public async Task<bool> IsEntityExistsAsync<T>(Expression<Func<T, bool>> condition)
        where T : class
    {
        if (condition == null) return false;

        var isExists = await _dbContext.Set<T>().AnyAsync(condition);
        return isExists;
    }

    /// <summary>
    ///     Reset.
    /// </summary>
    public void ResetContextState()
    {
        _dbContext.ChangeTracker.Entries().Where(e => e.Entity != null).ToList()
            .ForEach(e => e.State = EntityState.Detached);
    }

    /// <summary>
    ///     Save Changes.
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    ///     Update.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="entities"></param>
    public void UpdateEntities<T>(IEnumerable<T> entities)
        where T : class
    {
        _dbContext.Set<T>().UpdateRange(entities);
    }

    /// <summary>
    ///     Update.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="entity"></param>
    public void UpdateEntity<T>(T entity)
        where T : class
    {
        var trackedEntity = _dbContext.ChangeTracker.Entries<T>().FirstOrDefault(x => x.Entity == entity);

        if (trackedEntity != null)
            _dbContext.Entry(entity).CurrentValues.SetValues(entity);
        else
            _dbContext.Set<T>().Update(entity);
    }
}