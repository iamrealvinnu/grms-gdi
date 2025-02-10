#region Copyright GDI Nexus © 2025

//
// NAME:			SuccessResponse.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Success Response object
//

#endregion

using ClassLibrary.Core.Response;

namespace ClassLibrary.Application.Response;

/// <summary>
///     Represents the <see cref="SuccessResponse" /> class.
/// </summary>
public class SuccessResponse : ISuccessResponse
{
    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="statusCode"></param>
    /// <param name="message"></param>
    public SuccessResponse(int statusCode, string message)
    {
        StatusCode = statusCode;
        Message = message;
    }

    /// <summary>
    ///     Get success.
    /// </summary>
    public bool Success { get; } = true;

    /// <summary>
    ///     Get message.
    /// </summary>
    public string Message { get; }

    /// <summary>
    ///     Get status code.
    /// </summary>
    public int StatusCode { get; }
}