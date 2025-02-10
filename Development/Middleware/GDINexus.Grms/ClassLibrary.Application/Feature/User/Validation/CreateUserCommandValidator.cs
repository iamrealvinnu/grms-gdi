#region Copyright GDI Nexus © 2025

//
// NAME:			CreateUserCommandValidator.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Create user command validator
//

#endregion

using ClassLibrary.Application.Feature.User.Command;
using FluentValidation;
using MediatR;

namespace ClassLibrary.Application.Feature.User.Validation;

/// <summary>
///     Represents the <see cref="CreateUserCommandValidator" /> class.
/// </summary>
public class CreateUserCommandValidator : BaseValidator<CreateUserCommand>
{
    public CreateUserCommandValidator(IMediator mediator) : base(mediator)
    {
        RuleFor(x => x.UserName).NotEmpty().WithMessage("UserName is required");
        RuleFor(x => x.FirstName).NotEmpty().WithMessage("FirstName is required");
        RuleFor(x => x.LastName).NotEmpty().WithMessage("LastName is required");
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required");
        RuleFor(x => x.Email).EmailAddress().WithMessage("Email is not valid");
        RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Your password length must be at least 8.")
            .MaximumLength(16).WithMessage("Your password length must not exceed 16.")
            .Matches(@"[A-Z]+").WithMessage("Your password must contain at least one uppercase letter.")
            .Matches(@"[a-z]+").WithMessage("Your password must contain at least one lowercase letter.")
            .Matches(@"[0-9]+").WithMessage("Your password must contain at least one number.");
        RuleFor(x => x.ConfirmPassword).NotEmpty().WithMessage("Confirm password is required").Equal(x => x.Password)
            .WithMessage("Password and ConfirmPassword must match");
        RuleFor(i => i.UserTypeId).NotEmpty().WithMessage("Invalid User Type Id");
        RuleFor(i => i.GenderId).NotEmpty().WithMessage("Invalid Gender Id");
        RuleFor(i => i.CountryId).NotEmpty().WithMessage("Invalid Country Id");
        // RuleFor(i => i.UserTypeId).NotEmpty().WithMessage("Invalid User Type Id")
        //     .MustAsync(async (id, cancellation) =>
        //         await Mediator.Send(new ValidateReferenceItemCommand(userTypeReferenceId, id)))
        //     .WithMessage("Invalid User Type Id");
        // RuleFor(i => i.GenderId).NotEmpty().WithMessage("Invalid Gender Id")
        //     .MustAsync(async (id, cancellation) =>
        //         await Mediator.Send(new ValidateReferenceItemCommand(genderTypeReferenceId, id)))
        //     .WithMessage("Invalid Gender Id");
        // RuleFor(i => i.CountryId).NotEmpty().WithMessage("Invalid Country Id")
        //     .MustAsync(async (id, cancellation) =>
        //         await Mediator.Send(new ValidateReferenceItemCommand(countryTypeReferenceId, id)))
        //     .WithMessage("Invalid Country Id");
        //RuleForEach(i => i.Claims).NotEmpty().WithMessage("Invalid Claims")
        //    .In(Constants.Claims.Select(item => item.Value).ToArray()).WithMessage("Invalid Claims");
        RuleForEach(i => i.Claims).NotEmpty().WithMessage("Invalid Claims")
            .ChildRules(c => { c.RuleFor(i => i).NotEmpty().WithMessage("Claim value is required"); });
    }
}