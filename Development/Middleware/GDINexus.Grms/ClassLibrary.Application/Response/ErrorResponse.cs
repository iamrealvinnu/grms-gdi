#region Copyright GDI Nexus © 2025

//
// NAME:			ErrorResponse.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Error Response object
//

#endregion


using ClassLibrary.Core.Response;

namespace ClassLibrary.Application.Response;

/// <summary>
///     Represents the <see cref="ErrorResponse" /> class.
/// </summary>
public class ErrorResponse : IErrorResponse
{
    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="statusCode"></param>
    /// <param name="errors"></param>
    public ErrorResponse(int statusCode, List<string> errors)
    {
        StatusCode = statusCode;
        Errors = errors;
    }

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="statusCode"></param>
    /// <param name="error"></param>
    public ErrorResponse(int statusCode, string error)
    {
        StatusCode = statusCode;
        Errors.Add(error);
    }

    /// <summary>
    ///     Get Success.
    /// </summary>
    public bool Success { get; } = false;

    /// <summary>
    ///     Get status code.
    /// </summary>
    public int StatusCode { get; }


    /// <summary>
    ///     Get set errors.
    /// </summary>
    public List<string> Errors { get; } = [];
}