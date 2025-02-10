#region Copyright GDI Nexus © 2025

//
// NAME:			IDataResponse.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Data Response Interface
//

#endregion

namespace ClassLibrary.Core.Response;

/// <summary>
///     Represents the <see cref="IDataResponse{T}" /> interface.
/// </summary>
/// <typeparam name="T"></typeparam>
public interface IDataResponse<out T> : IResponse
{
    /// <summary>
    ///     Get Data.
    /// </summary>
    T Data { get; }

    /// <summary>
    ///     Get message.
    /// </summary>
    string Message { get; }
}