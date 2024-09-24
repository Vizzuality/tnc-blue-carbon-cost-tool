Feature: Create user as Admin
  
  Scenario: A user can not create a user if it is not an admin
    Given a user exists with valid credentials
    But the user has the role "partner"
    When the user creates a new user
    Then the user should receive a 403 status code


  Scenario: An Admin tries to register a partner with an existing email
    Given a admin user exists with valid credentials
    When the user creates a new user
    But the email is already in use
    Then the user should receive a 409 status code
    And the user should receive a message containing  "Email already exists"


    Scenario: An Admin registers a new user
    Given a admin user exists with valid credentials
    When the user creates a new user
    Then the user should receive a 201 status code
      And the user should not be active
      And an email should be sent
