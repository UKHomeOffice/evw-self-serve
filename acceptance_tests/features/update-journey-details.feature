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
  And I enter a date "2 months" in the future into "Arrival date"
  And I continue
  # Is this your flight page
  Then I should be on the "Is this your flight" page of the "Update journey details" app
  And the page title should contain "Is this your flight to the UK?"
  And the "Flight number" should contain "KU101"
  And the "Departure airport" should contain "Dubai"
  And the "Arrival airport" should contain "London - Gatwick"
  And the "Arrival date" should contain a date "2 months" in the future
  And the "Arrival time" should contain "18:45"
  And I click "Yes"
  And I continue
  # Departure date and time page
  Then I should be on the "Departure date and time" page of the "Update journey details" app
  And the page title should contain "Your journey to the UK"
  And the "Data flight number" should contain "KU101"
  And the "Data departure airport" should contain "Dubai"
  And I enter a date "2 months" in the future into "Departure date"
  And I enter the time "07:15" into "Departure time"
  And I continue
  # UK departure
  Then I should be on the "UK departure" page of the "Update journey details" app
  And the page title should contain "Do you have your travel details for your departure from the UK?"
  And I select "No" for "Know departure details"
  And I select "1 to 3 months" for "UK duration"
  And I select "No" for "UK visit more than once"
  And I continue
  # Check your answers page
  Then the page title should contain "Check your answers"
  And the "inbound-summary" table should contain
    """
    Departure country
                      United Arab Emirates
    Departure airport
                      Dubai
    Departure date
                      ${"2 months" in the "future"}
    Departure time
                      7:15
    Flight number
                      KU101
    Arrival airport
                      London - Gatwick
    Arrival date
                      ${"2 months" in the "future"}
    Arrival time
                      18:45
    Length of stay
                      1 to 3 months
    Further trips to UK planned within 3 months
                      No
    """
  And I continue
  # Declaration page
  Then I should be on the "Declaration" page of the "Update journey details" app
  And the page title should contain "Declaration"
  And the content list should contain
    """
    The new information I have entered is correct to the best of my knowledge and belief.
    On changing my flight details my old electronic visa waiver document will be invalid and I will not use it to try to enter the UK; if I do so I may be denied boarding or be refused entry at the UK border.
    If I have completed this for someone else I have their full agreement.
    """
  When I click id "Accept Declaration"
  And I continue
  Then I should be on the "Confirmation" page of the "Update journey details" app
  And the "header notice complete" should contain "Request received"
  And the reference number should be present

  Scenario: Entering new outbound flight details

    Given I start the Update journey details app
    When I click "By plane"
    And I continue
    Then I should be on the "Flight number" page of the "Update journey details" app
    And I enter "KU101" into "Flight number"
    And I continue
    # Arrival date page
    Then I should be on the "Arrival date" page of the "Update journey details" app
    And I enter a date "2 months" in the future into "Arrival date"
    And I continue
    # Is this your flight page
    Then I should be on the "Is this your flight" page of the "Update journey details" app
    And I click "Yes"
    And I continue
    # Departure date and time page
    Then I should be on the "Departure date and time" page of the "Update journey details" app
    And I enter a date "2 months" in the future into "Departure date"
    And I enter the time "07:15" into "Departure time"
    And I continue
    # UK departure
    Then I should be on the "UK departure" page of the "Update journey details" app
    And I select "Yes" for "Know departure details"
    And I enter "FL1001" into "UK departure travel number"
    And I enter a date "2 months" in the future into "UK date of departure"
    And I select "LGW" from dropdown list for "UK port of departure"
    And I select "Yes" for "UK visit more than once"
    And I continue
    # Check your answers page
    Then the page title should contain "Check your answers"
    And the "outbound-summary" table should contain
    """
    Departure airport
                      LGW
    Departure date
                      20/03/2017
    Flight number
                      FL1001
    """

Scenario: Multi-leg flight

  Given I start the Update journey details app
  When I click "By plane"
  And I continue
  When I enter "BA0072" into "Flight number"
  And I continue
  Then I enter a date "2 months" in the future into "Arrival date"
  And I continue

  # Multi-leg page
  And the page title should contain "Your journey to the UK"
  When I click exact id "departures-MCT"
  And I continue

  Then the page title should contain "Is this your flight to the UK?"
  And the "Flight number" should contain "BA0072"
  And the "Departure airport" should contain "Muscat - Seeb"
  And I click "Yes"
  And I continue

  # Departure date and time page
  Then I enter a date "2 months" in the future into "Departure date"
  And I enter the time "07:15" into "Departure time"
  And I continue

  # UK departure
  Then I should be on the "UK departure" page of the "Update journey details" app
  And the page title should contain "Do you have your travel details for your departure from the UK?"
  And I select "No" for "Know departure details"
  And I select "1 to 3 months" for "UK duration"
  And I select "No" for "UK visit more than once"
  And I continue

  # Check your answers page
  Then the page title should contain "Check your answers"
  And the "inbound-summary" table should contain
    """
    Departure country
                      Oman
    Departure airport
                      Muscat - Seeb
    Departure date
                      ${"2 months" in the "future"}
    """
  And I continue
  # Declaration page
  Then I should be on the "Declaration" page of the "Update journey details" app
  And I click id "Accept Declaration"
  And I continue
  Then the reference number should be present

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
  And I enter a date "2 months" in the future into "Arrival date"
  And I continue
  # Flight not found page
  Then I should be on the "Flight not found" page of the "Update journey details" app
  And the page title should contain "We can’t find your flight"
  And the content list should contain
    """
    reference number (EVW123)
    new flight number (if your journey has any stops or connecting flights we only need details of the flight landing in the UK)
    airport this flight takes off from
    new date this flight takes off
    new time this flight takes off
    UK arrival airport
    new date of arrival in the UK
    new time of arrival in the UK
    """
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
  And I enter a date "2 months" in the future into "Arrival date"
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
    reference number: EVW123 (this is in the email we sent you)
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
    reference number: EVW123 (this is in the email we sent you)
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
    reference number: EVW123 (this is in the email we sent you)
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
