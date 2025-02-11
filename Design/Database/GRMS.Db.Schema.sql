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
CREATE SCHEMA [Utility] 
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

-- REFERENCEITEM TABLE
CREATE TABLE [Utility].[ReferenceItem](      
	[Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
	[ReferenceId] [UNIQUEIDENTIFIER] NOT NULL, 
	[Code] [NVARCHAR](256) NOT NULL, 
	[Description] [NVARCHAR](512) NOT NULL, 
	[Archived] [DATETIME] NULL, 
	[CreatedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()), 
	[ChangedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()), 
	[Udf1] [NVARCHAR](512) NULL, 
	[Udf2] [NVARCHAR](512) NULL, 
	[Udf3] [NVARCHAR](512) NULL, 
	[SortOrder] [NVARCHAR](512) NULL,
	CONSTRAINT [FK_Utility_ReferenceItem_Reference] FOREIGN KEY ([ReferenceId]) REFERENCES [Utility].[Reference] ([Id]) ON DELETE CASCADE
)

-- ADDRESS TABLE
CREATE TABLE [Utility].[Address](      
	[Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL, 
	[Address1] [NVARCHAR](512 NOT NULL, 
	[Address2] [NVARCHAR](256 NULL, 
	[City] [NVARCHAR](256 NOT NULL, 
	[County] [NVARCHAR](256 NULL, 
	[StateId] [UNIQUEIDENTIFIER] NOT NULL, 
	[Zip] [NVARCHAR](256 NOT NULL, 
	[CountryId] [UNIQUEIDENTIFIER] NOT NULL, [AddressTypeId] [UNIQUEIDENTIFIER] NOT NULL, 
	[Latitude] [DECIMAL](9,6) NULL, 
	[Longitude] [DECIMAL](9,6) NULL, 
	[CreatedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()), 
	[ChangedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()), 
	[Udf1] [NVARCHAR](512 NULL, 
	[Udf2] [NVARCHAR](512 NULL, 
	[Udf3] [NVARCHAR](512 NULL,
	CONSTRAINT [FK_Utility_State_Address_ReferenceItem] FOREIGN KEY ([ReferenceItemId]) REFERENCES [Utility].[ReferenceItem] ([Id]),
	CONSTRAINT [FK_Utility_Country_Address_ReferenceItem] FOREIGN KEY ([ReferenceItemId]) REFERENCES [Utility].[ReferenceItem] ([Id])
)

-- USER SCHEMA
CREATE SCHEMA [User] 
GO

-- USER TABLE
CREATE TABLE [User].[Users](  
	[Id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL,
	[UserName] [NVARCHAR](256) NOT NULL,
	[Email] [NVARCHAR](256) NOT NULL,
	[EmailConfirmed] [BIT] NOT NULL,
	[PasswordHash] [NVARCHAR](512) NOT NULL,
	[SecurityStamp] [NVARCHAR](256) NOT NULL,
	[PhoneNumber] [NVARCHAR](256) NULL,
	[PhoneNumberConfirmed] [BIT] NOT NULL,
	[MobileNumber] [NVARCHAR](256) NULL,
	[MobileNumberConfirmed] [BIT] NOT NULL,
	[NationalId] [NVARCHAR](512) NULL,
	[NationalIdVerificationDate] [DATETIME] NULL,
	[TwoFactorEnabled] [BIT] NOT NULL,
	[LockoutEndDateUtc] [DATETIME] NULL,
	[LockoutEnabled] [BIT] NOT NULL,
	[AccessFailedCount] [INT] NOT NULL,
	[CreatedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()),
	[ChangedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()),
	[DeletedOn] [DATETIME] NULL,
	[DeactivatedDate] [DATETIME] NULL,  
	[ReportsTo] [UNIQUEIDENTIFIER] NULL,
	[Udf1] [NVARCHAR](512) NULL,
	[Udf2] [NVARCHAR](512) NULL,
	[Udf3] [NVARCHAR](512) NULL,
	CONSTRAINT [FK_ReportsTo_Users_Users] FOREIGN KEY ([ReportsTo]) REFERENCES [User].[Users] ([Id])
)

-- USERPROFILE TABLE
CREATE TABLE [User].[UserProfile](  
	[UserId] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL, 
	[FirstName] [NVARCHAR](256) NOT NULL, 
	[LastName] [NVARCHAR](256) NOT NULL, 
	[Degree] [NVARCHAR](128) NULL, 
	[UserTypeId] [UNIQUEIDENTIFIER] NOT NULL, 
	[Title] [NVARCHAR](256) NULL, 
	[Suffix] [NVARCHAR](256) NULL, 
	[Prefix] [NVARCHAR](256) NULL, 
	[PrefferedName] [NVARCHAR](256) NULL, 
	[Dob] [DATE] NULL, 
	[GenderId] [UNIQUEIDENTIFIER] NOT NULL, 
	[CountryId] [UNIQUEIDENTIFIER] NOT NULL, 
	[PictureUrl] [NVARCHAR](1024) NULL, 
	[Udf1] [NVARCHAR](1024) NULL, 
	[Udf2] [NVARCHAR](1024) NULL, 
	[Udf3] [NVARCHAR](1024) NULL 
)

CREATE TABLE [User].[UserClaim](      
	[UserId] [UNIQUEIDENTIFIER] NOT NULL, 
	[ClaimType] [NVARCHAR](256) NOT NULL, 
	[ClaimValue] [NVARCHAR](256) NOT NULL, 
	[CreatedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()),
	[ChangedOnUtc] [DATETIME] NOT NULL DEFAULT (getutcdate()),
	CONSTRAINT [PK_User_UserClaim] PRIMARY KEY CLUSTERED ([UserId], [ClaimType], [ClaimValue])
)

CREATE TABLE [User].[UserAddress](      
	[UserId] [UNIQUEIDENTIFIER] NOT NULL, 
	[AddressId] [UNIQUEIDENTIFIER] NOT NULL, 
	[Preffered] [BIT] NOT NULL, 
	CONSTRAINT [PK_User_UserAddress] PRIMARY KEY CLUSTERED ([UserId], [AddressId])
)

CREATE TABLE [User].[UserRefreshToken](      
	[UserId] [UNIQUEIDENTIFIER] NOT NULL, 
	[Code] [NVARCHAR](900) NOT NULL, 
	[Expiration] [DATETIME] NOT NULL, 
    CONSTRAINT [PK_User_UserRefreshToken] PRIMARY KEY CLUSTERED ([UserId], [Code])
)

-- MARKETING SCHEMA
CREATE SCHEMA [MARKETING] 
GO

-- TODO ADD CAMPAIGN TABLE 
-- TODO ADD LEAD TABLE


-- ACCOUNT SCHEMA
CREATE SCHEMA [ACCOUNT] 
GO

-- TODO ADD ACCOUNT TABLE 
-- TODO ADD CONTACT TABLE

-- COMMIT/ROLLBACK TRANSACTION
IF @@TRANCOUNT > 0
  -- ROLLBACK 		
  --ROLLBACK TRANSACTION
  -- COMMIT
  COMMIT TRANSACTION
GO