#region Copyright GDI Nexus © 2025

//
// NAME:			ValidatorExtensions.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Validation extensions
//

#endregion

using FluentValidation;

namespace ClassLibrary.Application;

/// <summary>
///     Represents the <see cref="ValidatorExtensions" /> class.
/// </summary>
public static class ValidatorExtensions
{
    /// <summary>
    ///     RuleBuilder.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TProperty"></typeparam>
    /// <param name="ruleBuilder"></param>
    /// <param name="validOptions"></param>
    /// <returns></returns>
    public static IRuleBuilderOptions<T, TProperty> In<T, TProperty>(this IRuleBuilder<T, TProperty> ruleBuilder,
        params TProperty[] validOptions)
    {
        string formatted;
        if (validOptions == null || validOptions.Length == 0)
            throw new ArgumentException("At least one valid option is expected", nameof(validOptions));
        if (validOptions.Length == 1)
            formatted = validOptions[0].ToString();
        else
            // format like: option1, option2 or option3
            formatted =
                $"{string.Join(", ", validOptions.Select(vo => vo.ToString()).ToArray(), 0, validOptions.Length - 1)} or {validOptions.Last()}";

        return ruleBuilder
            .Must(validOptions.Contains)
            .WithMessage($"{{PropertyName}} must be one of these values: {formatted}");
    }
}