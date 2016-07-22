@page_not_found
Feature: Page not found

Scenario: Page not found start link should go to find your application

  Given I start the "Page not found" app
  And the page title should contain "The page or item you were looking for has not been found"
  When I click start again
  Then the page title should contain "Enter your details"
