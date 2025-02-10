#region Copyright GDI Nexus © 2025

//
// NAME:			BaseValidator.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Abstract base validator object
//

#endregion

using System.Text.RegularExpressions;
using FluentValidation;
using MediatR;

namespace ClassLibrary.Application;

/// <summary>
///     Represents the <see cref="BaseValidator{T}" /> class.
/// </summary>
/// <typeparam name="T"></typeparam>
public abstract class BaseValidator<T> : AbstractValidator<T>
{
    /// <summary>
    ///     Mediator.
    /// </summary>
    protected IMediator Mediator;

    /// <summary>
    ///     Constructor.
    /// </summary>
    /// <param name="mediator"></param>
    protected BaseValidator(IMediator mediator)
    {
        Mediator = mediator;
    }

    // /// <summary>
    // ///     Validate User.
    // /// </summary>
    // /// <param name="userId"></param>
    // /// <returns></returns>
    // protected async Task<bool> ValidateUser(Guid userId)
    // {
    //     var user = await Mediator.Send(new GetUserQuery(userId, string.Empty));
    //     if (user != null)
    //         return true;
    //     return false;
    // }

    /// <summary>
    ///     BeValidUSPostCode
    /// </summary>
    /// <param name="zipCode"></param>
    /// <returns></returns>
    protected bool BeAValidUSPostCode(string zipCode)
    {
        var usZipRegEx = @"^\d{5}(?:[-\s]\d{4})?$";
        var validZipCode = Regex.Match(zipCode, usZipRegEx).Success;
        return validZipCode;
    }

    /// <summary>
    ///     BeValidIndianPostCode
    /// </summary>
    /// <param name="zipCode"></param>
    /// <returns></returns>
    protected bool BeAValidIndianPostCode(string zipCode)
    {
        var indianZipRegEx = @"^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$";
        var validZipCode = Regex.Match(zipCode, indianZipRegEx).Success;
        return validZipCode;
    }
}