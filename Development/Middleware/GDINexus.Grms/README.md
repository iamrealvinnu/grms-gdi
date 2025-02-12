# Introduction 
GDI Nexus Relationship Management System (GRMS) is a AI based relationship management system built on Micrsoft .NET as the middleware technology.

# Solution using Visual Studio (2022) 
1. Open Visual Studio 2022 and choose the option to `Clone from repository`
2. For the remote location of the `repository` obtain the _url_ from `Azure DevOps` for the project from the _Repos_ tab
3. Once the project has been cloned navigate to `Development > Middleware > GDINexus.Grms` and open **GDINexus.Grms.sln**

# Step-by-step creating the solution
1. Create folder `Solution Items` 
	+ 1.1 Create a `README.md` file. This is the **main** read me file for the project  
2. Add folder `ClassLibrary`. This is the folder where you will store various **code assets** that are more related to processing and are not usually API, UI or Test related. 
	+ 2.1 Add new project `ClassLibrary.Domain` of template type `Class Library` using language **C#** utilizing **.NET framework 9.0**. Your domain objects are stored here. 
		+ 2.1.1 Once the project has been created delete the default Class1.cs file if it created one
		+ 2.1.2 Open the _Package Manager Console_ make sure the **Default project** is `ClassLibrary.Domain`. Run the various pakages you want by running the respective command in your package manager console
		+ 2.1.3 Add a class file *Entity.cs* this will be your base abstract _entity_ from which other entites will inherit 
		+ 2.1.4 Add a class file *ValueObject.cs* this will be your base abstract _value object_ from which other value objects will inherit 
		+ 2.1.5 Add a class file *IAggregateRoot.cs* this will be your _Aggregate Root_ interface
		+ 2.1.6 Add a folder called `Utility`. We sill store all the common entities and value objects that we will use across various modules
			+ 2.1.6.1 Add a class file *Reference.cs* this will be _Reference entity_ where we will implement refrences that other entities or value objects can reference. It inherits from *Entity*
			+ 2.1.6.2 Add a class file *ReferenceItem.cs* this will be _ReferenceItem value object_, which is tied to the _Reference_ entity.  It inherits from *ValueObject* 
			+ 2.1.6.3 Add a class file *Address.cs* this will be _Address value object_, and will be used by other entities. It inherits from *ValueObject*
		+ 2.1.7 Add a folder called `User`. We break up the application by Aggregate Root, and here we will add the User Aggregate Root. 
			+ 2.1.7.1 Add a class file *User.cs* this will be your _User entity_ implementing the user domain, and is an *Aggregate Root*. It inherits from *Entity*
			+ 2.1.7.2 Add a class file *UserProfile.cs* this will be your _UserProfile value object_. It inherits from *ValueObject*
			+ 2.1.7.3 Add a class file *UserClaim.cs* this will be your _UserClaim value object_. It inherits from *ValueObject* you will use it to store various claims
			+ 2.1.7.4 Add a class file *UserAddress.cs* this will be your _UserAddress value object_. It inherits from *ValueObject* you will use it to store various addresses
			+ 2.1.7.5 Add a class file *UserRefreshToken.cs* this will be your _UserRefreshToken  value object_. It inherits from *ValueObject* you will use it to store various refresh tokens
		+ 2.1.8 Add new project `ClassLibrary.Core` of template type `Class Library` using language **C#** utilizing **.NET framework 9.0**. Your cross-cutting features are stored here. 
			+ 2.1.8.1 Once the project has been created delete the default Class1.cs file if it created one
			+ 2.1.8.2 Open the _Package Manager Console_ make sure the **Default project** is `ClassLibrary.Core`. Run the various pakages you want by running the respective command in your package manager console
				+ 2.1.8.2.1 Run command `install-package Microsoft.EntityFrameworkCore -version 9.0.1`: Entity Framework Core package
				+ 2.1.8.2.2 Run command `install-package RulesEngine -version 5.0.4`: Workflow rules engine for the application
			+ 2.1.8.3 Add a folder called `Security`. We will store all the security that we will use across various modules
				+ 2.1.8.3.1 Add a class file *RsaEncryptor.cs* this will be your RSA Encryption code
			+ 2.1.8.4 Add a folder called `Exception`. We will store all the exceptions that we will use across various modules
				+ 2.1.8.4.1 Add a class file *CannotPerformOperationException.cs* this will be expections for cannot perform operations
				+ 2.1.8.4.2 Add a class file *InvalidHashException.cs* this will be expections for cannot perform operations
				+ 2.1.8.4.3 Add a class file *ApiException.cs* this will be the expections for API's
			+ 2.1.8.5 Add a folder called `Repository`. We will store all the respository interfaces and supporting objects
				+ 2.1.8.5.1 Add a class file *Specification.cs* this will contain the specification static methods
				+ 2.1.8.5.2 Add a class file *SpecificationEvaluator.cs* this will contain the specification evaluvation static methods
				+ 2.1.8.5.3 Add a class file *IRepository.cs* this will contain the repository interface
				+ 2.1.8.5.4 Add a class file *IUnitOfWorkRepository.cs* this will contain the unit of work repository interface
				+ 2.1.8.5.5 Add a class file *IUnitOfWork.cs* this will contain the unit of work interface
			+ 2.1.8.6 Add a folder called `Response`. We will store all the response interfaces and supporting objects
				+ 2.1.8.6.1 Add a class file *IResponse.cs* this will contain the response interface
				+ 2.1.8.6.2 Add a class file *IErrorResponse.cs* this will contain the error reponse interface
				+ 2.1.8.6.3 Add a class file *ISuccessResponse.cs* this will contain the success reponse interface
				+ 2.1.8.6.4 Add a class file *IDataResponse.cs* this will contain the data reponse interface
			+ 2.1.8.7 Add a folder called `Workflow`. We will store the workflow interfaces here
				+ 2.1.8.7.1 Add a class file *IWorkflowService.cs* this will provide the workflow interface
			+ 2.1.8.8 Add a folder called `Communication`. We will store the communication interfaces here
				+ 2.1.8.8.1 Add a class file *IEmailService.cs* this will provide the email service interface
		+ 2.1.9 Add new project `ClassLibrary.Repository` of template type `Class Library` using language **C#** utilizing **.NET framework 9.0**. Your respository configuration and  logic goes here.
			+ 2.1.9.1 Once the project has been created delete the default Class1.cs file if it created one
			+ 2.1.9.2 Open the _Package Manager Console_ make sure the **Default project** is `ClassLibrary.Repository`. Run the various pakages you want by running the respective command in your package manager console
				+ 2.1.9.2.1 Run command `install-package Microsoft.EntityFrameworkCore -version 9.0.1`: Entity Framework Core package
				+ 2.1.9.2.2 Run command `install-package Microsoft.EntityFrameworkCore.SqlServer -version 9.0.1`: Entity Framework SQL Server package
			+ 2.1.9.3 Add project references by Right click on _Dependencies_ in the solution explorer for the project and clicking on _Add Project Reference_
				+ 2.1.9.3.1 Add project reference to *ClassLibrary.Domain*
				+ 2.1.9.3.2 Add project reference to *ClassLibrary.Core*
			+ 2.1.9.4 Add a class file *ApplicationContext.cs* this will be your application database context
			+ 2.1.9.5 Add a class file *ApplicationContextExtensions.cs* this will be your application database extensions
			+ 2.1.9.6 Add a class file *UnitOfWorkRepository.cs* this will implement the IUnitOfWorkRepository interface
			+ 2.1.9.7 Add a class file *UnitOfWork.cs* this will implement the IUnitOfWork interface
			+ 2.1.9.8 Add a class file *Repository.cs* this will implement the IRepository interace
			+ 2.1.9.9 Add a folder called `Configuration`. We will store all the configuration of domain objects to the repository
				+ 2.1.9.9.1 Add a class file *ReferenceConfiguration.cs* this will be the configuration for the reference entity framework
				+ 2.1.9.9.2 Add a class file *ReferenceItemConfiguration.cs* this will be the configuration for the reference item entity framework
				+ 2.1.9.9.3 Add a class file *UserConfiguration.cs* this will be the configuration for the user entity framework
				+ 2.1.9.9.4 Add a class file *UserProfileConfiguration.cs* this will be the configuration for the user profile entity framework
				+ 2.1.9.9.5 Add a class file *UserClaimConfiguration.cs* this will be the configuration for the user claims entity framework
				+ 2.1.9.9.6 Add a class file *UserAddressConfiguration.cs* this will be the configuration for the user address entity framework
				+ 2.1.9.9.7 Add a class file *AddressConfiguration.cs* this will be the configuration for the address entity framework
				+ 2.1.9.9.8 Add a class file *UserRefreshTokenConfiguration.cs* this will be the configuration for the user refresh token entity framework
		+ 2.1.10 Add new project `ClassLibrary.Application` of template type `Class Library` using language **C#** utilizing **.NET framework 9.0**. Your application logic goes here.
			+ 2.1.10.1 Once the project has been created delete the default Class1.cs file if it created one
			+ 2.1.10.2 Open the _Package Manager Console_ make sure the **Default project** is `ClassLibrary.Application`. Run the various pakages you want by running the respective command in your package manager console
				+ 2.1.10.2.1 Run command `install-package Microsoft.Extensions.Identity.Core -version 9.0.1`: Identity implementation for the application
				+ 2.1.10.2.2 Run command `install-package Mediatr -version 12.4.1`: Command Query service for the application
				+ 2.1.10.2.3 Run command `install-package FluentValidation -version 11.11.0`: Validation service for the application
				+ 2.1.10.2.4 Run command `install-package RulesEngine -version 5.0.4`: Workflow rules engine for the application
				+ 2.1.10.2.5 Run command `install-package Newtonsoft.Json -version 13.0.3`: JSON service
				+ 2.1.10.2.6 Run command `install-package FluentEmail.Core -version 3.0.2`: Email service
				+ 2.1.10.2.6 Run command `install-package FluentEmail.Smtp -version 3.0.2`: Email Smtp service
			+ 2.1.10.3 Add project references by Right click on _Dependencies_ in the solution explorer for the project and clicking on _Add Project Reference_
				+ 2.1.10.3.1 Add project reference to *ClassLibrary.Domain*
				+ 2.1.10.3.2 Add project reference to *ClassLibrary.Core*
			+ 2.1.10.4 Add a folder called `Security`. We will store all the security that we will use only in the application logic area
				+ 2.1.10.4.1 Add a class file *PasswordHasher.cs* this will be your Password Encryption code
			+ 2.1.10.5 Add a folder called `Response`. We will implement the response interface from the core module here
				+ 2.1.10.5.1 Add a class file *Response.cs* this will contain the response object
				+ 2.1.10.5.2 Add a class file *ErrorResponse.cs* this will contain the error response object
				+ 2.1.10.5.3 Add a class file *SuccessResponse.cs* this will contain the success response object
				+ 2.1.10.5.4 Add a class file *DataResponse.cs* this will contain the data response object
			+ 2.1.10.6 Add a class file *BaseValidator.cs* this will be the base class for validation
			+ 2.1.10.7 Add a class file *ValidatorExtensions.cs* this will provide validation extensions
			+ 2.1.10.8 Add a class file *WorkflowConfiguration.cs* this will provide the workflow configuration
			+ 2.1.10.9 Add a class file *WorkflowService.cs* this will provide the workflow implementation 
			+ 2.1.10.10 Add a class file *EmailConfiguration.cs* this will provide the email configuration
			+ 2.1.10.11 Add a class file *EmailService.cs* this will provide the email service implementation 
			+ 2.1.10.12 Add a folder called `Feature`. We will have all the feature implementations here
				+ 2.1.10.12.1 Add a folder called `User`. We will have all the user feature implementations here
					+ 2.1.10.12.1.1 Add a folder called `Command`. We will have all the user commands here
						+ 2.1.10.12.1.1.1 Add a class file *CreateUserCommand.cs* this will contain the command to create a user
					+ 2.1.10.12.1.2 Add a folder called `Query`. We will have all the user queries here
					+ 2.1.10.12.1.3 Add a folder called `Validation`. We will have all the user validations here
						+ 2.1.10.12.1.3.1 Add a class file *CreateUserCommandValidator.cs* thsi will containt the validation for the create user command
					+ 2.1.10.12.1.4 Add a folder called `Notification`. We will have all the user Notifications here
						+ 2.1.10.12.1.4.1 Add a class file *CreatedUserNotification.cs* this will containt the notification for the created user command
					+ 2.1.10.12.1.5 Add a folder called `Workflow`. We will have all the user Workflows here
						+ 2.1.10.12.1.5.1 Add a class file *CreatedUserWelcomeEmailWorkflowAction.cs* this will contain the workflow action for a created user welcome email
3. Add folder `Test`. This is the folder where you will store your **Test's**, there are automated unit and integration tests to run against your code. 
	+ 3.1 Add new project `Test.Unit` of template type `xUnit Test` using language **C#** utilizing **.NET framework 9.0**
		+ 3.1.1 Once the project has been created delete the default UnitTest1.cs file if it created one
		+ 3.1.2 Open the _Package Manager Console_ make sure the **Default project** is `Test.Unit`. Run the various pakages you want by running the respective command in your package manager console
			+ 3.1.2.1 Run command `install-package Bogus -version 35.6.1`: Bogus is a package that you will use to generate fake data
			+ 3.1.2.2 Run command `install-package Xunit.Microsoft.DependencyInjection -version 9.0.0`: Dependency injection for test bed
			+ 3.1.2.3 Run command `install-package Microsoft.Extensions.DependencyInjection -version 9.0.1`: Dependency injection for settings
			+ 3.1.2.4 Run command `install-package Microsoft.Extensions.Configuration -version 9.0.1`: Dependency injection for configuration
			+ 3.1.2.5 Run command `install-package Microsoft.Extensions.Configuration.FileExtensions -version 9.0.1`: Dependency injection for file configuration
			+ 3.1.2.6 Run command `install-package Microsoft.Extensions.Configuration.Json -version 9.0.1`: To read JSON configuration files
			+ 3.1.2.7 Run command `install-package Microsoft.Extensions.Configuration.EnvironmentVariables -version 9.0.1`: To read environment variables
			+ 3.1.2.8 Run command `install-package Microsoft.Extensions.Identity.Core -version 9.0.1`: Identity implementation for the application
			+ 3.1.2.9 Run command `install-Package Microsoft.EntityFrameworkCore.Sqlite -Version 9.0.1`: EF for SQL Lite
		+ 3.1.3 Add project references by Right click on _Dependencies_ in the solution explorer for the project and clicking on _Add Project Reference_
			+ 3.1.3.1 Add project reference to *ClassLibrary.Domain*
			+ 3.1.3.2 Add project reference to *ClassLibrary.Core* 
			+ 3.1.3.3 Add project reference to *ClassLibrary.Application* 
			+ 3.1.3.4 Add project reference to *ClassLibrary.Repository* 
		+ 3.1.4 Add a class file *TestFixture.cs*. This is base class for _Test Fixture_ for the tests
		+ 3.1.5 Add a class file *FakeDataGenerator.cs*. This is where _fake data_ for the application is generated
		+ 3.1.6 Add a JSON file *testsettings.json*. This file will store configuration information such as DB connection info, logging, mail server etc. Once this file is created **_right click > Properties > Copy to output Directory = always_**
		+ 3.1.7 Add a class file *TestPriorityAttribute.cs*. This is the attribute file for test priority
		+ 3.1.8 Add a class file *PriorityOrderer.cs*. This is priority orderer for test
		+ 3.1.9 Add a folder called `Domain`. This is where you will add your domain object tests
			+ 3.1.9.1 Add a class file *UserTests.cs* you will write your tests to test the *User domain object*. At this point you shoule be able to write tests and run them using the *Unit Test Runner* and the test should pass.
		+ 3.1.10 Add a folder called `Repository`. This is where you will add your respository tests
			+ 3.1.10.1 Add a class file *EfMigrationTests.cs* you will write your tests to test the *EF Migrations*. At this point you shoule be able to write tests and run them using the *Unit Test Runner* and the test should pass.
			+ 3.1.10.2 Add a class file *ReferenceRepositoryTests.cs* you will write your tests to test the *Reference Repository*. At this point you shoule be able to write tests and run them using the *Unit Test Runner* and the test should pass.
			+ 3.1.10.3 Add a class file *UserRepositoryTests.cs* you will write your tests to test the *User Repository*. At this point you shoule be able to write tests and run them using the *Unit Test Runner* and the test should pass.
4. Add folder `Api`. This is the folder where you will store your **API's**, these API's will utilize _ClassLibrary_ assests to support its processing. 