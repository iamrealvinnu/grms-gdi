#region Copyright GDI Nexus © 2025

//
// NAME:			DataResponse.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Data Response object
//

#endregion

using System.Text.Json.Serialization;
using ClassLibrary.Core.Response;

namespace ClassLibrary.Application.Response;

/// <summary>
///     Represents the <see cref="DataResponse{T}" /> class.
/// </summary>
/// <typeparam name="T"></typeparam>
public class DataResponse<T> : IDataResponse<T>
{
    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="data"></param>
    /// <param name="statusCode"></param>
    [JsonConstructor]
    public DataResponse(T data, int statusCode)
    {
        Data = data;
        StatusCode = statusCode;
    }

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="data"></param>
    /// <param name="statusCode"></param>
    /// <param name="message"></param>
    public DataResponse(T data, int statusCode, string message)
    {
        Data = data;
        StatusCode = statusCode;
        Message = message;
    }

    /// <summary>
    ///     Get success.
    /// </summary>
    public bool Success { get; } = true;

    /// <summary>
    ///     Get data.
    /// </summary>
    public T Data { get; }

    /// <summary>
    ///     Get status code.
    /// </summary>
    public int StatusCode { get; }

    /// <summary>
    ///     Get sets message.
    /// </summary>
    public string? Message { get; set; }
}