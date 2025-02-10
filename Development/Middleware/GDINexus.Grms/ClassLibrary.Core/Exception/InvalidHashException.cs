#region Copyright GDI Nexus © 2025

//
// NAME:			InvalidHashException.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Invalid Hash Exception implementing exceptions
//

#endregion

namespace ClassLibrary.Core.Exception;

/// <summary>
///     Represents the <see cref="InvalidHashException" /> class.
/// </summary>
[Serializable]
public class InvalidHashException : System.Exception
{
    /// <summary>
    ///     Constructor.
    /// </summary>
    public InvalidHashException()
    {
    }

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="message"></param>
    public InvalidHashException(string message)
        : base(message)
    {
    }

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="message"></param>
    /// <param name="inner"></param>
    public InvalidHashException(string message, System.Exception inner)
        : base(message, inner)
    {
    }
}