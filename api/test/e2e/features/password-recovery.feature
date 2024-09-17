Feature: Password Recovery

  Scenario: An email should be sent if a user is found
    Given a user exists with valid credentials
    When the user requests password recovery
    Then the user should receive a 201 status code
    And an email should be sent

  Scenario: No email should be sent if the user is not found
    When the user requests password recovery with an invalid email
    Then the user should receive a 201 status code
    And no email should be sent
