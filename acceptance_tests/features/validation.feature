@validation
Feature: Validation

Scenario: Wrong details in Enter Your Details

  Given I start on the "Enter Your Details" page of the "Find your application" app
  When I enter "" into "Evw Number"
  And I enter the date "!!-10-1978" into "dob"
  And I continue
  Then the validation summary should contain
    """
    Please enter numbers only
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

Scenario: non-numeric dob

  Given I start the "Find your application" app
  When I enter "VALID1000" into "EVW number"
  And I enter the date "20-!!-1978" into "dob"
  And I click confirm details
  Then the validation summary should contain
    """
    Please enter numbers only
    """

Scenario: Entering an EVW number that cannot be updated

  Given I start the "Find your application" app
  When I enter "TOOLATEM8" into "EVW number"
  And I enter the date "20-10-1978" into "dob"
  And I click confirm details
  # EVW expired page
  Then I should be on the "EVW expired" page of the "Find your application" app
  And the page title should contain "Electronic visa waiver expired"

Scenario: Not entering any details on the departure date and time page

  Given I start the Update journey details app
  # How will you arrive page
  When I click "By plane"
  And I continue
  And I enter "KU101" into "Flight number"
  And I continue
  # Arrival date page
  And I enter the date "10-08-2016" into "Arrival date"
  And I continue
  # Is this your flight page
  And I click "Yes"
  And I continue
  # Departure date and time page
  And I continue
  Then the validation summary should contain
    """
    Enter the date you will depart for the UK
    Please enter a time
    """
