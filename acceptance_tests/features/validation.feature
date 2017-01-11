@validation
Feature: Validation

Scenario: Wrong details in Enter Your Details

  Given I start on the "Enter Your Details" page of the "Find your application" app
  When I enter "" into "Evw Number"
  And I enter the date "!!-10-1978" into "dob"
  And I continue
  Then the validation summary should contain
    """
    Enter a valid date, for example, 22 3 1979
    Enter your electronic visa waiver number
    """

Scenario: Entering an EVW number that is not found

  Given I start the "Find your application" app
  When I enter "1000INVALID" into "EVW number"
  And I enter the date "20-10-1978" into "dob"
  And I click confirm details
  Then the validation summary should contain
    """
    We can't find your electronic visa waiver number
    """

Scenario: Entering a dob that is non-numeric

  Given I start the "Find your application" app
  When I enter "VALID1000" into "EVW number"
  And I enter the date "20-!!-1978" into "dob"
  And I click confirm details
  Then the validation summary should contain
    """
    Enter a valid date, for example, 22 3 1979
    """

Scenario: Entering an EVW number that cannot be updated

  Given I start the "Find your application" app
  When I enter "TOOLATEM8" into "EVW number"
  And I enter the date "20-10-1978" into "dob"
  And I click confirm details
  # EVW expired page
  Then I should be on the "EVW expired" page of the "Find your application" app
  And the page title should contain "Electronic visa waiver expired"

Scenario: Not entering any details on the departure date page

  Given I start the Update journey details app
  # How will you arrive page
  When I click "By plane"
  And I continue
  And I enter "KU101" into "Flight number"
  And I continue
  # Departure date page with no date and time entered
  And I continue
  Then the validation summary should contain
    """
    Enter a valid date
    """
  # Departure date and time page with invalid date and time entered
  And I enter the date "99-08-2016" into "Departure date"
  And I continue
  Then the validation summary should contain
    """
    Enter a valid date
    """
