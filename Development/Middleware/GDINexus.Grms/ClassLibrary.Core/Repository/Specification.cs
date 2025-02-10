#region Copyright GDI Nexus © 2025

//
// NAME:			Specification.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Specification class
//

#endregion

using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore.Query;

namespace ClassLibrary.Core.Repository;

/// <summary>
///     Represents the <see cref="Specification{T}" /> object.
/// </summary>
/// <typeparam name="T">The database entity.</typeparam>
public class Specification<T>
    where T : class
{
    /// <summary>
    ///     Gets or sets the <see cref="Expression" /> list you want to pass with your EF Core query.
    /// </summary>
    public List<Expression<Func<T, bool>>> Conditions { get; set; } = new();

    /// <summary>
    ///     Gets or sets the navigation entities to be eager loaded with EF Core query.
    /// </summary>
    public Func<IQueryable<T>, IIncludableQueryable<T, object>> Includes { get; set; }

    /// <summary>
    ///     Gets or add the navigation entities to be eager loaded with EF Core query in string format.
    /// </summary>
    public List<string> IncludeStrings { get; } = new();

    /// <summary>
    ///     Gets or sets the <see cref="Func{T, TResult}" /> to order by your query.
    /// </summary>
    public Func<IQueryable<T>, IOrderedQueryable<T>> OrderBy { get; set; }

    /// <summary>
    ///     Gets or sets dynmic order by option in string format.
    /// </summary>
    public (string ColumnName, string SortDirection) OrderByDynamic { get; set; }

    /// <summary>
    ///     Gets or sets the value of number of entity you want to skip in your query.
    /// </summary>
    public int? Skip { get; set; }

    /// <summary>
    ///     Gets or sets the value of number of entity you want to take in your query.
    /// </summary>
    public int? Take { get; set; }
}