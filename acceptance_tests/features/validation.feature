@validation
Feature: Validation

Scenario: Wrong details in Enter Your Details

  Given I start on the "Enter Your Details" page of the "Find your application" app
  When I enter "" into "Evw Number"
  And I enter the date "!!-10-1978" into "dob"
  And I continue
  Then the validation summary should contain
    """
    Enter a valid date, for example 22 3 1979
    Please enter your electronic visa waiver number
    """

Scenario: Entering an EVW number that is not found

  Given I start the "Find your application" app
  When I enter "1000INVALID" into "EVW number"
  And I enter the date "20-10-1978" into "dob"
  And I click confirm details
  Then the validation summary should contain
    """
    We can't find your EVW
    """

Scenario: Entering a dob with all zeros

  Given I start the "Find your application" app
  When I enter "VALID1000" into "EVW number"
  And I enter the date "00-00-0000" into "dob"
  And I click confirm details
  Then the validation summary should contain
    """
    Enter a valid date, for example 22 3 1979
    """
Scenario: non-numeric dob

  Given I start the "Find your application" app
  When I enter "VALID1000" into "EVW number"
  And I enter the date "20-!!-1978" into "dob"
  And I click confirm details
  Then the validation summary should contain
    """
    Enter a valid date, for example 22 3 1979
    """

Scenario: Entering an EVW number that cannot be updated

  Given I start the "Find your application" app
  When I enter "TOOLATEM8" into "EVW number"
  And I enter the date "20-10-1978" into "dob"
  And I click confirm details
  # EVW expired page
  Then I should be on the "EVW expired" page of the "Find your application" app
  And the page title should contain "Electronic visa waiver expired"
