#region Copyright GDI Nexus © 2025

//
// NAME:			CannotPerformOperationException.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Cannot Perform Operation Exception implementing exceptions
//

#endregion

namespace ClassLibrary.Core.Exception;

/// <summary>
///     Represents the <see cref="CannotPerformOperationException " /> class.
/// </summary>
[Serializable]
public class CannotPerformOperationException : System.Exception
{
    /// <summary>
    ///     Constructor.
    /// </summary>
    public CannotPerformOperationException()
    {
    }

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="message"></param>
    public CannotPerformOperationException(string message)
        : base(message)
    {
    }

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="message"></param>
    /// <param name="inner"></param>
    public CannotPerformOperationException(string message, System.Exception inner)
        : base(message, inner)
    {
    }
}