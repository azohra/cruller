@element @example
Feature: Element Step Definitions

    Example file containing the step definitions for elements on page

    Background: Search on google
        Given I go to url "Google Site"
        # Check form features
        Then I fill field "Google Search Input" with "MLK"
        # Check keyboard features
        Then I press enter
        # Check page features
        Then I wait for page navigation

    Scenario: Click Element
        # Scroll to pagination
        Then I scroll to the bottom of the page
        Then I click on "Search Page 2"
        # Check page features
        Then I wait for page navigation

    Scenario: Hover Element
        Then I hover on "Search Settings Button"
        # Check util features
        Then I wait for 2 seconds

    Scenario: Focus Element
        Then I focus on "Search Page Logo"
        # Check util features
        Then I wait for 2 seconds

    Scenario: Check Element Text
    Then I should see "Search Settings Button" have text "Settings"

    Scenario: Click on iframe Element
        Then I click on "Google Apps"
        Then I click on 'Google Search App' inside iframe 'iframe'
        # Check page features
        Then I wait for page navigation
