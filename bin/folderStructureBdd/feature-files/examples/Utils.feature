@utils @example
Feature: Utils Step Definitions

    Example file containing the step definitions for common utils

    Scenario: Wait for element
        Given I go to url "Google Site"
        Then I wait for "Google Search Input" to be present

    Scenario: Wait for "n" seconds
        Given I go to url "Google Site"
        # Use this to see changes too fast to capture visually
        Then I wait for 2 seconds

    Scenario: Set Viewport size to a breakpoint
        Given I set viewport as "mobile"
        Then I go to url "https://alistapart.com/"
    
     Scenario: Set Viewport and take screenshot
        Given I set viewport as "mobile"
        Then I go to url "https://alistapart.com/"
        Then I scroll to the bottom of the page
        Then I take a screenshot named "Google Homepage"