#region Copyright GDI Nexus © 2025

//
// NAME:			ISuccessResponse.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Success Response Interface
//

#endregion

namespace ClassLibrary.Core.Response;

/// <summary>
///     Represents the <see cref="ISuccessResponse" /> interface.
/// </summary>
public interface ISuccessResponse : IResponse
{
    /// <summary>
    ///     Get message.
    /// </summary>
    string Message { get; }
}