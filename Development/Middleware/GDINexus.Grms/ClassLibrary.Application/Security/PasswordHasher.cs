#region Copyright GDI Nexus © 2025

//
// NAME:			PasswordHasher.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Password hasher implementing encryption for password
//

#endregion

using System.Security.Cryptography;
using ClassLibrary.Core.Exception;
using Microsoft.AspNetCore.Identity;

namespace ClassLibrary.Application.Security;

/// <summary>
///     Represents the <see cref="PasswordHasher{TUser}" /> class.
/// </summary>
public class PasswordHasher<TUser> : IPasswordHasher<TUser> where TUser : class
{
    // These constants may be changed without breaking existing hashes.
    public const int SaltBytes = 32;
    public const int HashBytes = 24;
    public const int Pbkdf2Iterations = 72000;

    // These constants define the encoding and may not be changed.
    public const int HashSections = 5;
    public const int HashAlgorithmIndex = 0;
    public const int IterationIndex = 1;
    public const int HashSizeIndex = 2;
    public const int SaltIndex = 3;
    public const int Pbkdf2Index = 4;

    /// <summary>
    ///     Create the hash given a password
    /// </summary>
    /// <param name="password"></param>
    /// <returns></returns>
    private static string CreateHash(string password)
    {
        // Generate a random salt
        var salt = new byte[SaltBytes];
        try
        {
            using var csprng = new RNGCryptoServiceProvider();
            csprng.GetBytes(salt);
        }
        catch (CryptographicException ex)
        {
            throw new CannotPerformOperationException(
                "Random number generator not available.",
                ex
            );
        }
        catch (ArgumentNullException ex)
        {
            throw new CannotPerformOperationException(
                "Invalid argument given to random number generator.",
                ex
            );
        }

        var hash = Pbkdf2(password, salt, Pbkdf2Iterations, HashBytes);

        // format: algorithm:iterations:hashSize:salt:hash
        var parts = "sha1:" +
                    Pbkdf2Iterations +
                    ":" +
                    hash.Length +
                    ":" +
                    Convert.ToBase64String(salt) +
                    ":" +
                    Convert.ToBase64String(hash);
        return parts;
    }

    /// <summary>
    ///     Verify password
    /// </summary>
    /// <param name="password"></param>
    /// <param name="goodHash"></param>
    /// <returns></returns>
    private static bool VerifyPassword(string password, string goodHash)
    {
        char[] delimiter = { ':' };
        var split = goodHash.Split(delimiter);

        if (split.Length != HashSections)
            throw new InvalidHashException(
                "Fields are missing from the password hash."
            );

        // We only support SHA1 with C#.
        if (split[HashAlgorithmIndex] != "sha1")
            throw new CannotPerformOperationException(
                "Unsupported hash type."
            );

        var iterations = 0;
        try
        {
            iterations = int.Parse(split[IterationIndex]);
        }
        catch (ArgumentNullException ex)
        {
            throw new CannotPerformOperationException(
                "Invalid argument given to Int32.Parse",
                ex
            );
        }
        catch (FormatException ex)
        {
            throw new InvalidHashException(
                "Could not parse the iteration count as an integer.",
                ex
            );
        }
        catch (OverflowException ex)
        {
            throw new InvalidHashException(
                "The iteration count is too large to be represented.",
                ex
            );
        }

        if (iterations < 1)
            throw new InvalidHashException(
                "Invalid number of iterations. Must be >= 1."
            );

        byte[] salt;
        try
        {
            salt = Convert.FromBase64String(split[SaltIndex]);
        }
        catch (ArgumentNullException ex)
        {
            throw new CannotPerformOperationException(
                "Invalid argument given to Convert.FromBase64String",
                ex
            );
        }
        catch (FormatException ex)
        {
            throw new InvalidHashException(
                "Base64 decoding of salt failed.",
                ex
            );
        }

        byte[]? hash;
        try
        {
            hash = Convert.FromBase64String(split[Pbkdf2Index]);
        }
        catch (ArgumentNullException ex)
        {
            throw new CannotPerformOperationException(
                "Invalid argument given to Convert.FromBase64String",
                ex
            );
        }
        catch (FormatException ex)
        {
            throw new InvalidHashException(
                "Base64 decoding of pbkdf2 output failed.",
                ex
            );
        }

        var storedHashSize = 0;
        try
        {
            storedHashSize = int.Parse(split[HashSizeIndex]);
        }
        catch (ArgumentNullException ex)
        {
            throw new CannotPerformOperationException(
                "Invalid argument given to Int32.Parse",
                ex
            );
        }
        catch (FormatException ex)
        {
            throw new InvalidHashException(
                "Could not parse the hash size as an integer.",
                ex
            );
        }
        catch (OverflowException ex)
        {
            throw new InvalidHashException(
                "The hash size is too large to be represented.",
                ex
            );
        }

        if (storedHashSize != hash.Length)
            throw new InvalidHashException(
                "Hash length doesn't match stored hash length."
            );

        var testHash = Pbkdf2(password, salt, iterations, hash.Length);
        return SlowEquals(hash, testHash);
    }

    /// <summary>
    ///     SlowEquals
    /// </summary>
    /// <param name="a"></param>
    /// <param name="b"></param>
    /// <returns></returns>
    private static bool SlowEquals(byte[]? a, byte[] b)
    {
        var diff = (uint)a.Length ^ (uint)b.Length;
        for (var i = 0; i < a.Length && i < b.Length; i++) diff |= (uint)(a[i] ^ b[i]);
        return diff == 0;
    }

    /// <summary>
    ///     PBKDF2 implementation
    /// </summary>
    /// <param name="password"></param>
    /// <param name="salt"></param>
    /// <param name="iterations"></param>
    /// <param name="outputBytes"></param>
    /// <returns></returns>
    private static byte[] Pbkdf2(string password, byte[] salt, int iterations, int outputBytes)
    {
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt);
        pbkdf2.IterationCount = iterations;
        return pbkdf2.GetBytes(outputBytes);
    }
    
    #region Implementation of IPasswordHasher<TUser>

    /// <summary>
    ///     Hash password.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="password">The password.</param>
    /// <returns></returns>
    public string HashPassword(TUser user, string password)
    {
        if (user == null)
            throw new ArgumentException("Invalid user");
        if (string.IsNullOrEmpty(password))
            throw new ArgumentException("Invalid password", password);
        return CreateHash(password);
    }

    /// <summary>
    ///     Verify hashed password.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="hashedPassword">The hashed password.</param>
    /// <param name="providedPassword">The provided password.</param>
    /// <returns></returns>
    public PasswordVerificationResult VerifyHashedPassword(TUser user, string hashedPassword,
        string providedPassword)
    {
        if (user == null)
            throw new ArgumentException("Invalid user");
        if (string.IsNullOrEmpty(hashedPassword))
            throw new ArgumentException("Invalid hashed password", hashedPassword);
        if (string.IsNullOrEmpty(providedPassword))
            throw new ArgumentException("Invalid provided password", providedPassword);
        return VerifyPassword(providedPassword, hashedPassword)
            ? PasswordVerificationResult.Success
            : PasswordVerificationResult.Failed;
    }

    #endregion
}