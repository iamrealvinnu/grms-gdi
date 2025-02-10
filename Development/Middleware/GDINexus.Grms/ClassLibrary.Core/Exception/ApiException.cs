#region Copyright GDI Nexus © 2025

//
// NAME:			ApiException.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			API Exception implementing exceptions
//

#endregion

using System.Runtime.Serialization;

namespace ClassLibrary.Core.Exception;

/// <summary>
///     Represents the <see cref="ApiException" /> class.
/// </summary>
[Serializable]
public class ApiException : System.Exception
{
    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="statusCode"></param>
    /// <param name="errors"></param>
    public ApiException(int statusCode, List<string> errors)
    {
        StatusCode = statusCode;
        Errors = errors;
    }

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="statusCode"></param>
    /// <param name="error"></param>
    public ApiException(int statusCode, string error)
    {
        StatusCode = statusCode;
        Errors.Add(error);
    }

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="info"></param>
    /// <param name="context"></param>
    public ApiException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    /// <summary>
    ///     Get status code.
    /// </summary>
    public int StatusCode { get; }

    /// <summary>
    ///     Get set errors.
    /// </summary>
    public List<string> Errors { get; private set; } = [];
}