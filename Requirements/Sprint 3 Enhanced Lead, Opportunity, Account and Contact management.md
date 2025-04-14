# Sprint3 Planning for CRM Process Enhancements

## Sprint Duration: 
2 weeks

## Features in Sprint 2:
1. Lead Management
2. Opportunity Managementsssss
3. Customer Management
4. Chatbot Integration for CRM


# Non-Functional Requirements

1. **Form Submission Performance**: 
   - Form submission must complete within **5 seconds** under standard load.

2. **Accessibility**: 
   - The form should be accessible and responsive on both **mobile** and **desktop** views.

3. **Browser Compatibility**: 
   - The dashboard should function fully and display correctly on the latest versions of:
     - **Google Chrome**
     - **Microsoft Edge**
     - **Mozilla Firefox**
     - **Safari**

## Feature 1: Lead Management
- ## User Story 1: Create and Manage Leads
**Title:** Create and Manage Leads

**Description:** As a sales representative, I want to create and manage leads, track their status, and convert them into opportunities.

**Acceptance Criteria:**
1. User can create leads with necessary details (name, status, source, etc.).
2. Leads can be converted into opportunities.
3. Notifications should trigger on saving or updating lead status.

### Tasks:

**Design Lead Creation Form:**
- **UI Team:** Design Lead creation form with necessary fields (name, status, source, qualification, contact #, interest level, comments, owner).

**Implement Dropdown for Status Updates:**
- **UI Team:** Implement dropdown for status updates, source, qualification, interest level.

**Implement "Convert Lead" Functionality:**
- **API Team:** Implement "Convert Lead" functionality (convert lead to opportunity).

**Create API Endpoint to Save/Update Lead Status:**
- **API Team:** Create API endpoint to save/update lead status.

**Define Lead Schema:**
- **Backend Team:** Create database schema for leads and their status.

**SQL Queries for Lead Data:**
- **Backend Team:** Develop SQL queries to save, update, and retrieve lead data.

**Implement Lead Conversion Logic:**
- **Backend Team:** Implement logic to handle lead conversion and status updates.

---

- ## User Story 2: Optimize Lead Management

**Title:** Optimize Lead Management

**Description:** As a sales representative, I want my lead creation and management process to be efficient and responsive..

**Acceptance Criteria:**
1. The system should support and provide notifications for successful actions, such as saving or updating lead information, within 5 seconds of completion.
   - Example: Display a message "Lead information saved successfully!".
2. Provide clear error messages for any issues encountered during lead management, such as validation errors or system failures.
   - Example: Display an error message "Failed to save lead information. Please try again."

**Tasks:**

**Notification for Lead (save/fail):**
- **UI Team:** Implement notification/error functionality for successful save and failed save.

**API Response for Lead Save Operation:**
- **API Team:**The API needs to provide appropriate responses indicating whether the lead save operation was successful or failed.

**Successful Lead Save:** 
- **API Team:** The API should return a success status code (e.g., 201 created) along with a success message("Lead saved successfully!").
A failed status": "error", "message": "Failed to save lead. Please try again."

## User Story 3: Lead Form Interface
**Title:** Design and implement the "Save" and "Convert" buttons on the lead form.
**Description:** 
   1. "Save" button: Saves the current state of the lead form with all the entered information.
   2. "Convert" button: Converts the lead into an opportunity, saves the current state, updates the status to "Converted," and creates a new opportunity record.

**Acceptance Criteria:**
   1. Users can save the lead form without converting.
   2. Users can convert a lead into an opportunity and be redirected to the new opportunity page or shown a success message.

### Tasks:

**Design and implement "Save" and "Convert" buttons:**
- **UI Team:** Save button: Save lead form with entered information.
Convert button: Convert lead to opportunity, update status, and create opportunity record.

**Develop API endpoints for saving and converting leads:**
- **API Team:** Save Lead API: Validate and store lead information without converting.
Convert Lead API: Validate, process conversion, and return appropriate responses..

**Update schema and implement logic for saving and converting leads:**
- **Backend Team:** Schema Updates: Create tables and relationships for lead and opportunity data.
Stored Procedures: Develop procedures for saving and converting leads, ensuring data integrity.

## User Story 4: Lead form-User Notifications
**Title:** Implement Lead Form and User Notifications.
**Description:** 
   1.  Display relevant information about saved leads or converted opportunities.

**Acceptance Criteria:**
   1. Users receive notifications for successful saves and conversions.
   
### Tasks:

**Implement Lead Form and User Notifications:**
- **UI Team:** Display relevant information about saved leads or converted opportunities.
eg., 
1. Lead Saved Successfully-"Lead 'DMART' has been saved successfully."
2. Opportunity Created-"Lead 'DMART' has been successfully converted to an opportunity named 'DMART - Product Demo'."
3. Error Notification: "There was an error saving the lead. Please try again."

**Implement API responses to trigger notifications:**
- **API Team:** Ensure API responses trigger notifications on the client side on success status and success conversion.

---

# Feature 2: Opportunity Management

## User Story 1: Create and Manage Opportunities

### Title: Create and Manage Opportunities

### Description:
As a sales representative, I want to manage opportunities to track deals through different stages of the sales pipeline.

### Acceptance Criteria:
- Users can create new opportunities and assign them to specific accounts or leads.
- Opportunities have statuses (e.g., "Prospecting," "Negotiation," "Closed-Won," "Closed-Lost").
- Users can update the opportunity details and log activities or tasks related to them.

---

## Tasks:

### UI Team:
1. **Design Opportunity Creation Form**:
   - Include fields such as opportunity name, associated account/lead, estimated value, close date, and stage.
2. **Add a Kanban-style Pipeline View**:
   - Visualize opportunities in different stages of the pipeline.

### API Team:
1. **Create Endpoints for Managing Opportunities**:
   - Endpoints for creating, updating, and retrieving opportunities.

2. **Validate Data**:
   - Ensure relationships between opportunities, accounts, and leads.
   Endpoint-Level Validation:

         - Validate relationships at the API layer before passing data to the database

         - Check if the referenced Account ID or Lead ID exists.


   - Return error responses for invalid data

### Backend Team:
1. **Define Database Schema**:
   - Create schema for opportunities and relationships (e.g., lead-to-opportunity mapping).
2. **Implement Logic for Status Transitions and Updates**:
   - Develop backend logic to manage status changes effectively.
--
## Feature 3:Customer Management

- ## User Story 1: Manage Customer Information
**Title:** Manage Customer Information

**Description:** As a user, I want to add and edit customer details such as name, address, contact information, status, and industry type so that I can maintain accurate customer data.

**Acceptance Criteria:**
1. Users should be able to create and edit customer profiles.
2. Data should be saved to the database on clicking the "Save" button.
3. Form validation for required fields (name, contact, address, status, etc.).
4. Success or error message on save.

### Tasks:

**Create Customer Form:**
- **UI Team:** Create Customer form with necessary fields (name, contact number, email, website, address (billing, shipping, country, state, city, postal code), status (active, inactive, prospective), comments, Contact # of customer service/sales team).

**Ensure Form Validation:**
- **UI Team:** Ensure form validation for all fields (required, format validation, etc.).

**Implement "Save" Functionality:**
- **API Team:** Implement the "Save" functionality for customer data (POST/PUT requests).

**Develop API Endpoint to Save/Retrieve Customer Information:**
- **API Team:** Develop API endpoint to save and retrieve customer information.

**Define Customer Schema:**
- **Backend Team:** Create database schema for customer profiles.

**SQL Queries for Customer Data:**
- **Backend Team:** Develop SQL queries to save and retrieve customer data.

**Implement Form Validation Logic:**
- **Backend Team:** Implement logic to handle form validation and error handling on the backend.

---

- ## User Story 2:Optimize Customer Management

**Title:** Optimize Customer Management

**Description:** As a user, I want my customer management process to be efficient and responsive.

**Acceptance Criteria:**
1. The system should support and provide notifications for successful actions, such as saving or updating customer information, within 5 seconds of completion.
   - Example: Display a message "Customer information saved successfully!".
2. Provide clear error messages for any issues encountered during customer management, such as validation errors or system failures.
   - Example: Display an error message "Failed to save customer information. Please try again."

**Tasks:**

**Notification for customer (save/fail):**
- **UI Team:** Implement notification/error functionality for successful save and failed save.

**API Response for Customer Save Operation:**
- **API Team:**The API needs to provide appropriate responses indicating whether the customer save operation was successful or failed.

**Successful Customer Save/Fail:** 
- **API Team:** The API should return a success status code (e.g., 201 created) along with a success message("customer saved successfully!").
A failed status": "error", "message": "Failed to save customer. Please try again."
--

## Feature 4: Chatbot Integration for CRM

- ## User Story 1:  Chatbot Integration (Text and Voice Capabilities)**

**Title:** 
Develop an intelligent chatbot to support CRM users by answering questions, providing navigation assistance, and offering CRM feature guidance.


#### **Acceptance Criteria:**
- The chatbot provides CRM-specific responses for text and voice inputs.
- Voice recognition accuracy is at least 90% for common CRM-related queries.
- Responses are context-aware and user-specific after authentication.
- Fallback support is available for unrecognized queries.
- The chatbot is embedded seamlessly in the CRM dashboard UI.

#### **Tasks:**

##### **Frontend (UI) Tasks:**
1. **Embed Chatbot UI**  
   - Integrate the chatbot widget into the CRM dashboard.
   - Ensure compatibility with both text and voice inputs.

2. **Voice Input UI**  
   - Add a microphone button to trigger voice input.  
   - Provide visual feedback for voice recognition (e.g., "Listening...").

3. **Conversation Display**  
   - Format chatbot responses for both text and voice interactions.  
   - Highlight voice-input queries as transcripts for user reference.

---

##### **Backend (API) Tasks:**
1. **NLP Engine Integration for Text and Voice**  
   - Connect with Azure Cognitive Services for Speech-to-Text (STT) and Text-to-Speech (TTS) capabilities.  
   - Utilize Azure LUIS for CRM-specific intent recognition and dialog management.

2. **Voice Input Processing**  
   - Process voice queries into text for NLP analysis.
   - Translate chatbot responses into voice using TTS.

3. **Authentication-Specific Responses**  
   - Personalize chatbot interactions based on user role and permissions.  

4. **Error Handling**  
   - Handle STT/TTS errors and fallback gracefully (e.g., prompt user for text input if voice fails).
---

Sprint Goal:

"To enhance the CRM system by implementing core functionalities for managing leads, customers, and opportunities, ensuring efficient workflows, accurate data handling, and a seamless user experience. This includes building intuitive user interfaces, robust APIs, and backend logic to support lead conversion, customer management, opportunity tracking, and notification systems also,incorporates advanced AI features for improved user interaction through text and voice-enabled chatbots."


