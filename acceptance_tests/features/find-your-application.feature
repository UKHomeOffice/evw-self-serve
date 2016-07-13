@find_your_application
Feature: Finding an application

Scenario: Requesting a flight change link

  Given I start the "Find your application" app
  When I enter "EVW08001000" into "EVW number"
  And I enter the date "20-10-1978" into "dob"
  And I click confirm details
  # Link sent page
  Then I should be on the "Link sent" page of the "Find your application" app
  Then the page title should contain "Check your email"
  And the page content should contain "We have emailed you with a link for you to change your flight details."
