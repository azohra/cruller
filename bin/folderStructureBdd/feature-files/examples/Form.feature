@form @example
Feature: Form Step Definitions

    Example file containing the step definitions for forms on page

    Background: Go to google.com
        Given I go to url "Form Test"

    Scenario: Enter form data
        Then I fill field "Name" with "John Doe"
        # Empty field data
        Then I clear field "Name"
        Then I fill field "Name" with "Jane Doe"
        Then I fill field "Phone" with "+19000000001"
        Then I fill field "Email" with "john.joe@test.com"
         # Select a radio button
        Then I click on "Car Taxi"
        # Select a checkbox button
        Then I click on "Extra Wheelchair"
        Then I click on "Extra Stock Tip"
        # Select an option from field
        Then I select "office" from "Pickup"
        # Fill in text area
        Then I fill field "Special Instructions" with "This is a test message"

        