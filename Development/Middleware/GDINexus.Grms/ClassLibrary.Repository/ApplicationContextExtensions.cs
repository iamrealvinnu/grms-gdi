#region Copyright GDI Nexus © 2025

//
// NAME:			ApplicationContextExtensions.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Application context extensions
//

#endregion

using System.Data;
using System.Dynamic;
using Microsoft.EntityFrameworkCore;

namespace ClassLibrary.Repository;

/// <summary>
///     Represents the <see cref="ApplicationContextExtensions" /> Extension.
/// </summary>
internal static class ApplicationContextExtensions
{
    /// <summary>
    ///     Dynamic List from SQL
    /// </summary>
    /// <param name="db"></param>
    /// <param name="sql"></param>
    /// <param name="params"></param>
    /// <returns></returns>
    public static IEnumerable<dynamic> DynamicListFromSql(this DbContext db, string sql,
        Dictionary<string, object> @params)
    {
        using var cmd = db.Database.GetDbConnection().CreateCommand();
        cmd.CommandText = sql;
        if (cmd.Connection != null && cmd.Connection.State != ConnectionState.Open) cmd.Connection.Open();

        foreach (var p in @params)
        {
            var dbParameter = cmd.CreateParameter();
            dbParameter.ParameterName = p.Key;
            dbParameter.Value = p.Value;
            //dbParameter.Direction = ParameterDirection.Input;
            cmd.Parameters.Add(dbParameter);
        }

        using var dataReader = cmd.ExecuteReader();

        while (dataReader.Read())
        {
            var row = new ExpandoObject() as IDictionary<string, object>;
            for (var fieldCount = 0; fieldCount < dataReader.FieldCount; fieldCount++)
                row.Add(dataReader.GetName(fieldCount), dataReader[fieldCount]);
            yield return row;
        }
    }

    /// <summary>
    ///     Execute Stored Procedure
    /// </summary>
    /// <param name="db"></param>
    /// <param name="sql"></param>
    /// <param name="params"></param>
    /// <param name="hasReturnValue"></param>
    /// <returns></returns>
    public static async Task<object?> ExecuteStoredProcedureFromSql(this DbContext db, string sql,
        Dictionary<string, object> @params, bool hasReturnValue = false)
    {
        await using var cmd = db.Database.GetDbConnection().CreateCommand();
        cmd.CommandText = sql;
        cmd.CommandType = CommandType.StoredProcedure;
        if (cmd.Connection != null && cmd.Connection.State != ConnectionState.Open) cmd.Connection.Open();

        foreach (var p in @params)
        {
            var dbParameter = cmd.CreateParameter();
            dbParameter.ParameterName = p.Key;
            dbParameter.Value = p.Value;
            dbParameter.Direction = ParameterDirection.Input;
            cmd.Parameters.Add(dbParameter);
        }

        if (hasReturnValue)
        {
            var returnValue = cmd.CreateParameter();
            returnValue.Direction = ParameterDirection.ReturnValue;
            cmd.Parameters.Add(returnValue);
            await cmd.ExecuteNonQueryAsync();
            return returnValue.Value;
        }

        return await cmd.ExecuteNonQueryAsync();
    }
}