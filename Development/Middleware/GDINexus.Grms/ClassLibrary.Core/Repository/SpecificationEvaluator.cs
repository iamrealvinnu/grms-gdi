#region Copyright GDI Nexus © 2025

//
// NAME:			SpecificationEvaluator.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			SpecificationEvaluator static class
//

#endregion

using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ClassLibrary.Core.Repository;

/// <summary>
///     Represents the <see cref="SpecificationEvaluator" /> class.
/// </summary>
public static class SpecificationEvaluator
{
    /// <summary>
    ///     GetSpecifiedQuery.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="inputQuery"></param>
    /// <param name="specification"></param>
    /// <returns></returns>
    public static IQueryable<T> GetSpecifiedQuery<T>(this IQueryable<T> inputQuery, Specification<T> specification)
        where T : class
    {
        if (inputQuery == null) throw new ArgumentNullException(nameof(inputQuery));

        if (specification == null) throw new ArgumentNullException(nameof(specification));

        var query = inputQuery;

        // modify the IQueryable using the specification's criteria expression
        if (specification.Conditions != null && specification.Conditions.Any())
            foreach (var specificationCondition in specification.Conditions)
                query = query.Where(specificationCondition);

        // Includes all expression-based includes
        if (specification.Includes != null) query = specification.Includes(query);

        // Include any string-based include statements
        if (specification.IncludeStrings != null && specification.IncludeStrings.Any())
            query = specification.IncludeStrings.Aggregate(query, (current, include) => current.Include(include));

        // Apply ordering if expressions are set
        if (specification.OrderBy != null)
        {
            query = specification.OrderBy(query);
        }
        else if (!(string.IsNullOrWhiteSpace(specification.OrderByDynamic.ColumnName) ||
                   string.IsNullOrWhiteSpace(specification.OrderByDynamic.ColumnName)))
        {
            //query = query.OrderBy(specification.OrderByDynamic.ColumnName + " " + specification.OrderByDynamic.SortDirection);
            var type = typeof(T);
            var property = type.GetProperty(specification.OrderByDynamic.ColumnName);
            var parameter = Expression.Parameter(type, "p");
            var propertyAccess = Expression.MakeMemberAccess(parameter, property);
            var orderByExp = Expression.Lambda(propertyAccess, parameter);
            var resultExp = Expression.Call(typeof(Queryable), "OrderBy", new[] { type, property.PropertyType },
                query.Expression, Expression.Quote(orderByExp));
            query = query.Provider.CreateQuery<T>(resultExp);
        }

        // Apply paging if enabled
        if (specification.Skip != null) query = query.Skip((int)specification.Skip);

        if (specification.Take != null) query = query.Take((int)specification.Take);

        return query;
    }
}