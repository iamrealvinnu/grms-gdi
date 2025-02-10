#region Copyright GDI Nexus © 2025

//
// NAME:			IResponse.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Response Interface
//

#endregion

namespace ClassLibrary.Core.Response;

/// <summary>
///     Represents the <see cref="IResponse" /> interface.
/// </summary>
public interface IResponse
{
    /// <summary>
    ///     Get success.
    /// </summary>
    bool Success { get; }

    /// <summary>
    ///     Get status code.
    /// </summary>
    int StatusCode { get; }
}