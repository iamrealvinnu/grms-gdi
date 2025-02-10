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
	