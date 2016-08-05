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
  And the page content should contain "We have sent a link for you to change your flight details to"

Scenario: Application not yet verified
  Given I start the "Find your application" app
  When I enter "NOTVERIFIED" into "EVW number"
  And I enter the date "20-10-1978" into "dob"
  And I click confirm details
  Then I should be on the "EVW not verified" page of the "Find your application" app

Scenario: Too late to change
  Given I start the "Find your application" app
  When I enter "TOOLATEM8" into "EVW number"
  And I enter the date "20-10-1978" into "dob"
  And I click confirm details
  Then I should be on the "EVW expired" page of the "Find your application" app

Scenario: Case not found
  Given I start the "Find your application" app
  When I enter "NOFOUND" into "EVW number"
  And I enter the date "20-10-1978" into "dob"
  And I click confirm details
  Then the validation summary should contain
    """
    We can't find your electronic visa waiver number
    """
