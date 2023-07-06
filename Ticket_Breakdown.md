# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

We need create a new resource Facility-Agents so that the facilities can provide their own custom ID's for each agent that works with them. This is an EPIC task that will contain A frontend task and a backend end task

### Task 1: BACKEND:

> Implementation details:

- Create a table in the database called facility-agents. The table will contain the following fields: `facilityID`,
  `agentID`, `customID`
- The facilityID is a secondary key, linking to the id primary key in facilities table
- The agentID is a secondary key, linking to the id primary key in agents table
- The customID is the custom agent id to be provided by the facility
- Create a new POST endpoint for creating this new resource:
  endpoint /facilities/:facilityID/agents/:agentID
  request body: {
  "customID": "b0d6ddc8-6a10-4387-ad52-6dbb8d99792a"
  }
- When client makes the post request, get the facilityID and agentID from the request params
- Validate these IDs, e.g check that their format is correct and that they exists in the database
- Return 400 error message if the format is incorrect, with the appropriate error message
- Return 401 if the id is is not found, and specify which id is missing (facilityID, or agentID)
- Validate the customID. Each agent in each facility should have a unique customID
- After validating the data, save the record, and return appropriate success message with status code 201

> Acceptance cretera:

- As a client, I can make a post request to /facilities/:facilityID/agents/:agentID with the correct request body to create a custom id for an agent in a given facility
- As a client, I should expect the endpoint to validate all three ID fields appropriately and return a descriptive error message and the appropriate status code
- As a client, I should be able to execute a command to run the unit tests for this feature

> time/effort estimates:

- On an estimation scale of 1 to 10, I'll rate give this task a 5.
- I expect the task should take about 24 hours to be ready for QA

> Extra Note

- The new facility-agents is going to serve as a joining middle table between the agents and facilities table, providing a many-to-many relationship between the two tables.
- As a result, when a facility wants to generate report for a client, they'll call the report endpoint with the customID. The backend will use the customID to query the facility-agents collection joining the shifts table to ge the agent's hours worked for the given quarter. Below is a tentative SQL query for the search

```
SELECT f.customID, a.first_name, a.last_name, SUM(s.hours_worked) AS hours_worked
FROM facility_agens AS f
JOIN shifts AS s
ON f.facilityID = s.facilityID AND f.agentID = s.agentID
JOIN agents AS a
ON f.agentID = a.id
GROUP BY f.customID
HAVING s.shiftDate >= quarter_start_date AND s.shift_date <= quarter_end_date
```

where quarter_start_date and quarter_end_date can be provided

### Task 2: FRONTEND

> Implementation details:

- Create a new feature in facilities dashboard page for creating custom agent IDs
- An authorized facility magager should be able to select an agent from a searchable drop-down list
- Then provide the custom agent id (I assume they will use a third-party application for generating the custom id)
- The client will call the correct endpoint (see task 1), with the custom id in the request body
- If there was an error, the user should see an appropriate error message on the page
- If the request was successful, the user will be see a success message, and then will be redirected to the agent's profile page, where they can see the newly created custom id as part of the agent's metadata

> Acceptance cretera:

- As an authorzed user I should be able to search agents by their first or last name
- As a user, I should be able to get an appropriate error message if there are any errors while using the feaure
- As a user I should see a success message when I have successfully created a custom id for an agent
- As a user I should be redirected to the agent's profile page when I have successfully created a custom id for an agent
- As an unauthorized user I should not be able to see the page/components for creating agent's custom id

> time/effort estimates:

- On an estimation scale of 1 to 10, I'll rate give this task an 8.
- I expect the task should take about 48 hours to be ready for QA
- The reason for the estimation is because the client will have to implement 4 main mini-tasks in this task:
  1. Ensure that the user is authorized to access this feature
  2. Implement a searchable dropdown list of agents, which will involve calling a GET endpoint to get agents by searchable fields
  3. It'll make the call to submit the new custom id with the agentID and facilityID
  4. Tests should be written for the feature
