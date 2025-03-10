# Sprint Planning - User Authentication Module

## Sprint Duration : 14 days

### Sprint 1 - User Authentication Module (14 Days)

#### Epic: User Authentication Module for CRM

## Features

1. User Sign-in form and Validation
2. Integrate Google and Microsoft sign-ins
3. Implement Security Measures – Account Lock & Auto-Logout

## PBI 1: User Sign-in form and Validation
## Description
Create user sign-in form and validation.

## Acceptance Criteria
1. The sign-in form includes email and password fields.
2. Email field: Accepts only valid email formats (e.g., user@example.com).
3. Displays an error message when the email format is invalid.
4. Password field: Enforces a minimum password length of 8 characters.
5. Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.
6. Displays an error message when the password does not meet the criteria.
7. Error messages are displayed when:
   - The email or password is invalid.
   - There is a server-side error or failed login.
9. Successful login redirects the user to the dashboard.

## Tasks
### UI Team: Sign-In Form UI
**Description:**
- Design the layout of the sign-in form.
- Design field components for email and password.
- Implement the sign-in form UI using Mern Stack.
- Test the responsiveness of the sign-in form.

### UI Team: Form Field Validation
- Implement email format validation.
- Implement password strength validation.
- Implement error messages for invalid inputs.

### UI Team: Backend Integration
- Implement API call from frontend to backend.
- Handle API responses (success, failure).
- Implement error handling for failed API calls (e.g., network issues).

### UI Team: Authentication Response Handling
1. Implement successful login redirection to the dashboard.
2. Ensure the redirection happens only after the token has been successfully received and stored.
3. Implement failed login error message display (e.g., invalid username/password, locked account).
4. Implement generic error message for system/network issues (e.g., Unable to connect, please try again later).

### Backend Team: Add User Type & Industry Type Field
- Add UserType Field and IndustryType to UtilityReference and insert values to UtilityReferenceItem with sortorder which helps to categorize the users and the industry.

### Backend Team: Increment SortOrder by 10 for IndustryType and UserType
- Increment SortOrder by 10 for IndustryType and UserType.

## PBI 2: Integrate Google and Microsoft sign-ins
## Tasks
### UI Team: Design Google and Microsoft Sign-In UI
**Description:** Add Google and Microsoft sign-in buttons to the UI. Ensure a user-friendly design.

### UI Team: Implement Google Sign-In/Microsoft Frontend Integration
**Description:** 
- Configure frontend to initiate OAuth login via Google/Microsoft API respectively.
- Handle responses & UI feedback.
- Implement UI elements (buttons) for Google and Microsoft login.
- Call the respective OAuth authentication APIs.
- Handle authentication responses (success, failure, error messages).
- Display appropriate UI feedback (loading indicators, error messages).

### API Team: Develop Middleware for Google Sign-In/Microsoft
**Description:**
- Implement OAuth 2.0 authentication flow for Google/Microsoft, process tokens, and manage sessions.
1. Integrate OAuth 2.0 authentication for Google and Microsoft sign-ins.
2. Handle authentication requests and redirects from the frontend.
3. Process and validate OAuth tokens received from Google/Microsoft.
4. Store and manage user sessions based on successful authentication.
5. Implement token expiration handling and session security measures.

### API Team: Handle Authentication Responses (Success/Failure)
**Description:** Process backend responses and send appropriate UI feedback (errors, success messages).

### API Team: Backend Integration
**Description:** Create API endpoint for user credentials submission.

## PBI 3: Implement Security Measures – Account Lock & Auto-Logout
## Description
Enhance user authentication security by implementing the following measures:
- Account Lock on Failed Login Attempts.
- Auto-Logout After Inactivity.

## Acceptance Criteria
1. User account locks after 5 failed attempts, with a proper message.
2. Unlock process via password reset or admin intervention.
3. Users are logged out automatically after inactivity.
4. Warning message appears before session expiry.
5. Security logs record failed attempts and logouts.

## Tasks
### API Team: Track Failed Login Attempts
**Description:** Implement backend logic to track failed login attempts within a defined timeframe (e.g., 5 attempts within 10 minutes).

### API Team: Lock Account After 5 Failed Login Attempts
**Description:**
1. Lock the user account after exceeding 5 consecutive failed login attempts.
2. Store the lock status in the database and prevent further login attempts.

### Backend Team: Store & Retrieve Failed Login Attempt Data
**Description:** Store failed login attempts, timestamps, and lock status in the database.

### UI Team: Display Lockout Message in UI
**Description:**
1. Show an error message when a user is locked out (more than 5 attempts).
2. Provide guidance on how to unlock the account (e.g., Reset your password).

### API Team: Implement Unlock Mechanism
**Description:** Provide an API for unlocking user accounts (via password reset).

### UI Team: Auto-Logout Users After Inactivity
**Description:**
1. Implement backend logic to log users out after 15 minutes of inactivity.
2. Ensure session tokens are invalidated upon logout.

### Database Team: Redirect Users to Login Page After Auto-Logout
1. Ensure that users are redirected to the login page after automatic logout.
2. Provide a smooth transition to improve user experience.

## Sprint Goal:
The sprint goal is to implement a robust and secure user authentication module for the CRM system. This includes creating and validating a user sign-in form, integrating Google and Microsoft sign-ins, and enhancing security through measures like account lockout and auto-logout.