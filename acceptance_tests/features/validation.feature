@validation
Feature: Validation

Scenario: Wrong details in Enter Your Details

  Given I start on the "Enter Your Details" page of the "Find your application" app
  When I enter "" into "Evw Number"
  And I enter the date "!!-10-1978" into "dob"
  And I continue
  Then the validation summary should contain
    """
    Please use the correct date format, for example, 22 3 1979
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
    Please use the correct date format, for example, 22 3 1979
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
  And I enter a date "2 months" in the future into "Arrival date"
  And I continue
  # Is this your flight page
  And I click "Yes"
  And I continue
  # Departure date and time page with no date and time entered
  And I continue
  Then the validation summary should contain
    """
    Enter the date you will depart for the UK
    Enter a valid time using the 24 hour clock, for example 09:45 or 21:45
    """
  # Departure date and time page with invalid date and time entered
  And I enter the date "99-08-2016" into "Departure date"
  And I enter the time "35:00" into "Departure time"
  And I continue
  Then the validation summary should contain
    """
    Enter a valid date
    Enter a valid time using the 24 hour clock, for example 09:45 or 21:45
    """

Scenario: UK departure page validation

  Given I start the Update journey details app
  # How will you arrive page
  When I click "By plane"
  And I continue
  And I enter "KU101" into "Flight number"
  And I continue
  # Arrival date page
  And I enter a date "2 months" in the future into "Arrival date"
  And I continue
  # Is this your flight page
  And I click "Yes"
  And I continue
  # Departure date and time
  And I enter a date "2 months" in the future into "Departure date"
  And I enter the time "07:15" into "Departure time"
  And I continue
  # Return travel
  And I select "Yes" for "Travel details changed"
  And I continue
  # UK departure
  And I continue
  Then the validation summary should contain
  """
  Select one option
  Select one option
  """
  When I select "No" for "Know departure details"
  And I continue
  Then the validation summary should contain
  """
  Select your length of stay in the UK
  """
  When I select "Yes" for "Know departure details"
  And I continue
  Then the validation summary should contain
  """
  Enter the flight number, train number or boat name that you will be leaving the UK on
  Enter the date you are leaving the UK
  Select one of the airports, sea ports or rail terminals from the list
  """
