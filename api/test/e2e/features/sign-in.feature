Feature: Sign In

  Scenario: A user tries to sign in with non-existing credentials
    When a user attempts to sign in with non-existing credentials
    Then the user should receive a 401 status code
    And the response message should be "Invalid credentials"

  Scenario: A user tries to sign in with an incorrect password
    Given a user exists with valid credentials
    When a user attempts to sign in with an incorrect password
    Then the user should receive a 401 status code
    And the response message should be "Invalid credentials"

  Scenario: A user successfully signs in
    Given a user exists with valid credentials
    When a user attempts to sign in with valid credentials
    Then the user should receive a 201 status code
    And the access token should be defined
