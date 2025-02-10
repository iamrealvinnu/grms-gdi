#region Copyright GDI Nexus © 2025

//
// NAME:			Response.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Response object
//

#endregion

using ClassLibrary.Core.Response;

namespace ClassLibrary.Application.Response;

/// <summary>
///     Represents the <see cref="Response" /> class.
/// </summary>
public class Response : IResponse
{
    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="success"></param>
    /// <param name="statusCode"></param>
    public Response(bool success, int statusCode)
    {
        Success = success;
        StatusCode = statusCode;
    }

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="success"></param>
    public Response(bool success)
    {
        Success = success;
    }

    /// <summary>
    ///     Get success.
    /// </summary>
    public bool Success { get; }

    /// <summary>
    ///     Get status code.
    /// </summary>
    public int StatusCode { get; }
}