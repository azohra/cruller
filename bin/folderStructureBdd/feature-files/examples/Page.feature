@page @example
Feature: Page Step Definitions

    Example file containing the step definitions for the page

    Scenario: Go to URL
        Given I go to url "Google Site"

    Scenario: Refresh page
        Given I go to url "Google Site"
        Then I refresh the page

    Scenario: Wait for page navigation and scroll to bottom
        Given I go to url "Google Site"
        # Check form features
        Then I fill field "Google Search Input" with "MLK"
        # Check keyboard features
        Then I press enter
        Then I wait for page navigation
        Then I scroll to the bottom of the page
    
    Scenario: Check page title
        Given I go to url "Google Site"
        Then I should see page title as "Google"
