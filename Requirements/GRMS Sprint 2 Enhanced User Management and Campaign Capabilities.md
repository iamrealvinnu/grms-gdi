# Sprint2 Planning for Planning for Enhanced User Management and Campaign Capabilities

## Sprint Duration: 
2 weeks

## Features in Sprint 2:
1. User Profile
2. Forgot/Reset Password
3. Campaign Module
   

### Non-Functional Requirements:
  - Form submission should complete within 5 seconds.
  - The form should be accessible on mobile and desktop views.
  - Browser Compatibility: The dashboard should be fully functional and display correctly on the latest versions of Google Chrome, Sa Microsoft Edge, and Mozilla Firefox.

## Feature 1: User Profile
- ## User Story 1: Edit Profile Information
**Title:** Edit Profile Information

**Description:** As a user, I want to edit my profile information (password, Contact #, address, profile picture preferences) so that I can keep my data current.

### Tasks:

**Design User Profile Page:**
- **UI Team:** Design User profile page with editable fields (password, Contact #, address, profile picture preferences).

**Implement Field Validation:**
- **UI Team:** Implement validation for password strength and confirmation fields.

**Develop Profile Update Endpoint:**
- **API Team:** Implement save functionality for updating user profile (PUT request).

**Create API Endpoint for User Information:**
- **API Team:** Create API endpoint for updating user information.

**Define User Profile Schema:**
- **Backend Team:** Create database schema for user profile data (email, password, preferences).

**SQL Queries for Profile Data Update:**
- **Backend Team:** Develop SQL queries to update user profile data.

**Implement Password Validation:**
- **Backend Team:** Implement password strength validation on the backend.

---

- ## User Story 2: Save Profile Changes
**Title:** Save Profile Changes

**Description:** As a user, I want my profile changes to be saved successfully so that I receive a confirmation notification.

### Tasks:

**Notification for Successful Save:**
- **UI Team:** Implement notification functionality for successful save.

**Optimize API Performance:**
- **API Team:** Ensure API performance to meet the non-functional requirement of saving changes within 5 seconds.

**Optimize Database for Performance:**
- **Backend Team:** Optimize database operations to meet the 5-second save requirement.

---## Feature: Password Reset
**Description:** Implement a secure and user-friendly password reset functionality to allow users at initial password change option for users when they first log in, having been added by an admin and additionally to reset their forgotten passwords.

### Acceptance Criteria
1. Users can request a password reset via their registered email address.
2. Users receive an email with a secure link to reset their password.
3. The password reset link is valid for a specified period.
4. Users can set a new password that meets the strength requirements.
5. Users must confirm the new password by entering it twice.
6. Appropriate error messages are displayed for validation failures.
7. Passwords are securely hashed and stored in the database.
8. Users added by an admin are prompted to change their password on their first login.
9. Users added by an admin must set a password that meets the strength requirements.
10. Users must confirm their new password by entering it twice on the first login.

## Product Backlog: Implement Password Reset and Initial Login Functionality
**Description:** As a user, I want to reset and change my initial password when I first log in after being added by an admin and also change my password if I forget it so that I can ensure my account is secure.

### Acceptance Criteria
- The system provides an option to request a password reset on the login page.
- Users receive a password reset email.
- The password reset link redirects users to a password reset form.
- Users can set and confirm a new password that meets the defined security requirements.
- The system validates the new password and confirmation password.
- The system securely updates the user's password in the database.
- Users added by an admin are prompted to change their password on their first login.
- Users must set a new password that meets the defined requirements.
- The system validates the new password and confirmation password during the first login.
- The system securely updates the user's password in the database after the initial login.

## Tasks:
### UI Team: Add initial login password change prompt for users added by an admin.
**Description:** Add initial login password change prompt for users added by an admin.
- High-fidelity design
- Frontend development
- Validation

### UI Team: Design and implement the password reset request form on the login page.
**Description:**
1. Design and implement the password reset request form on the login page.
2. Design and implement the password reset form.
3. High-fidelity design, frontend development, validation.

### UI Team: Ensure the new password meets the security requirements (e.g., length, complexity).
**Description:** Ensure the new password meets the security requirements (e.g., length, complexity).
- Frontend validation
- Error messages

### UI Team: Provide user notifications for successful and failed password resets.
**Description:** UI notifications, success/error messages.

### API Team: Create Password Reset Request API Endpoint
**Description:** Create an endpoint to handle password reset requests (e.g., POST /api/users/request-password-reset).
- Ensure the endpoint receives the link or email address and processes the request securely.

### API Team: Implement Save Campaign Functionality.

### DB Team: Add columns for password reset tokens and timestamps to the user table.
**Description:** Database schema updates.
- Add Columns for Password Reset Tokens and Timestamps.
- Ensure Secure Storage of Passwords.

### DB Team: Implement queries for updating passwords securely
**Description:** SQL queries, secure hashing.

## Feature: Campaign Module
**Description:** The Campaign module allows CRM users to create and manage marketing campaigns, tracking their start and end dates along with a brief description.

### Acceptance Criteria (AC):
1. Users can create new campaigns with a name, description, start date, and end date.
2. Users can view existing campaigns with the details of name, description, start date, and end date.
3. Users can edit existing campaigns to update the name, description, start date, and end date.
4. Users can delete campaigns, removing all associated details from the system.
5. The system should validate that the start date is before the end date when creating or updating a campaign.

## Product Backlog Item: Campaign Management

**Description:** 
As a CRM user, I want to create, manage, and analyze marketing campaigns so that I can effectively reach and engage my target audience.

### Acceptance Criteria:
1. Users can create new campaigns with a name, description, start date, and end date.
2. Users can view existing campaigns with the details of name, description, start date, and end date.
3. Users can edit existing campaigns to update the name, description, start date, and end date.
4. Users can delete campaigns, removing all associated details from the system.
5. The system should validate that the start date is before the end date when creating or updating a campaign.


## Tasks for Teams
### UI Team:
- **Design Campaign Creation Form:**
  - Create a form with fields for Campaign Name, Description, Start Date, and End Date.

### API Team:
- **Implement Save Campaign Functionality:**
  - Implement Save Campaign Functionality.

### Database Team:
- **Database Schema Design:**
  - Create the Campaigns table as defined with Campaign Name, Description, Start Date, End Date.


## Sprint Goal
The goal for this sprint is to implement and ensure the functionality and performance of the User Profile, Forgot/Reset Password, and Campaign Module features. This includes enabling users to manage their profiles, securely reset their passwords, and create/manage campaigns efficiently, while ensuring the system meets non-functional requirements such as performance, accessibility, and browser compatibility.
