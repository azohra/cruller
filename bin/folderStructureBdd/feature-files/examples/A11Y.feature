@a11y @example
Feature: Accessibility Step Definitions

    Example file containing the step definitions for a11y

    Scenario: Check page accessibility
        Given I go to url "Google Site"
        # In the report you can download the accessibility report for the page
        Then I run accessibility check on the page

    Scenario: Check element accessibility
        Given I go to url "Google Site"
        # In the report you can download the accessibility report for the element
        Then I run accessibility check for "Google Search Input"