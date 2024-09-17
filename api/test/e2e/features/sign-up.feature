Feature: User Sign Up

  Scenario: A user cannot sign up with an already registered email
    Given a user exists with valid credentials
    When the user attempts to sign up with the same email
    Then the user should receive a 409 status code
    And the response message should be "Email already exists"

  Scenario: A user successfully signs up with a new email
    When a user attempts to sign up with valid credentials
    Then the user should be registered successfully
    And the user should have a valid ID and email
