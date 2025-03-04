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

-- STORED PROCEDURES
-- Insert Failed Login Attempt
CREATE PROCEDURE [User].InsertFailedLoginAttempt
    @UserID UNIQUEIDENTIFIER
AS
BEGIN
    DECLARE @CurrentAttemptCount INT;
    DECLARE @IsLocked BIT;
    DECLARE @AttemptTime DATETIME;

    SET @AttemptTime = GETDATE();

    SELECT @CurrentAttemptCount = AccessFailedCount
    FROM [User].[Users]
    WHERE Id = @UserID;

-- Increment the attempt count
    SET @CurrentAttemptCount = @CurrentAttemptCount + 1;

-- Lock the account if the number of failed attempts exceeds 5
 
    IF @CurrentAttemptCount >= 5
    BEGIN
        SET @IsLocked = 1;
-- Set LockoutEndDate to 15 minutes from now
        UPDATE [User].[Users]
        SET AccessFailedCount = @CurrentAttemptCount,
            LockoutEndDate = DATEADD(minute, 30, @AttemptTime),
            LockoutEnabled = @IsLocked
        WHERE Id = @UserID;
    END
    ELSE
    BEGIN
        SET @IsLocked = 0;
-- Update AccessFailedCount without locking the account
        UPDATE [User].[Users]
        SET AccessFailedCount = @CurrentAttemptCount,
            LockoutEnabled = @IsLocked
        WHERE Id = @UserID;
    END
END;

-- Check Lock Status
CREATE PROCEDURE [User].CheckLockStatus
    @UserID UNIQUEIDENTIFIER,
    @IsLocked BIT OUTPUT
AS
BEGIN
    DECLARE @LockoutEndDate DATETIME;

    SELECT @LockoutEndDate = LockoutEndDate
    FROM [User].[Users]
    WHERE Id = @UserID;

    IF @LockoutEndDate IS NOT NULL AND @LockoutEndDate > GETDATE()
    BEGIN
        SET @IsLocked = 1;
    END
    ELSE
    BEGIN
        SET @IsLocked = 0;
    END
END
GO

-- Reset Failed Login Attempts
CREATE PROCEDURE [User].ResetFailedLoginAttempts
    @UserID UNIQUEIDENTIFIER
AS
BEGIN
    UPDATE [User].[Users]
    SET AccessFailedCount = 0,
        LockoutEndDate = NULL,
        LockoutEnabled = 0
    WHERE Id = @UserID;
END
GO

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

-- Sprint2 
-- Update Password in the Users table
UPDATE [User].[Users]
SET [PasswordHash] = 'new password hash', [ChangedOnUtc] = GETUTCDATE()
WHERE [Id] = 'user unique identifier';

-- Update Contact Number (PhoneNumber and MobileNumber) in the Users table
UPDATE [User].[Users]
SET [PhoneNumber] = 'new phone#', [MobileNumber] = 'new mobile #', [ChangedOnUtc] = GETUTCDATE()
WHERE [Id] = 'user unique identifier';

-- Update Date of Birth (Dob) in the UserProfile table
UPDATE [User].[UserProfile]
SET [Dob] = 'new DOB'
WHERE [UserId] = 'user unique identifier';

-- Update Address in the UserAddress table
UPDATE [User].[UserAddress]
SET [AddressId] = 'new address id', [Preffered] = 'new preferred status'
WHERE [UserId] = 'user unique identifier' AND [AddressId] = 'current address id';
--
CREATE FUNCTION dbo.ValidatePassword(@Password NVARCHAR(512))
RETURNS BIT
AS
BEGIN
    DECLARE @IsValid BIT = 1;

    -- Check if the password length is at least 8 characters
    IF LEN(@Password) < 8
        SET @IsValid = 0;

    -- Check if the password contains at least one uppercase letter
    IF @Password NOT LIKE '%[A-Z]%'
        SET @IsValid = 0;

    -- Check if the password contains at least one lowercase letter
    IF @Password NOT LIKE '%[a-z]%'
        SET @IsValid = 0;

    -- Check if the password contains at least one digit
    IF @Password NOT LIKE '%[0-9]%'
        SET @IsValid = 0;

    -- Check if the password contains at least one special character
    IF @Password NOT LIKE '%[!@#$%^&*()]%'
        SET @IsValid = 0;

    RETURN @IsValid;
END;
GO
--
CREATE TRIGGER trgValidatePassword
ON [User].[Users]
INSTEAD OF INSERT, UPDATE
AS
BEGIN
    DECLARE @IsValid BIT;
    DECLARE @Password NVARCHAR(512);
    DECLARE @UserId UNIQUEIDENTIFIER;

    -- Retrieve the password from the inserted or updated row
    SELECT @Password = [PasswordHash], @UserId = [Id]
    FROM inserted;

    -- Validate the password
    SET @IsValid = dbo.ValidatePassword(@Password);

    -- If the password is not valid, raise an error
    IF @IsValid = 0
    BEGIN
        RAISERROR('Password does not meet strength requirements.', 16, 1);
        ROLLBACK TRANSACTION;
    END
    ELSE
    BEGIN
        -- If the password is valid, proceed with the insert or update
        IF EXISTS (SELECT 1 FROM [User].[Users] WHERE [Id] = @UserId)
        BEGIN
            -- Update existing row
            UPDATE [User].[Users]
            SET [PasswordHash] = @Password,
                [ChangedOnUtc] = GETUTCDATE()
            WHERE [Id] = @UserId;
        END
        ELSE
        BEGIN
            -- Insert new row
            INSERT INTO [User].[Users]([Id], [PasswordHash], [ChangedOnUtc], ... )
            SELECT [Id], [PasswordHash], GETUTCDATE(), ...
            FROM inserted;
        END
    END
END;
GO
-- 
-- COMMIT/ROLLBACK TRANSACTION
IF @@TRANCOUNT > 0
  -- ROLLBACK 		
  --ROLLBACK TRANSACTION
  -- COMMIT
  COMMIT TRANSACTION
GO