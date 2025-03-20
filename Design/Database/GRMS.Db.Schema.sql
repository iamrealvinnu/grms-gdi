-------------------------------------------------------------------------------------
-- NAME:       GRMS.Db.Schema.V1
-- AUTHOR:     Nithya Sandhip
-- COMPANY:    GDI Nexus
-- DATE:       02/10/2025
-- PURPOSE:    Sql server DDL
-- NOTES:      
-------------------------------------------------------------------------------------

USE MASTER
GO
-- DROP DB
IF EXISTS(SELECT * FROM sys.databases WHERE NAME='GRMSDEV')
	ALTER DATABASE [GRMSDEV] SET SINGLE_USER WITH ROLLBACK IMMEDIATE
GO

IF EXISTS(SELECT * FROM sys.databases WHERE NAME='GRMSDEV')
	DROP DATABASE [GRMSDEV]
GO

-- CREATE DB
CREATE DATABASE [GRMSDEV]
GO

-- ALTER DB
ALTER DATABASE [GRMSDEV] SET MULTI_USER
GO

-- USE DB
USE [GRMSDEV]
GO
SET XACT_ABORT ON
GO
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
GO

-- BEGIN TRANSACTION
BEGIN TRANSACTION
GO

-- UTILITY SCHEMA
EXEC ('CREATE SCHEMA [Utility]') 
GO

-- REFERENCE TABLE
CREATE TABLE [Utility].[Reference](      
	[Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
	[Name] [NVARCHAR](256) NOT NULL, 
	[Description] [NVARCHAR](512) NULL, 
	[CountryCode] [NVARCHAR](2) NOT NULL, 
	[Archived] [DATETIME] NULL, 
	[CreatedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()), 
	[ChangedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate())
)

--REFERENCEITEM TABLE
CREATE TABLE[Utility].[ReferenceItem](
	[Id][UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
	[ReferenceId][UNIQUEIDENTIFIER] NOT NULL,
	[Code][NVARCHAR](256) NOT NULL,
	[Description][NVARCHAR](512) NOT NULL,
	[Archived][DATETIME] NULL,
	[CreatedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[ChangedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[Udf1][NVARCHAR](512) NULL,
	[Udf2][NVARCHAR](512) NULL,
	[Udf3][NVARCHAR](512) NULL,
	[SortOrder][INT] NULL,
	CONSTRAINT[FK_Reference_ReferenceItem_Reference] FOREIGN KEY([ReferenceId]) REFERENCES[Utility].[Reference]([Id]) ON DELETE CASCADE
)

-- ADDRESS TABLE
CREATE TABLE [Utility].[Address](      
	[Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL, 
	[Address1] [NVARCHAR](512) NOT NULL, 
	[Address2] [NVARCHAR](256) NULL, 
	[City] [NVARCHAR](256) NOT NULL, 
	[County] [NVARCHAR](256) NULL, 
	[StateId] [UNIQUEIDENTIFIER] NOT NULL, 
	[Zip] [NVARCHAR](256) NOT NULL, 
	[CountryId] [UNIQUEIDENTIFIER] NOT NULL, 
	[AddressTypeId] [UNIQUEIDENTIFIER] NOT NULL, 
	[Latitude] [DECIMAL](9,6) NULL, 
	[Longitude] [DECIMAL](9,6) NULL, 
	[CreatedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()), 
	[ChangedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()), 
	[Udf1] [NVARCHAR](512) NULL, 
	[Udf2] [NVARCHAR](512) NULL, 
	[Udf3] [NVARCHAR](512) NULL,
	CONSTRAINT [FK_State_Address_ReferenceItem] FOREIGN KEY ([StateId]) REFERENCES [Utility].[ReferenceItem] ([Id]),
	CONSTRAINT [FK_Country_Address_ReferenceItem] FOREIGN KEY ([CountryId]) REFERENCES [Utility].[ReferenceItem] ([Id]),
	CONSTRAINT [FK_AddressType_Address_ReferenceItem] FOREIGN KEY ([AddressTypeId]) REFERENCES [Utility].[ReferenceItem] ([Id])
)

-- USER SCHEMA
EXEC('CREATE SCHEMA [User]')
GO

-- USER TABLE
CREATE TABLE[User].[Users](
	[Id][UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
	[UserName][NVARCHAR](256) NOT NULL,
	[Email][NVARCHAR](256) NOT NULL,
	[EmailConfirmed][BIT] NOT NULL,
	[PasswordHash][NVARCHAR](512) NOT NULL,
	[SecurityStamp][NVARCHAR](256) NOT NULL,
	[PhoneNumber][NVARCHAR](256) NULL,
	[PhoneNumberConfirmed][BIT] NOT NULL,
	[MobileNumber][NVARCHAR](256) NULL,
	[MobileNumberConfirmed][BIT] NOT NULL,
	[NationalId][NVARCHAR](512) NULL,
	[NationalIdVerificationDate][DATETIME] NULL,
	[TwoFactorEnabled][BIT] NOT NULL,
	[LockoutEndDate][DATETIME] NULL,
	[LockoutEnabled][BIT] NOT NULL,
	[AccessFailedCount][INT] NOT NULL,
	[CreatedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[ChangedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[DeletedOn][DATETIME] NULL,
	[DeactivatedDate][DATETIME] NULL,
	[ReportsToId][UNIQUEIDENTIFIER] NULL,
	[Udf1][NVARCHAR](512) NULL,
	[Udf2][NVARCHAR](512) NULL,
	[Udf3][NVARCHAR](512) NULL,
	CONSTRAINT[FK_ReportsTo_Users_Users] FOREIGN KEY([ReportsToId]) REFERENCES[User].[Users]([Id])
)

-- USERPROFILE TABLE
CREATE TABLE[User].[UserProfile](
	[UserId][UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
	[FirstName][NVARCHAR](256) NOT NULL,
	[LastName][NVARCHAR](256) NOT NULL,
	[Degree][NVARCHAR](128) NULL,
	[UserTypeId][UNIQUEIDENTIFIER] NOT NULL,
	[Title][NVARCHAR](256) NULL,
	[Suffix][NVARCHAR](256) NULL,
	[Prefix][NVARCHAR](256) NULL,
	[PrefferedName][NVARCHAR](256) NULL,
	[Dob][DATE] NULL,
	[GenderId][UNIQUEIDENTIFIER] NOT NULL,
	[PictureUrl][NVARCHAR](512) NULL,
	[Udf1][NVARCHAR](512) NULL,
	[Udf2][NVARCHAR](512) NULL,
	[Udf3][NVARCHAR](512) NULL,
	CONSTRAINT[FK_User_UserProfile_Users] FOREIGN KEY([UserId]) REFERENCES[User].[Users]([Id]) ON DELETE CASCADE,
	CONSTRAINT[FK_UserType_UserProfile_ReferenceItem] FOREIGN KEY([UserTypeId]) REFERENCES[Utility].[ReferenceItem]([Id]),
	CONSTRAINT[FK_Gender_UserProfile_ReferenceItem] FOREIGN KEY([GenderId]) REFERENCES[Utility].[ReferenceItem]([Id])
)

CREATE TABLE[User].[UserClaim](
	[UserId][UNIQUEIDENTIFIER] NOT NULL,
	[ClaimType][NVARCHAR](128) NOT NULL,
	[ClaimValue][NVARCHAR](128) NOT NULL,
	[CreatedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[ChangedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	CONSTRAINT[PK_UserId_ClaimType_ClaimValue] PRIMARY KEY CLUSTERED([UserId], [ClaimType], [ClaimValue]),
	CONSTRAINT[FK_User_UserClaim_Users] FOREIGN KEY([UserId]) REFERENCES[User].[Users]([Id]) ON DELETE CASCADE
)

CREATE TABLE[User].[UserAddress](
	[UserId][UNIQUEIDENTIFIER] NOT NULL,
	[AddressId][UNIQUEIDENTIFIER] NOT NULL,
	[Preffered][BIT] NOT NULL,
	CONSTRAINT[PK_UserId_AddressId] PRIMARY KEY CLUSTERED([UserId], [AddressId]),
	CONSTRAINT[FK_User_UserAddress_Users] FOREIGN KEY([UserId]) REFERENCES[User].[Users]([Id]) ON DELETE CASCADE,
	CONSTRAINT[FK_Address_UserAddress_Address] FOREIGN KEY([AddressId]) REFERENCES[User].[Users]([Id]) ON DELETE NO ACTION
)

CREATE TABLE[User].[UserRefreshToken](
	[UserId][UNIQUEIDENTIFIER] NOT NULL,
	[Code][NVARCHAR](1024) NOT NULL,
	[Expiration][DATETIME] NOT NULL,
	CONSTRAINT[PK_UserId_Code] PRIMARY KEY CLUSTERED([UserId], [Code]),
	CONSTRAINT[FK_User_UserRefreshToken_Users] FOREIGN KEY([UserId]) REFERENCES[User].[Users]([Id]) ON DELETE CASCADE
)


-- MARKETING SCHEMA
EXEC('CREATE SCHEMA [Marketing]')
GO

-- CAMPAIGN TABLE
CREATE TABLE [Marketing].[Campaign](
    [Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
	[Name] [VARCHAR](256) NOT NULL,	
    [Description] [NVARCHAR](1024) NULL,   
	[StartDate][DATETIME] NOT NULL,
	[EndDate][DATETIME] NOT NULL,
	[CreatedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[ChangedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[DeletedOn][DATETIME] NULL,
	[CreatedById] [UNIQUEIDENTIFIER] NOT NULL,
    [ModifiedById] [UNIQUEIDENTIFIER] NOT NULL,
	[Udf1][NVARCHAR](512) NULL,
	[Udf2][NVARCHAR](512) NULL,
	[Udf3][NVARCHAR](512) NULL,
    CONSTRAINT FK_CreatedBy_Marketing_Users FOREIGN KEY (CreatedById) REFERENCES [User].[Users]([Id]),
    CONSTRAINT FK_ModifiedBy_Marketing_Users FOREIGN KEY (ModifiedById) REFERENCES [User].[Users]([Id])
)

-- LEAD TABLE
CREATE TABLE [Marketing].[Lead](
    [Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
	[FirstName][NVARCHAR](256) NOT NULL,
	[LastName][NVARCHAR](256) NOT NULL,
	[Degree][NVARCHAR](128) NULL,
	[Title][NVARCHAR](256) NULL,
	[Suffix][NVARCHAR](256) NULL,
	[Prefix][NVARCHAR](256) NULL,
	[PrefferedName][NVARCHAR](256) NULL,
	[Dob][DATE] NULL,
	[Company] [NVARCHAR](512) NULL,
	[Email] [NVARCHAR](256) NULL,
	[EmailConfirmed] [BIT] NULL,
	[PhoneNumber] [NVARCHAR](256) NULL,
	[PhoneNumberConfirmed] [BIT] NULL,
	[MobileNumber] [NVARCHAR](256) NULL,
	[MobileNumberConfirmed] [BIT] NULL,
	[DoNotCall] [BIT] NULL,
    [DoNotEmail] [BIT] NULL,
	[CampaignId] [UNIQUEIDENTIFIER] NULL,
    [AssignedToId] [UNIQUEIDENTIFIER] NULL,
	[CreatedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[ChangedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[DeletedOn][DATETIME] NULL,
	[CreatedById] [UNIQUEIDENTIFIER] NOT NULL,
    [ModifiedById] [UNIQUEIDENTIFIER] NOT NULL,
	[Udf1][NVARCHAR](512) NULL,
	[Udf2][NVARCHAR](512) NULL,
	[Udf3][NVARCHAR](512) NULL,
	CONSTRAINT[FK_Campaign_Lead_Campaign] FOREIGN KEY([CampaignId]) REFERENCES[Marketing].[Campaign]([Id]),
	CONSTRAINT FK_AssignedTo_Lead_Users FOREIGN KEY (AssignedToId) REFERENCES [User].[Users]([Id]),
	CONSTRAINT FK_CreatedBy_Lead_Users FOREIGN KEY (CreatedById) REFERENCES [User].[Users]([Id]),
    CONSTRAINT FK_ModifiedBy_Lead_Users FOREIGN KEY (ModifiedById) REFERENCES [User].[Users]([Id])
)

-- OPPORTUNITY TABLE
CREATE TABLE [Marketing].[Opportunity](
    [Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
    [LeadId] [UNIQUEIDENTIFIER] NOT NULL,
    [OpportunityName] [NVARCHAR](256) NOT NULL,
    [EstimatedValue] [DECIMAL](18, 2) NULL,
    [CloseDate] [DATETIME] NULL,
    [CreatedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()),
    [ChangedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()),
    [DeletedOn] [DATETIME] NULL,
    [CreatedById] [UNIQUEIDENTIFIER] NOT NULL,
    [ModifiedById] [UNIQUEIDENTIFIER] NOT NULL,
    [Udf1] [NVARCHAR](512) NULL,
    [Udf2] [NVARCHAR](512) NULL,
    [Udf3] [NVARCHAR](512) NULL,
    CONSTRAINT FK_Lead_Opportunity FOREIGN KEY (LeadId) REFERENCES [Marketing].[Lead](Id),
    CONSTRAINT FK_CreatedBy_Opportunity_Users FOREIGN KEY (CreatedById) REFERENCES [User].[Users](Id),
    CONSTRAINT FK_ModifiedBy_Opportunity_Users FOREIGN KEY (ModifiedById) REFERENCES [User].[Users](Id)
);

-- ACCOUNT SCHEMA
EXEC('CREATE SCHEMA [Account]')
GO

-- ACCOUNT TABLE
CREATE TABLE [Account].[Account](
    [Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
    [ParentId] [UNIQUEIDENTIFIER] NULL,
    [Name] [NVARCHAR](256) NOT NULL,
    [Description] [NVARCHAR](256) NULL, 
    [AccountNumber] [NVARCHAR](48) NULL,
    [AccountTypeId] [UNIQUEIDENTIFIER] NOT NULL,
    [Industry] [UNIQUEIDENTIFIER] NOT NULL,
    [AnnualRevenue] [DECIMAL] NULL,
    [Email] [NVARCHAR](256) NULL,
	[EmailConfirmed] [BIT] NULL,
	[PhoneNumber] [NVARCHAR](256) NULL,
	[PhoneNumberConfirmed] [BIT] NULL,
    [Url] [NVARCHAR](256) NULL,
    [OwnershipTypeId] [UNIQUEIDENTIFIER] NOT NULL,
    [NumberOfEmployees] [INT] NULL,
    [CampaignId] [UNIQUEIDENTIFIER] NULL,
    [DoNotCall] [BIT] NULL,
    [DoNotEmail] [BIT] NULL,
    [AssignedToId] [UNIQUEIDENTIFIER] NULL,
    [CreatedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[ChangedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[DeletedOn][DATETIME] NULL,
	[CreatedById] [UNIQUEIDENTIFIER] NOT NULL,
    [ModifiedById] [UNIQUEIDENTIFIER] NOT NULL,
	[Udf1][NVARCHAR](512) NULL,
	[Udf2][NVARCHAR](512) NULL,
	[Udf3][NVARCHAR](512) NULL,
    -- ADD JOIN TABLE FOR ADDRESS SIMILAR TO [User].[UserAddress]
	CONSTRAINT[FK_Parent_Account_Account] FOREIGN KEY([ParentId]) REFERENCES[Account].[Account]([Id]),
	CONSTRAINT[FK_AccountType_Account_ReferenceItem] FOREIGN KEY([AccountTypeId]) REFERENCES[Utility].[ReferenceItem]([Id]),
	CONSTRAINT[FK_OwnershipType_Account_ReferenceItem] FOREIGN KEY([OwnershipTypeId]) REFERENCES[Utility].[ReferenceItem]([Id]),
	CONSTRAINT[FK_Campaign_Account_Campaign] FOREIGN KEY([CampaignId]) REFERENCES[Marketing].[Campaign]([Id]),
	CONSTRAINT FK_AssignedTo_Account_Users FOREIGN KEY (AssignedToId) REFERENCES [User].[Users]([Id]),
	CONSTRAINT FK_CreatedBy_Account_Users FOREIGN KEY (CreatedById) REFERENCES [User].[Users]([Id]),
    CONSTRAINT FK_ModifiedBy_Account_Users FOREIGN KEY (ModifiedById) REFERENCES [User].[Users]([Id])
)

-- ACCOUNT ADDRESS JOIN TABLE 
CREATE TABLE [Account].[AccountAddress](
    [AccountId] [UNIQUEIDENTIFIER] NOT NULL,
    [AddressId] [UNIQUEIDENTIFIER] NOT NULL,
    [Preffered] [BIT] NOT NULL,
    CONSTRAINT [PK_AccountId_AddressId] PRIMARY KEY CLUSTERED([AccountId], [AddressId]),
    CONSTRAINT [FK_Account_AccountAddress_Account] FOREIGN KEY([AccountId]) REFERENCES [Account].[Account]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Address_AccountAddress_Address] FOREIGN KEY([AddressId]) REFERENCES [Utility].[Address]([Id]) ON DELETE CASCADE
)

-- CONTACT TABLE
CREATE TABLE [Account].[Contact](  
    [Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
	[AccountId] [UNIQUEIDENTIFIER] NOT NULL,
    [FirstName] [NVARCHAR](256) NOT NULL, 
	[LastName] [NVARCHAR](256) NOT NULL, 
	[Degree] [NVARCHAR](128) NULL, 
	[Title] [NVARCHAR](256) NULL, 
	[Suffix] [NVARCHAR](256) NULL, 
	[Prefix] [NVARCHAR](256) NULL, 
	[PrefferedName] [NVARCHAR](256) NULL, 
	[Dob] [DATE] NULL, 
    [Email] [NVARCHAR](256) NULL,
	[EmailConfirmed] [BIT] NULL,
	[PhoneNumber] [NVARCHAR](256) NULL,
	[PhoneNumberConfirmed] [BIT] NULL,
	[MobileNumber] [NVARCHAR](256) NULL,
	[MobileNumberConfirmed] [BIT] NULL,
    [CampaignId] [UNIQUEIDENTIFIER] NULL,
    [DoNotCall] [BIT] NULL,
    [DoNotEmail] [BIT] NULL,
    [AssignedToId] [UNIQUEIDENTIFIER] NULL,
	[CreatedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[ChangedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[DeletedOn][DATETIME] NULL,
	[CreatedById] [UNIQUEIDENTIFIER] NOT NULL,
    [ModifiedById] [UNIQUEIDENTIFIER] NOT NULL,
	[Udf1][NVARCHAR](512) NULL,
	[Udf2][NVARCHAR](512) NULL,
	[Udf3][NVARCHAR](512) NULL,
	CONSTRAINT[FK_Account_Contact_Account] FOREIGN KEY([AccountId]) REFERENCES[Account].[Account]([Id]),
	CONSTRAINT[FK_Campaign_Contact_Campaign] FOREIGN KEY([CampaignId]) REFERENCES[Marketing].[Campaign]([Id]),
	CONSTRAINT FK_AssignedTo_Contact_Users FOREIGN KEY (AssignedToId) REFERENCES [User].[Users]([Id]),
	CONSTRAINT FK_CreatedBy_Contact_Users FOREIGN KEY (CreatedById) REFERENCES [User].[Users]([Id]),
    CONSTRAINT FK_ModifiedBy_Contact_Users FOREIGN KEY (ModifiedById) REFERENCES [User].[Users]([Id])
)




-- COMMIT/ROLLBACK TRANSACTION
IF @@TRANCOUNT > 0
  -- ROLLBACK 		
  --ROLLBACK TRANSACTION
  -- COMMIT
  COMMIT TRANSACTION
GO