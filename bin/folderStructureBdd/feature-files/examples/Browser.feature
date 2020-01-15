@browser @example
Feature: Browser Step Definitions

   Example file containing the step definitions for the browser

   Scenario: Go to URL
      Given I go to url "Google Site"
      Then I close the browser

   Scenario: Open and close the browser
      Given I open a browser window
      Then I close the browser