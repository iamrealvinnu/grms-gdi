#region Copyright GDI Nexus © 2025

//
// NAME:			IErrorResponse.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Error Response Interface
//

#endregion

namespace ClassLibrary.Core.Response;

/// <summary>
///     Represents the <see cref="IErrorResponse" /> interface.
/// </summary>
public interface IErrorResponse : IResponse
{
    /// <summary>
    ///     Get errors.
    /// </summary>
    List<string> Errors { get; }
}