Feature: Validate Token

  # Scenarios for Reset Password Tokens

  Scenario: Validating a valid reset-password token
    Given a user has requested a password reset
    When the user attempts to validate the token with type "reset-password"
    Then the user should receive a 200 status code

  Scenario: Validating an expired reset-password token
    Given a reset-password token has expired
    When the user attempts to validate the expired token with type "reset-password"
    Then the user should receive a 401 status code

  Scenario: Validating a reset-password token with an invalid signature
    Given a reset-password token has an invalid signature
    When the user attempts to validate the token with type "reset-password"
    Then the user should receive a 401 status code


  Scenario: Validating a reset-password token with an incorrect type parameter
    Given a user has a valid reset-password token
    When the user attempts to validate the token with type "access"
    Then the user should receive a 401 status code

  Scenario: Validating a reset-password token without specifying the type
    Given a user has a valid reset-password token
    When the user attempts to validate the token without specifying the type
    Then the user should receive a 400 status code
  ## TODO: Include this step when implemented common error shapes
   # And the response message should include "expected": "'access' | 'reset-password' | 'email-confirmation'"

  # Scenarios for Access Tokens

  Scenario: Validating a valid access token
    Given a user has a valid access token
    When the user attempts to validate the token with type "access"
    Then the user should receive a 200 status code

  Scenario: Validating an expired access token
    Given an access token has expired
    When the user attempts to validate the expired token with type "access"
    Then the user should receive a 401 status code

  Scenario: Validating an access token with an invalid signature
    Given an access token has an invalid signature
    When the user attempts to validate the token with type "access"
    Then the user should receive a 401 status code

  Scenario: Validating an access token with an incorrect type parameter
    Given a user has a valid access token
    When the user attempts to validate the token with type "reset-password"
    Then the user should receive a 401 status code

  # Common Scenarios for Both Token Types

  Scenario: Validating a token without providing the Authorization header
    When the user attempts to validate a token without providing the Authorization header
    Then the user should receive a 401 status code



