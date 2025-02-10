#region Copyright GDI Nexus © 2025

//
// NAME:			UnitOfWorkRepository.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Implementing the Unit of Work Repository
//

#endregion

using System.Data;
using System.Globalization;
using System.Linq.Expressions;
using ClassLibrary.Core.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace ClassLibrary.Repository;

/// <summary>
///     Represents the <see cref="UnitOfWorkRepository{TEntity}" /> class.
/// </summary>
/// <typeparam name="TEntity"></typeparam>
internal class UnitOfWorkRepository<TEntity> : IUnitOfWorkRepository<TEntity>
    where TEntity : class
{
    /// <summary>
    ///     DB Context.
    /// </summary>
    private readonly ApplicationContext _dbContext;

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="dbContext"></param>
    public UnitOfWorkRepository(ApplicationContext dbContext)
    {
        _dbContext = dbContext;
        Entities = dbContext.Set<TEntity>();
    }

    /// <summary>
    ///     Delete entities.
    /// </summary>
    /// <param name="entities"></param>
    public void DeleteEntities(IEnumerable<TEntity> entities)
    {
        _dbContext.Set<TEntity>().RemoveRange(entities);
    }

    /// <summary>
    ///     Delete entity.
    /// </summary>
    /// <param name="entity"></param>
    public void DeleteEntity(TEntity entity)
    {
        _dbContext.Set<TEntity>().Remove(entity);
    }

    /// <summary>
    ///     Entities.
    /// </summary>
    public IQueryable<TEntity> Entities { get; }


    /// <summary>
    ///     Get Count Async.
    /// </summary>
    /// <returns></returns>
    public async Task<int> GetCountAsync()
    {
        var count = await _dbContext.Set<TEntity>().CountAsync();
        return count;
    }

    /// <summary>
    ///     Get count async.
    /// </summary>
    /// <param name="conditions"></param>
    /// <returns></returns>
    public async Task<int> GetCountAsync(params Expression<Func<TEntity, bool>>[] conditions)
    {
        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        if (conditions == null) return await query.CountAsync();

        foreach (var expression in conditions) query = query.Where(expression);

        return await query.CountAsync();
    }

    /// <summary>
    ///     Get entity async.
    /// </summary>
    /// <param name="condition"></param>
    /// <param name="asNoTracking"></param>
    /// <returns></returns>
    public async Task<TEntity> GetEntityAsync(Expression<Func<TEntity, bool>> condition, bool asNoTracking = false)
    {
        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        if (condition != null) query = query.Where(condition);

        if (asNoTracking) query = query.AsNoTracking();

        return await query.FirstOrDefaultAsync();
    }


    /// <summary>
    ///     Get entity async.
    /// </summary>
    /// <param name="specification"></param>
    /// <param name="asNoTracking"></param>
    /// <returns></returns>
    public async Task<TEntity> GetEntityAsync(Specification<TEntity> specification, bool asNoTracking = false)
    {
        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        if (specification != null) query = query.GetSpecifiedQuery(specification);

        if (asNoTracking) query = query.AsNoTracking();

        return await query.FirstOrDefaultAsync();
    }

    /// <summary>
    ///     Get entity by Id.
    /// </summary>
    /// <param name="id"></param>
    /// <param name="asNoTracking"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="ArgumentException"></exception>
    public async Task<TEntity> GetEntityByIdAsync(object id, bool asNoTracking = false)
    {
        if (id == null) throw new ArgumentNullException(nameof(id));

        var entityType = _dbContext.Model.FindEntityType(typeof(TEntity));

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

        var pe = Expression.Parameter(typeof(TEntity), "entity");
        var me = Expression.Property(pe, primaryKeyName);
        var constant = Expression.Constant(primayKeyValue, primaryKeyType);
        var body = Expression.Equal(me, constant);
        var expressionTree = Expression.Lambda<Func<TEntity, bool>>(body, pe);

        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        if (asNoTracking)
        {
            var noTrackedEntity = await query.AsNoTracking().FirstOrDefaultAsync(expressionTree);
            return noTrackedEntity;
        }

        var trackedEntity = await query.FirstOrDefaultAsync(expressionTree);
        return trackedEntity;
    }

    /// <summary>
    ///     Get Entity List Async.
    /// </summary>
    /// <param name="asNoTracking"></param>
    /// <returns></returns>
    public async Task<List<TEntity>> GetEntityListAsync(bool asNoTracking = false)
    {
        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        if (asNoTracking) query = query.AsNoTracking();

        var entities = await query.ToListAsync();

        return entities;
    }

    /// <summary>
    ///     Get Entity List Async
    /// </summary>
    /// <param name="condition"></param>
    /// <param name="asNoTracking"></param>
    /// <returns></returns>
    public async Task<List<TEntity>> GetEntityListAsync(Expression<Func<TEntity, bool>> condition,
        bool asNoTracking = false)
    {
        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        if (condition != null) query = query.Where(condition);

        if (asNoTracking) query = query.AsNoTracking();

        var entities = await query.ToListAsync();

        return entities;
    }

    /// <summary>
    ///     Get Entity List.
    /// </summary>
    /// <param name="specification"></param>
    /// <param name="asNoTracking"></param>
    /// <returns></returns>
    public async Task<List<TEntity>> GetEntityListAsync(Specification<TEntity> specification,
        bool asNoTracking = false)
    {
        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        if (specification != null) query = query.GetSpecifiedQuery(specification);

        if (asNoTracking) query = query.AsNoTracking();

        return await query.ToListAsync();
    }

    /// <summary>
    ///     Get long count.
    /// </summary>
    /// <returns></returns>
    public async Task<long> GetLongCountAsync()
    {
        var count = await _dbContext.Set<TEntity>().LongCountAsync();
        return count;
    }

    /// <summary>
    ///     Get long count.
    /// </summary>
    /// <param name="conditions"></param>
    /// <returns></returns>
    public async Task<long> GetLongCountAsync(params Expression<Func<TEntity, bool>>[] conditions)
    {
        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        if (conditions == null) return await query.LongCountAsync();

        foreach (var expression in conditions) query = query.Where(expression);

        return await query.LongCountAsync();
    }


    /// <summary>
    ///     Get projected entity.
    /// </summary>
    /// <typeparam name="TProjectedType"></typeparam>
    /// <param name="condition"></param>
    /// <param name="selectExpression"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    public async Task<TProjectedType> GetProjectedEntityAsync<TProjectedType>(
        Expression<Func<TEntity, bool>> condition,
        Expression<Func<TEntity, TProjectedType>> selectExpression)
    {
        if (selectExpression == null) throw new ArgumentNullException(nameof(selectExpression));

        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        if (condition != null) query = query.Where(condition);

        return await query.Select(selectExpression).FirstOrDefaultAsync();
    }

    /// <summary>
    ///     Get projected entity.
    /// </summary>
    /// <typeparam name="TProjectedType"></typeparam>
    /// <param name="specification"></param>
    /// <param name="selectExpression"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    public async Task<TProjectedType> GetProjectedEntityAsync<TProjectedType>(
        Specification<TEntity> specification,
        Expression<Func<TEntity, TProjectedType>> selectExpression)
    {
        if (selectExpression == null) throw new ArgumentNullException(nameof(selectExpression));

        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        if (specification != null) query = query.GetSpecifiedQuery(specification);

        return await query.Select(selectExpression).FirstOrDefaultAsync();
    }

    /// <summary>
    ///     Get projected entity.
    /// </summary>
    /// <typeparam name="TProjectedType"></typeparam>
    /// <param name="id"></param>
    /// <param name="selectExpression"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="ArgumentException"></exception>
    public async Task<TProjectedType> GetProjectedEntityByIdAsync<TProjectedType>(
        object id,
        Expression<Func<TEntity, TProjectedType>> selectExpression)
    {
        if (id == null) throw new ArgumentNullException(nameof(id));

        if (selectExpression == null) throw new ArgumentNullException(nameof(selectExpression));

        var entityType = _dbContext.Model.FindEntityType(typeof(TEntity));

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

        var pe = Expression.Parameter(typeof(TEntity), "entity");
        var me = Expression.Property(pe, primaryKeyName);
        var constant = Expression.Constant(primayKeyValue, primaryKeyType);
        var body = Expression.Equal(me, constant);
        var expressionTree = Expression.Lambda<Func<TEntity, bool>>(body, pe);

        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        return await query.Where(expressionTree).Select(selectExpression).FirstOrDefaultAsync();
    }

    /// <summary>
    ///     Get projected entity list.
    /// </summary>
    /// <typeparam name="TProjectedType"></typeparam>
    /// <param name="selectExpression"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    public async Task<List<TProjectedType>> GetProjectedEntityListAsync<TProjectedType>(
        Expression<Func<TEntity, TProjectedType>> selectExpression)
    {
        if (selectExpression == null) throw new ArgumentNullException(nameof(selectExpression));

        var entities = await _dbContext.Set<TEntity>().Select(selectExpression).ToListAsync();

        return entities;
    }

    /// <summary>
    ///     Get projected entity list.
    /// </summary>
    /// <typeparam name="TProjectedType"></typeparam>
    /// <param name="condition"></param>
    /// <param name="selectExpression"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    public async Task<List<TProjectedType>> GetProjectedEntityListAsync<TProjectedType>(
        Expression<Func<TEntity, bool>> condition,
        Expression<Func<TEntity, TProjectedType>> selectExpression)
    {
        if (selectExpression == null) throw new ArgumentNullException(nameof(selectExpression));

        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        if (condition != null) query = query.Where(condition);

        var projectedEntites = await query.Select(selectExpression).ToListAsync();

        return projectedEntites;
    }

    /// <summary>
    ///     Get projected entity.
    /// </summary>
    /// <typeparam name="TProjectedType"></typeparam>
    /// <param name="specification"></param>
    /// <param name="selectExpression"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    public async Task<List<TProjectedType>> GetProjectedEntityListAsync<TProjectedType>(
        Specification<TEntity> specification,
        Expression<Func<TEntity, TProjectedType>> selectExpression)
    {
        if (selectExpression == null) throw new ArgumentNullException(nameof(selectExpression));

        IQueryable<TEntity> query = _dbContext.Set<TEntity>();

        if (specification != null) query = query.GetSpecifiedQuery(specification);

        return await query.Select(selectExpression).ToListAsync();
    }

    /// <summary>
    ///     Insert entity.
    /// </summary>
    /// <param name="entities"></param>
    /// <returns></returns>
    public async Task InsertEntitiesAsync(IEnumerable<TEntity> entities)
    {
        await _dbContext.Set<TEntity>().AddRangeAsync(entities);
    }

    /// <summary>
    ///     Insert entity.
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public async Task InsertEntityAsync(TEntity entity)
    {
        await _dbContext.Set<TEntity>().AddAsync(entity);
    }

    /// <summary>
    ///     Does entity exist.
    /// </summary>
    /// <param name="condition"></param>
    /// <returns></returns>
    public async Task<bool> IsEntityExistsAsync(Expression<Func<TEntity, bool>> condition)
    {
        if (condition == null) return false;

        var isExists = await _dbContext.Set<TEntity>().AnyAsync(condition);
        return isExists;
    }

    /// <summary>
    ///     Update entities.
    /// </summary>
    /// <param name="entities"></param>
    public void UpdateEntities(IEnumerable<TEntity> entities)
    {
        _dbContext.Set<TEntity>().UpdateRange(entities);
    }

    /// <summary>
    ///     Update entity.
    /// </summary>
    /// <param name="entity"></param>
    public void UpdateEntity(TEntity entity)
    {
        var trackedEntity = _dbContext.ChangeTracker.Entries<TEntity>().FirstOrDefault(x => x.Entity == entity);

        if (trackedEntity != null)
            _dbContext.Entry(entity).CurrentValues.SetValues(entity);
        else
            _dbContext.Set<TEntity>().Update(entity);
    }

    /// <summary>
    ///     Begin transaction.
    /// </summary>
    /// <returns></returns>
    public IDbTransaction BeginTransaction()
    {
        var transaction = _dbContext.Database.BeginTransaction();
        return transaction.GetDbTransaction();
    }
}