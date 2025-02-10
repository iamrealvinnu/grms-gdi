#region Copyright GDI Nexus © 2025

//
// NAME:			RsaEncryptor.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Rsa Encryptor implementing encryption
//

#endregion

using System.Security.Cryptography;
using System.Text;

namespace ClassLibrary.Core.Security;

/// <summary>
///     Represents the <see cref="RsaEncryptor" /> class.
/// </summary>
public static class RsaEncryptor
{
    /// <summary>
    ///     Padding
    /// </summary>
    private const bool OptimalAsymmetricEncryptionPadding = false;

    /// <summary>
    ///     Private key, Ideally this should be in the registry
    /// </summary>
    private const string PrivateKey =
        @"MjA0OCE8UlNBS2V5VmFsdWU+PE1vZHVsdXM+eVpNQmhuSDJOZjNHcVNRdGFIUXkvT0tHQXd3NkpRK1gwbEd5dk5sVmcvbCs0bVd5QnM5VUR6RUFiZWQrZkQvMGVrNkVXMlJieFVnMlhZbFhiWjE0RXhOb04zNDZsd0pvOURTRW9BdkxKVnhsbSsvM3J1WTZnNkJtbjZuN2owSVdrUk9Od1FjWkdqMVY5S0NIVEcwaTgyTC9JdGRRS3hGejBMNkhmT2ZONDVRdVdvK3JSV29zTlplNDd2eHFrNDRXVmdrVHVsSm1uVFlYTzZ3Vi9zQW51VVNqMDJiaXJsb0M3c3JxNGpoTXFNUXJDdTF5ZGFWRWZEK05YYTRLd0JablkzNW40aDc0bHRrSndnS01wRVBIOWlkZE5rQy9RbkgrT1BLUGtTMG04eFlPb0JMeUliczFKOHAzTzM0NUIzVEhFMEg5UDFwMHE3R0dvQmJjbTZVQ0NRPT08L01vZHVsdXM+PEV4cG9uZW50PkFRQUI8L0V4cG9uZW50PjxQPjlzNVpzVjU3T1VWZ1J5WGM5cTNCNmFEb3lhL2FYYzdYMUoxWG4xS082QmFIb1owdGNKejVWN202clRuTWNmNTdmNSsweENLT0k3aSt1azVmUzQyM0RlOFFxa3ZvS05qSVFFRW5jbHZLdDJHTUZhQUJrWUY2d1FsYnJucVl3L1YvdW1wU0hSaU8yUEVzK01IQnRRTXNMNXA2QlY2MGFpaUFTZGQ1TzgxdEdtYz08L1A+PFE+MFJWT0xoQjJDeVg4Z1dvWDNUeUZ0MUNsZEVSUUdJeFRMTnluL1VjVlg0cWlqK1FqTVNtQnRpU1h6N0FiYTZadTJFNTVzYmJzMFJ5SmJDajVuNWZlbXFYV2prbjBzY05RT3htTXVtSGZjTXFiY0d0eGNjRkt2YXlJZHE3bWJKSjJNNkZDOUJVWWVKMEppeVN2a3h3cCtudHdrVUVVNUJPU0lISlNtdjZlR2c4PTwvUT48RFA+bm1iRjdpNmppNWhaT0pDMmhxUHloczI5V21UQkUrQURhZlFxSHBsUUd1a0sxOUVYTHVXd3Fuc0xzczRieHpYN2NXZkJEdmpXblZxZkh0ZmFGWlc0M1BxSWlhUDZOdTBiYVJIb0RWK1lkYVhuMEtGSElHb25yT2tpckpNR3BRNVZrZ0ZXL2xHYXJPWHRaU0tGL25VdzBNU21kL2ZXZHlQVFlwRW13QmtTWXhVPTwvRFA+PERRPnlYby9ZUkpKdmdwMzNYbVB6NGhQemt0dmRLK1RnMlJOamxCL3JRaS9wdGFnT2dwOGd4WmRRVmpYMWJIOWFtbnlMSXpLcGg4QTY2MFZHOTRNVmVieUFwSkdRODB1ZDlJZlVTUVl3VTRwRTdhWnZPWThab0w5OC9MN2VXcW03djdmMm5iT1h3aXBFU2s2bGhQZkFPTEY3UExna1lobWlqWDF2VUNOSzRDcWQ2OD08L0RRPjxJbnZlcnNlUT42ZTlENWZaQmowQ042VTI1bDJtc1NaZ2NrblltSUxPeWhQdk9FVGhzQ2RkVVVibzQ3Wk0wank0aFUzSTN6Z0oyQWc1ais5bVV2eWFsUVpQRWRQQkMvYU1zRnQ0QTdJdGcyME9UYnVyNlNiMXhHWGlkVnZvSGFQblNoK3VZQ1h3KzhHYW1KRlo1NlVhZ2xKeDdubWFMbTQyU3YwbllwcFk3WUM1ejh5R0wxSlE9PC9JbnZlcnNlUT48RD5ET2x6d1k3dlBJb2kvWmFwcWZVM2h1ZGp1akpBVHp0dWVEUnZoSlZQV3dMU1UrSTd3eC9vdkloaEJLazlldXdGMXdmTWhxWXBFcndMYjNacXVVVEsrajNXQVNmK3pNbUV1NC9acHY3YVpteEN2ZmhqSHpyMEtKWlB2STZBNUs1UkQ3MzI2SlJ4MFRKNG5SRGpXY3ZyM3pkS0xJc3FRWGYrdVRKYkwyOFJ5ekFIakRwUTNrNGtXdG5ucDg2dW9lMDNlOVk2ZDFUN21OOW81MTBLOGFVVmQ3WEorT1FnQ0RwSjdHSXFlU3Q5MFB0VkFKUmpUZ1dQMEp3c1pUaXlxNHp2ckFBWE1ZVlNza3MvVS9LN1JlUTFUaFVyVFR5Y2ZFWXFiTlN4a0M2ZWlFSW9sQnAwSEc1aHQrYTRRWXh3cWcyNzlLWnlsbW9QMGpxWThCWWlLeWdvK1E9PTwvRD48L1JTQUtleVZhbHVlPg==";

    /// <summary>
    ///     Encrypt text
    /// </summary>
    /// <param name="text"></param>
    /// <param name="publicKey"></param>
    /// <returns></returns>
    public static string EncryptText(string text, string publicKey)
    {
        GetKeyFromEncryptionString(publicKey, out var keySize, out var publicKeyXml);
        var encrypted = Encrypt(Encoding.UTF8.GetBytes(text), keySize, publicKeyXml);
        return Convert.ToBase64String(encrypted);
    }

    /// <summary>
    ///     Encrypt bytes
    /// </summary>
    /// <param name="data"></param>
    /// <param name="keySize"></param>
    /// <param name="publicKeyXml"></param>
    /// <returns></returns>
    private static byte[] Encrypt(byte[] data, int keySize, string publicKeyXml)
    {
        if (data == null || data.Length == 0) throw new ArgumentException("Data are empty", nameof(data));
        var maxLength = GetMaxDataLength(keySize);
        if (data.Length > maxLength)
            throw new ArgumentException($"Maximum data length is {maxLength}", nameof(data));
        if (!IsKeySizeValid(keySize)) throw new ArgumentException("Key size is not valid", nameof(keySize));
        if (string.IsNullOrEmpty(publicKeyXml)) throw new ArgumentException("Key is null or empty", nameof(publicKeyXml));

        using var provider = new RSACryptoServiceProvider(keySize);
        provider.FromXmlString(publicKeyXml);
        return provider.Encrypt(data, OptimalAsymmetricEncryptionPadding);
    }

    /// <summary>
    ///     Decrypt text
    /// </summary>
    /// <param name="text"></param>
    /// <returns></returns>
    public static string DecryptText(string text)
    {
        GetKeyFromEncryptionString(PrivateKey, out var keySize, out var publicAndPrivateKeyXml);
        var decrypted = Decrypt(Convert.FromBase64String(text), keySize, publicAndPrivateKeyXml);
        return Encoding.UTF8.GetString(decrypted);
    }

    /// <summary>
    ///     Decrypt bytes
    /// </summary>
    /// <param name="data"></param>
    /// <param name="keySize"></param>
    /// <param name="publicAndPrivateKeyXml"></param>
    /// <returns></returns>
    private static byte[] Decrypt(byte[] data, int keySize, string publicAndPrivateKeyXml)
    {
        if (data == null || data.Length == 0) throw new ArgumentException("Data are empty", nameof(data));
        if (!IsKeySizeValid(keySize)) throw new ArgumentException("Key size is not valid", nameof(keySize));
        if (string.IsNullOrEmpty(publicAndPrivateKeyXml))
            throw new ArgumentException("Key is null or empty", nameof(publicAndPrivateKeyXml));

        using var provider = new RSACryptoServiceProvider(keySize);
        provider.FromXmlString(publicAndPrivateKeyXml);
        return provider.Decrypt(data, OptimalAsymmetricEncryptionPadding);
    }

    /// <summary>
    ///     Get maximum data length
    /// </summary>
    /// <param name="keySize"></param>
    /// <returns></returns>
    public static int GetMaxDataLength(int keySize)
    {
        if (OptimalAsymmetricEncryptionPadding)
            return (keySize - 384) / 8 + 7;
        return (keySize - 384) / 8 + 37;
    }

    /// <summary>
    ///     Validate key size
    /// </summary>
    /// <param name="keySize"></param>
    /// <returns></returns>
    public static bool IsKeySizeValid(int keySize)
    {
        return keySize >= 384 &&
               keySize <= 16384 &&
               keySize % 8 == 0;
    }

    /// <summary>
    ///     Get keys from encryption string
    /// </summary>
    /// <param name="rawkey"></param>
    /// <param name="keySize"></param>
    /// <param name="xmlKey"></param>
    private static void GetKeyFromEncryptionString(string rawkey, out int keySize, out string xmlKey)
    {
        keySize = 0;
        xmlKey = "";

        if (rawkey.Length > 0)
        {
            var keyBytes = Convert.FromBase64String(rawkey);
            var stringKey = Encoding.UTF8.GetString(keyBytes);

            if (stringKey.Contains("!"))
            {
                var splittedValues = stringKey.Split(['!'], 2);

                keySize = int.Parse(splittedValues[0]);
                xmlKey = splittedValues[1];
            }
        }
    }
}