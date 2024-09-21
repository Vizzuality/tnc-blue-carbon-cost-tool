Feature: Reset Password

  Scenario: Successfully resetting the password with a valid token
    Given a user has a valid reset-password token
    When the user attempts to reset their password with a new valid password
    Then the user should receive a 201 status code
    And the user can log in with the new password

  Scenario: Attempting to reset the password with an expired token
    Given a user has an expired reset-password token
    When the user attempts to reset their password with a new valid password
    Then the user should receive a 401 status code
