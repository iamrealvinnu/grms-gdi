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
	[SortOrder][NVARCHAR](512) NULL,
	CONSTRAINT[FK_Reference_ReferenceItem_Reference] FOREIGN KEY([ReferenceId]) REFERENCES[Utility].[Reference]([Id]) ON DELETE CASCADE
)

-- ADDRESS TABLE
CREATE TABLE[Utility].[Address]
(
	[Id][UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
	[Address1] [NVARCHAR] (512) NOT NULL,
	[Address2] [NVARCHAR] (256) NULL, 
	[City][NVARCHAR](256) NOT NULL,
	[County][NVARCHAR](256) NULL,
	[StateId][UNIQUEIDENTIFIER] NOT NULL,
	[Zip][NVARCHAR](256) NOT NULL,
	[CountryId][UNIQUEIDENTIFIER] NOT NULL, [AddressTypeId][UNIQUEIDENTIFIER] NOT NULL,
	[Latitude][DECIMAL](9, 6) NULL,
	[Longitude][DECIMAL](9, 6) NULL,
	[CreatedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[ChangedOnUtc][DATETIME] NOT NULL DEFAULT(getutcdate()),
	[Udf1][NVARCHAR](512) NULL,
	[Udf2][NVARCHAR](512) NULL,
	[Udf3][NVARCHAR](512) NULL,
	CONSTRAINT[FK_State_Address_ReferenceItem] FOREIGN KEY([StateId]) REFERENCES[Utility].[ReferenceItem]([Id]),
	CONSTRAINT[FK_Country_Address_ReferenceItem] FOREIGN KEY([CountryId]) REFERENCES[Utility].[ReferenceItem]([Id])
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
	[PictureUrl][NVARCHAR](1024) NULL,
	[Udf1][NVARCHAR](1024) NULL,
	[Udf2][NVARCHAR](1024) NULL,
	[Udf3][NVARCHAR](1024) NULL,
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
	CONSTRAINT[FK_User_UserAddress_Users] FOREIGN KEY([UserId]) REFERENCES[User].[Users]([Id]) ON DELETE CASCADE
)

CREATE TABLE[User].[UserRefreshToken](
	[UserId][UNIQUEIDENTIFIER] NOT NULL,
	[Code][NVARCHAR](1024) NOT NULL,
	[Expiration][DATETIME] NOT NULL,
	CONSTRAINT[PK_UserId_Code] PRIMARY KEY CLUSTERED([UserId], [Code]),
	CONSTRAINT[FK_User_UserRefreshToken_Users] FOREIGN KEY([UserId]) REFERENCES[User].[Users]([Id]) ON DELETE CASCADE
)

-- MARKETING SCHEMA
EXEC('CREATE SCHEMA [MARKETING]')
GO

-- TODO ADD CAMPAIGN TABLE
-- CAMPAIGN TABLE
CREATE TABLE [Marketing].[Campaign](
    [Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
    [Deleted] [BIT] NOT NULL,
    [CreatedBy] [UNIQUEIDENTIFIER] NULL,
    [DateEntered] [DATETIME] NOT NULL,
    [ModifiedUserId] [UNIQUEIDENTIFIER] NULL,
    [DateModified] [DATETIME] NOT NULL,
    [DateModifiedUtc] [DATETIME] NULL,
    [Name] [VARCHAR](255) NULL,
    [Description] [TEXT] NULL,
    CONSTRAINT FK_Campaigns_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [User].[UserProfile](UserId),
    CONSTRAINT FK_Campaigns_ModifiedUserId FOREIGN KEY (ModifiedUserId) REFERENCES [User].[UserProfile](UserId)
);
-- TODO ADD LEAD TABLE
-- LEAD TABLE
CREATE TABLE [Marketing].[Lead](
    [Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
    [Deleted] [BIT] NOT NULL,
    [CreatedBy] [UNIQUEIDENTIFIER] NULL,
    [DateEntered] [DATETIME] NOT NULL,
    [ModifiedUserId] [UNIQUEIDENTIFIER] NULL,
    [DateModified] [DATETIME] NOT NULL,
    [DateModifiedUtc] [DATETIME] NULL,
    [FirstName] [VARCHAR](100) NULL,
    [LastName] [VARCHAR](100) NULL,
    [Email1] [VARCHAR](255) NULL,
    [Email2] [VARCHAR](255) NULL,
    [Phone] [VARCHAR](50) NULL,
    [CampaignId] [UNIQUEIDENTIFIER] NULL,
    [AssignedUserId] [UNIQUEIDENTIFIER] NULL,
    CONSTRAINT FK_Lead_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [User].[UserProfile](UserId),
    CONSTRAINT FK_Lead_ModifiedUserId FOREIGN KEY (ModifiedUserId) REFERENCES [User].[UserProfile](UserId),
    CONSTRAINT FK_Lead_CampaignId FOREIGN KEY (CampaignId) REFERENCES [Marketing].[Campaign](Id),
    CONSTRAINT FK_Lead_AssignedUserId FOREIGN KEY (AssignedUserId) REFERENCES [User].[Users](Id)
);


-- ACCOUNT SCHEMA
EXEC('CREATE SCHEMA [ACCOUNT]')
GO

-- TODO ADD ACCOUNT TABLE
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
    [AssignedUserId] [UNIQUEIDENTIFIER] NULL,
    [CreatedBy] [UNIQUEIDENTIFIER] NOT NULL,
    [ModifiedBy] [UNIQUEIDENTIFIER] NOT NULL,
    [CreatedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()),
	[ChangedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()),
    [Udf1] [NVARCHAR](1024) NULL,
    [Udf2] [NVARCHAR](1024) NULL,
    [Udf3] [NVARCHAR](1024) NULL,
    -- ADD JOIN TABLE FOR ADDRESS SIMILAR TO [User].[UserAddress]
    -- FIX CONSTRAINT
    CONSTRAINT FK_Accounts_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [User].[UserProfile](UserId),
    CONSTRAINT FK_Accounts_ModifiedUserId FOREIGN KEY (ModifiedUserId) REFERENCES [User].[UserProfile](UserId),
    CONSTRAINT FK_Accounts_AssignedUserId FOREIGN KEY (AssignedUserId) REFERENCES [User].[UserProfile](UserId),
    CONSTRAINT FK_Accounts_TeamId FOREIGN KEY (TeamId) REFERENCES Teams(TeamId),
    CONSTRAINT FK_Accounts_ParentId FOREIGN KEY (ParentId) REFERENCES [User].[Accounts](AccountId),
    CONSTRAINT FK_Accounts_CampaignId FOREIGN KEY (CampaignId) REFERENCES Campaigns(Id)
)

-- TODO ADD CONTACT TABLE
-- CONTACT TABLE
CREATE TABLE [Account].[Contact](  
    [Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
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
    [AssignedUserId] [UNIQUEIDENTIFIER] NULL,
    [CreatedBy] [UNIQUEIDENTIFIER] NOT NULL,
    [ModifiedBy] [UNIQUEIDENTIFIER] NOT NULL,
    [CreatedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()),
	[ChangedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()),
    [Udf1] [NVARCHAR](1024) NULL,
    [Udf2] [NVARCHAR](1024) NULL,
    [Udf3] [NVARCHAR](1024) NULL,
    CONSTRAINT FK_User_Contact_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [User].[Users](UserId),
    CONSTRAINT FK_User_Contact_ModifiedBy FOREIGN KEY (ModifiedBy) REFERENCES [User].[Users](UserId),
    CONSTRAINT FK_Campaign_Contacts_CampaignId FOREIGN KEY (CampaignId) REFERENCES Campaigns(Id),
    CONSTRAINT FK_User_Contacts_AssignedUserId FOREIGN KEY (AssignedUserId) REFERENCES [User].[Users](UserId)
)


-- COMMIT/ROLLBACK TRANSACTION
IF @@TRANCOUNT > 0
  -- ROLLBACK 		
  --ROLLBACK TRANSACTION
  -- COMMIT
  COMMIT TRANSACTION
GO