@cookies @example
Feature: Cookies Step Definitions

    Example file containing the step definitions for cookies

    Background: Go to google.com
        Given I go to url "Google Site"

    Scenario: Set Cookie
        # Set string cookie
        Then I set cookie "string_cookie" as "test_cookie"
        # Set numeric cookie
        Then I set cookie "numeric_cookie" as 1

    Scenario: Get Cookie
        # Set string cookie
        Then I set cookie "string_cookie" as "test_cookie"
        # Set numeric cookie
        Then I set cookie "numeric_cookie" as 1
        # Check cookie value
        Then I check cookie "string_cookie" should have value "test_cookie"
        Then I check cookie "numeric_cookie" should have value 1

    Scenario: Delete Cookie
        # Set string cookie
        Then I set cookie "string_cookie" as "test_cookie"
        # Delete cookie
        Then I delete cookie "string_cookie"

    Scenario: Set Multiple Cookies
        # Set cookies
        Then I set following cookies:
            | name     | value   |
            | Cookie_1 | Value 1 |
            | Cookie_2 | Value 2 |
            | Cookie_3 | Value 3 |

    Scenario: Check Multiple Cookies
        # Set cookies
        Then I set following cookies:
            | name     | value   |
            | Cookie_1 | Value 1 |
            | Cookie_2 | Value 2 |
            | Cookie_3 | Value 3 |
        # Get cookies
        Then I check following cookies:
            | name     | value   |
            | Cookie_1 | Value 1 |
            | Cookie_2 | Value 2 |
            | Cookie_3 | Value 3 |

    Scenario: Delete Multiple Cookies
        # Set cookies
        Then I set following cookies:
            | name     | value   |
            | Cookie_1 | Value 1 |
            | Cookie_2 | Value 2 |
            | Cookie_3 | Value 3 |
        # Delete cookies
        Then I delete following cookies:
            | name     | value   |
            | Cookie_1 | Value 1 |
            | Cookie_2 | Value 2 |
            | Cookie_3 | Value 3 |