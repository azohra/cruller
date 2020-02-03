@keyboard @example
Feature: Element Step Definitions

    Example file containing the step definitions for keyboard actions

    Background: Search on google
        Given I go to url "Google Site"
    
    Scenario: Press individual keyboard buttons
        # Check element feature
        Given I focus on "Google Search Input"
        Then I press "M" on keyboard
        Then I press "L" on keyboard
        Then I press "K" on keyboard
        Then I press "Enter" on keyboard
        # Check util feature
        Then I wait for page navigation
    
    Scenario: Tab, Enter & Type Helper
        # Check element feature
        Given I focus on "Google Search Input"
        Then I type "MLK"
        Then I press tab
        Then I press tab
        Then I press enter
        # Check util feature
        Then I wait for page navigation
    