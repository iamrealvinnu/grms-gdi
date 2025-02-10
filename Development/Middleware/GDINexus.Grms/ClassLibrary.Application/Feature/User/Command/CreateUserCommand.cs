#region Copyright GDI Nexus © 2025

//
// NAME:			CreateUserCommand.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Create user command
//

#endregion

using ClassLibrary.Application.Response;
using ClassLibrary.Core.Exception;
using ClassLibrary.Core.Repository;
using ClassLibrary.Core.Response;
using ClassLibrary.Domain.User;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace ClassLibrary.Application.Feature.User.Command;

/// <summary>
///     Represents the <see cref="CreateUserCommand" /> Command.
/// </summary>
public class CreateUserCommand : IRequest<IResponse>
{
    /// <summary>
    ///     Constructor
    /// </summary>
    /// <param name="userName"></param>
    /// <param name="email"></param>
    /// <param name="password"></param>
    /// <param name="confirmPassword"></param>
    /// <param name="firstName"></param>
    /// <param name="lastName"></param>
    /// <param name="userTypeId"></param>
    /// <param name="genderId"></param>
    /// <param name="countryId"></param>
    /// <param name="claims"></param>
    public CreateUserCommand(string userName, string email, string password, string confirmPassword, string firstName,
        string lastName,
        Guid userTypeId, Guid genderId,
        Guid countryId, HashSet<string> claims)
    {
        UserName = userName;
        Email = email;
        Password = password;
        ConfirmPassword = confirmPassword;
        FirstName = firstName;
        LastName = lastName;
        UserTypeId = userTypeId;
        GenderId = genderId;
        CountryId = countryId;
        Claims = claims;
    }

    /// <summary>
    ///     The UserName.
    /// </summary>
    public required string UserName { get; set; }

    /// <summary>
    ///     The Email.
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    ///     The Password
    /// </summary>
    public required string Password { get; set; }

    /// <summary>
    ///     The ConfirmPassword
    /// </summary>
    public required string ConfirmPassword { get; set; }

    /// <summary>
    ///     The FirstName.
    /// </summary>
    public required string FirstName { get; set; }

    /// <summary>
    ///     The LastName.
    /// </summary>
    public required string LastName { get; set; }

    /// <summary>
    ///     The UserTypeId.
    /// </summary>
    public Guid UserTypeId { get; set; }

    /// <summary>
    ///     The GenderId.
    /// </summary>
    public Guid GenderId { get; set; }

    /// <summary>
    ///     The CountryId.
    /// </summary>
    public Guid CountryId { get; set; }

    /// <summary>
    ///     User claims.
    /// </summary>
    public HashSet<string> Claims { get; set; }

    /// <summary>
    ///     Represents the <see cref="CreateUserCommandHandler" /> Command.
    /// </summary>
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, IResponse>
    {
        /// <summary>
        ///     Logger.
        /// </summary>
        private readonly ILogger<CreateUserCommandHandler> _logger;

        /// <summary>
        ///     Mediator.
        /// </summary>
        private readonly IMediator _mediator;

        /// <summary>
        ///     Unit of work.
        /// </summary>
        private readonly IUnitOfWork _uowRepository;

        /// <summary>
        ///     Constructor.
        /// </summary>
        /// <param name="uowRepository"></param>
        /// <param name="logger"></param>
        /// <param name="mediator"></param>
        public CreateUserCommandHandler(IUnitOfWork uowRepository,
            ILogger<CreateUserCommandHandler> logger, IMediator mediator)
        {
            _uowRepository = uowRepository;
            _logger = logger;
            _mediator = mediator;
        }

        /// <summary>
        ///     Handle.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<IResponse> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            // Enclose in Tx
            //using var transaction = _uowRepository.Repository<User>().BeginTransaction();
            try
            {
                var specification = new Specification<Domain.User.User>();
                specification.Conditions.Add(
                    e => e.UserName == request.UserName || e.Email == request.Email);
                // Find if user exists
                var found = await _uowRepository.Repository<Domain.User.User>().GetEntityAsync(specification, true);

                if (found?.UserName == request.UserName)
                    throw new ApiException(400, "Username already exists");

                if (found?.Email == request.Email)
                    throw new ApiException(400, "Email already exists");

                // TODO: this can done elegantly with a mapper
                var userId = Guid.NewGuid();
                var user = new Domain.User.User
                {
                    Id = userId,
                    UserName = request.UserName,
                    Email = request.Email,
                    PasswordHash = request.Password,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    Profile = new UserProfile
                    {
                        FirstName = request.FirstName,
                        LastName = request.LastName
                    }
                };
                foreach (var claim in request.Claims)
                    user.Claims.Add(new UserClaim { ClaimType = "Role", ClaimValue = claim });

                // Hash the password
                IPasswordHasher<Domain.User.User> passwordHasher = new PasswordHasher<Domain.User.User>();
                var password = passwordHasher.HashPassword(user, request.Password);
                user.PasswordHash = password;

                // Add user to repo
                await _uowRepository.Repository<Domain.User.User>()
                    .InsertEntityAsync(user);

                // Save changes
                await _uowRepository.SaveChangesAsync(cancellationToken);

                // Commit transaction
                //transaction.Commit();

                // Publish the notification
                //await _mediator.Publish(new CreatedUserNotification(userId), cancellationToken);

                // Return success
                return new SuccessResponse(200, "Successfully created user");
            }
            catch (Exception ex)
            {
                //transaction.Rollback();
                _logger.LogError(ex, ex.Message);
                return ex.GetType() == typeof(ApiException)
                    ? new ErrorResponse(((ApiException)ex).StatusCode, ((ApiException)ex).Errors)
                    :
                    // throw new ApiException(500, $"{Messages.DatabaseError} : {ex.Message}");
                    new ErrorResponse(500, $"Database error: {ex.Message}");
            }
        }
    }
}