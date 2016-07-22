@update_journey_details
Feature: Updating Journey Details

Scenario: Invalid token

  Given I start the Update journey details app with an invalid token
  Then the page body should contain "The page or item you were looking for has not been found"

Scenario: Entering new flight details and correct flight found

  Given I start the Update journey details app
  Then the page title should contain "Your new journey to the UK"
  When I click "By plane"
  And I continue
  Then I should be on the "Flight number" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  Then I enter "KU101" into "Flight number"
  And I continue
  # Arrival date page
  Then I should be on the "Arrival date" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  And I enter the date "10-08-2016" into "Arrival date"
  And I continue
  # Is this your flight page
  Then I should be on the "Is this your flight" page of the "Update journey details" app
  And the page title should contain "Is this your flight to the UK?"
  And the "Flight number" should contain "KU101"
  And the "Departure airport" should contain "Dubai"
  And the "Arrival airport" should contain "London - Gatwick"
  And the "Arrival date" should contain "10-08-2016"
  And the "Arrival time" should contain "19:45"
  And I click "Yes"
  And I continue
  # Departure date and time page
  Then I should be on the "Departure date and time" page of the "Update journey details" app
  And the page title should contain "Your journey to the UK"
  And I enter the date "09-08-2016" into "Departure date"
  And I enter the time "23:15" into "Departure time"
  And I continue
  # Check your answers page
  Then the page title should contain "Check your answers"
  And the summary table should contain
    """
    Departure airport
                      Dubai
    Departure date
                      09-08-2016
    Departure time
                      23:15
    Flight number
                      KU101
    Arrival airport
                      London - Gatwick
    Arrival date
                      10-08-2016
    Arrival time
                      19:45
    """
  And I continue
  # Declaration page
  Then I should be on the "Declaration" page of the "Update journey details" app
  And the page title should contain "Declaration"
  And the content list should contain
    """
    The new flight information I have entered is correct to the best of my knowledge and belief and is for my flight that lands in the UK.
    On changing my flight details my old electronic visa waiver document will be invalid and I will not use it to try to enter the UK; if I do so I may be denied boarding or be refused entry at the UK border.
    If I have completed this for someone else I have their full agreement.
    """
  When I click id "Accept Declaration"
  And I continue
  Then I should be on the "Confirmation" page of the "Update journey details" app
  And the page title should contain "Electronic visa wavier"
  And the "header notice complete" should contain "Request received"
  And the reference number should be present

Scenario: Entering new flight details and flight not found

  Given I start the Update journey details app
  Then the page title should contain "Your new journey to the UK"
  When I click "By plane"
  And I continue
  Then I should be on the "Flight number" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  Then I enter "NO0001" into "Flight number"
  And I continue
  # Arrival date page
  Then I should be on the "Arrival date" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  And I enter the date "08-08-2016" into "Arrival date"
  And I continue
  # Flight not found page
  Then I should be on the "Flight not found" page of the "Update journey details" app
  And the page title should contain "We can’t find your flight"
  And I retry
  Then I should be on the "Flight number" page of the "Update journey details" app

Scenario: Entering new flight details and incorrect flight found

  Given I start the Update journey details app
  Then the page title should contain "Your new journey to the UK"
  When I click "By plane"
  And I continue
  Then I should be on the "Flight number" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  Then I enter "KU101" into "Flight number"
  And I continue
  # Arrival date page
  Then I should be on the "Arrival date" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  And I enter the date "09-08-2016" into "Arrival date"
  And I continue
  # Is this your flight page
  # Flight details on this page have been tested in the last test so we only need to test the flow here
  Then I should be on the "Is this your flight" page of the "Update journey details" app
  And the page title should contain "Is this your flight to the UK?"
  And I click "No"
  And I continue
  # Flight not found page
  Then I should be on the "Flight not found" page of the "Update journey details" app
  And the page title should contain "We can’t find your flight"
  And I retry
  Then I should be on the "Flight number" page of the "Update journey details" app

Scenario: Choosing Train
  Given I start the Update journey details app
  When I click "By train"
  And I continue
  Then I should be on the "Email us" page of the "Update journey details" app
  And the content list should contain
    """
    your electronic visa waiver number
    new train number, eg Eurostar 9140
    new train station you depart for the UK from
    new date of departure for the UK
    new time of departure for the UK
    new UK arrival train station
    new date of arrival in the UK
    new time of arrival in the UK
    """

Scenario: Choosing Private Plane

  Given I start the Update journey details app
  When I click "By private plane"
  And I continue
  Then I should be on the "Email us" page of the "Update journey details" app
  And the content list should contain
    """
    your electronic visa waiver number
    tail number of the plane you’ll be taking
    airport this flight takes off from
    new date your flight takes off
    new time your flight takes off
    new date of arrival in the UK
    new time of arrival in the UK
    UK arrival airport
    """

Scenario: Choosing Boat

  Given I start the Update journey details app
  When I click "By boat"
  And I continue
  Then I should be on the "Email us" page of the "Update journey details" app
  And the content list should contain
    """
    your electronic visa waiver number
    new boat name, eg ‘Spirit of Britain’
    new port of departure for the UK, eg Calais
    new date of departure for the UK
    new time of departure for the UK
    new port of arrival in the UK, eg Dover
    new date of arrival in the UK
    new time of arrival in the UK
    """

Scenario: Choosing Land

  Given I start the Update journey details app
  When I click "By land"
  And I continue
  Then I should be on the "Email us" page of the "Update journey details" app
  And the content list should contain
    """
    date of arrival in Northern Ireland
    expected time of arrival at your destination in Northern Ireland
    method of road travel to Northern Ireland, eg bus or private car
    arrival point in Northern Ireland, for example, the town or bus station where your bus or car drops you off
    """
