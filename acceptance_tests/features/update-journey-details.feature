@update_journey_details
Feature: Updating Journey Details

Scenario: Invalid token

  Given I start the Update journey details app with an invalid token
  Then the page body should contain "The page or item you were looking for has not been found"

Scenario: Redirecting from start URL to first step

  Given I start the Update journey details app
  Then I should be redirected to the first step, with the query string intact

Scenario: Entering new inbound flight details (correct flight found) only

  Given I start the Update journey details app
  Then the page title should contain "Your electronic visa waiver"
  When I click exact id "update-to-uk"
  And I continue
  Then I should be on the "How will you arrive" page of the "Update journey details" app
  When I click "By plane"
  And I continue
  Then I should be on the "Flight number" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  Then I enter "KU101" into "Flight number"
  And I continue
  # Departure date page
  Then I should be on the "Departure date" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  And I enter a date "2 months" in the future into "Departure date"
  And I continue
  # Is this your flight page
  Then I should be on the "Is this your flight" page of the "Update journey details" app
  And the page title should contain "Is this your flight to the UK?"
  And the "Flight number" should contain "KU101"
  And the "Departure airport" should contain "Dubai"
  And the "Departure date" should contain a date "2 months" in the future
  And the "Departure time" should contain "14:35"
  And the "Arrival airport" should contain "London Gatwick Airport"
  And the "Arrival date" should contain a date "2 months" in the future
  And the "Arrival time" should contain "18:25"
  And I click "Yes"
  And I continue
  # Check your answers page
  Then the page title should contain "Check your answers"
  And the "inbound-summary" table should contain
    """
    Departure country
                      United Arab Emirates
    Departure airport
                      Dubai Airport
    Departure date
                      ${"2 months" in the "future"}
    Departure time
                      14:35
    Flight number
                      KU101
    Arrival airport
                      London Gatwick Airport
    Arrival date
                      ${"2 months" in the "future"}
    Arrival time
                      18:25
    """
  And I continue
  # Declaration page
  Then I should be on the "Declaration" page of the "Update journey details" app
  And the page title should contain "Declaration"
  And the new EVW warning should be present
  When I click id "Accept Declaration"
  And I continue
  Then I should be on the "Confirmation" page of the "Update journey details" app
  And the "header notice complete" should contain "Request received"
  And the reference number should be present
  And the user is told they will receive a new EVW

Scenario: Entering new outbound flight details only

  Given I start the Update journey details app
  When I click exact id "update-from-uk"
  And I continue
  # UK departure
  Then I should be on the "UK departure" page of the "Update journey details" app
  And I select "Yes" for "Know departure details"
  And I enter "FL1001" into "UK departure travel number"
  And I enter a date "3 months" in the future into "UK date of departure"
  And I enter "London Gatwick Airport" into "UK port of departure"
  And I continue
  # Check your answers page
  Then the page title should contain "Check your answers"
  And the "outbound-summary" table should contain
  """
  Departure airport
                    London Gatwick Airport
  Departure date
                    ${"3 months" in the "future"}
  Flight number
                    FL1001
  """
  And I continue
  # Declaration page
  Then I should be on the "Declaration" page of the "Update journey details" app
  And the page title should contain "Declaration"
  And the new EVW warning should not be present
  When I click id "Accept Declaration"
  And I continue
  Then I should be on the "Confirmation" page of the "Update journey details" app
  And the "header notice complete" should contain "Request received"
  And the reference number should be present
  And the user is told their EVW details will be changed

Scenario: Entering new trip duration only

  Given I start the Update journey details app
  Then the page title should contain "Your electronic visa waiver"
  And I click exact id "update-from-uk"
  And I continue
  Then I should be on the "UK departure" page of the "Update journey details" app
  And the page title should contain "Do you have your travel details for your departure from the UK?"
  And I select "No" for "Know departure details"
  And I select "1 to 3 months" for "UK duration"
  And I continue
  # Check your answers page
  Then the page title should contain "Check your answers"
  And the "outbound-summary" table should contain
    """
    Length of stay
                      1 to 3 months
    """
  And I continue
  # Declaration page
  Then I should be on the "Declaration" page of the "Update journey details" app
  And the page title should contain "Declaration"
  And the new EVW warning should not be present
  When I click id "Accept Declaration"
  And I continue
  Then I should be on the "Confirmation" page of the "Update journey details" app
  And the "header notice complete" should contain "Request received"
  And the reference number should be present
  And the user is told their EVW details will be changed

Scenario: Entering new accommodation details only
  Given I start the Update journey details app
  Then the page title should contain "Your electronic visa waiver"
  And I click exact id "update-accommodation"
  And I continue
  # Your stay page
  Then I should be on the "Visit information" page of the "Update journey details" app
  Then I enter "123 Lane Street" into "UK address 1"
  And I enter "Avenue Road" into "UK address 2"
  And I enter "Bromley" into "UK address 3"
  And I enter "West Surrey" into "UK address 4"
  And I enter "CR1 9ZQ" into "UK postcode"
  And I continue
  # Check your answers page
  Then the page title should contain "Check your answers"
  And the "accommodation-summary" table should contain
    """
    123 Lane Street,
    Avenue Road,
    Bromley,
    West Surrey,
    CR1 9ZQ
    """
  And I continue
  # Declaration page
  Then I should be on the "Declaration" page of the "Update journey details" app
  And the page title should contain "Declaration"
  And the new EVW warning should not be present
  When I click id "Accept Declaration"
  And I continue
  Then I should be on the "Confirmation" page of the "Update journey details" app
  And the "header notice complete" should contain "Request received"
  And the reference number should be present
  And the user is told their EVW details will be changed

Scenario: Entering new inbound flight details (correct flight found) and outbound flight details

  Given I start the Update journey details app
  Then the page title should contain "Your electronic visa waiver"
  When I click exact id "update-to-uk"
  And I click exact id "update-from-uk"
  And I continue
  Then I should be on the "How will you arrive" page of the "Update journey details" app
  When I click "By plane"
  And I continue
  Then I should be on the "Flight number" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  Then I enter "KU101" into "Flight number"
  And I continue
  # Departure date page
  Then I should be on the "Departure date" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  And I enter a date "2 months" in the future into "Departure date"
  And I continue
  # Is this your flight page
  Then I should be on the "Is this your flight" page of the "Update journey details" app
  And the page title should contain "Is this your flight to the UK?"
  And the "Flight number" should contain "KU101"
  And the "Departure airport" should contain "Dubai"
  And the "Departure date" should contain a date "2 months" in the future
  And the "Departure time" should contain "14:35"
  And the "Arrival airport" should contain "London Gatwick Airport"
  And the "Arrival date" should contain a date "2 months" in the future
  And the "Arrival time" should contain "18:25"
  And I click "Yes"
  And I continue
  # UK departure
  Then I should be on the "UK departure" page of the "Update journey details" app
  And the page title should contain "Do you have your travel details for your departure from the UK?"
  And I select "Yes" for "Know departure details"
  And I enter "FL1001" into "UK departure travel number"
  And I enter a date "3 months" in the future into "UK date of departure"
  And I enter "London Gatwick Airport" into "UK port of departure"
  And I continue
  # Check your answers page
  Then the page title should contain "Check your answers"
  And the "inbound-summary" table should contain
    """
    Departure country
                      United Arab Emirates
    Departure airport
                      Dubai Airport
    Departure date
                      ${"2 months" in the "future"}
    Departure time
                      14:35
    Flight number
                      KU101
    Arrival airport
                      London Gatwick Airport
    Arrival date
                      ${"2 months" in the "future"}
    Arrival time
                      18:25
    """
  And the "outbound-summary" table should contain
  """
  Departure airport
                    London Gatwick Airport
  Departure date
                    ${"3 months" in the "future"}
  Flight number
                    FL1001
  """
  And I continue
  # Declaration page
  Then I should be on the "Declaration" page of the "Update journey details" app
  And the page title should contain "Declaration"
  And the new EVW warning should be present
  When I click id "Accept Declaration"
  And I continue
  Then I should be on the "Confirmation" page of the "Update journey details" app
  And the "header notice complete" should contain "Request received"
  And the reference number should be present
  And the user is told they will receive a new EVW

Scenario: Entering new inbound flight details (correct flight found) and trip duration

  Given I start the Update journey details app
  Then the page title should contain "Your electronic visa waiver"
  When I click exact id "update-to-uk"
  And I click exact id "update-from-uk"
  And I continue
  Then I should be on the "How will you arrive" page of the "Update journey details" app
  When I click "By plane"
  And I continue
  Then I should be on the "Flight number" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  Then I enter "KU101" into "Flight number"
  And I continue
  # Departure date page
  Then I should be on the "Departure date" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  And I enter a date "2 months" in the future into "Departure date"
  And I continue
  # Is this your flight page
  Then I should be on the "Is this your flight" page of the "Update journey details" app
  And the page title should contain "Is this your flight to the UK?"
  And the "Flight number" should contain "KU101"
  And the "Departure airport" should contain "Dubai"
  And the "Departure date" should contain a date "2 months" in the future
  And the "Departure time" should contain "14:35"
  And the "Arrival airport" should contain "London Gatwick Airport"
  And the "Arrival date" should contain a date "2 months" in the future
  And the "Arrival time" should contain "18:25"
  And I click "Yes"
  And I continue
  # UK departure
  Then I should be on the "UK departure" page of the "Update journey details" app
  And the page title should contain "Do you have your travel details for your departure from the UK?"
  And I select "No" for "Know departure details"
  And I select "1 to 3 months" for "UK duration"
  And I continue
  # Check your answers page
  Then the page title should contain "Check your answers"
  And the "inbound-summary" table should contain
    """
    Departure country
                      United Arab Emirates
    Departure airport
                      Dubai Airport
    Departure date
                      ${"2 months" in the "future"}
    Departure time
                      14:35
    Flight number
                      KU101
    Arrival airport
                      London Gatwick Airport
    Arrival date
                      ${"2 months" in the "future"}
    Arrival time
                      18:25
    """
  And the "outbound-summary" table should contain
    """
    Length of stay
                      1 to 3 months
    """
  And I continue
  # Declaration page
  Then I should be on the "Declaration" page of the "Update journey details" app
  And the page title should contain "Declaration"
  And the new EVW warning should be present
  When I click id "Accept Declaration"
  And I continue
  Then I should be on the "Confirmation" page of the "Update journey details" app
  And the "header notice complete" should contain "Request received"
  And the reference number should be present
  And the user is told they will receive a new EVW

Scenario: Entering new inbound flight details and flight not found

  Given I start the Update journey details app
  Then the page title should contain "Your electronic visa waiver"
  When I click exact id "update-to-uk"
  And I continue
  Then I should be on the "How will you arrive" page of the "Update journey details" app
  When I click "By plane"
  And I continue
  Then I should be on the "Flight number" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  Then I enter "NO001" into "Flight number"
  And I continue
  # Departure date page
  Then I should be on the "Departure date" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  And I enter a date "2 months" in the future into "Departure date"
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

Scenario: Entering new inbound flight details and incorrect flight found

  Given I start the Update journey details app
  Then the page title should contain "Your electronic visa waiver"
  When I click exact id "update-to-uk"
  And I continue
  Then I should be on the "How will you arrive" page of the "Update journey details" app
  When I click "By plane"
  And I continue
  Then I should be on the "Flight number" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  Then I enter "KU101" into "Flight number"
  And I continue
  # Departure date page
  Then I should be on the "Departure date" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  And I enter a date "2 months" in the future into "Departure date"
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

Scenario: Entering new inbound flight details (correct flight found) and address details
  Given I start the Update journey details app
  Then the page title should contain "Your electronic visa waiver"
  When I click exact id "update-to-uk"
  And I click exact id "update-accommodation"
  And I continue
  Then I should be on the "How will you arrive" page of the "Update journey details" app
  When I click "By plane"
  And I continue
  Then I should be on the "Flight number" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  Then I enter "KU101" into "Flight number"
  And I continue
  # Departure date page
  Then I should be on the "Departure date" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  And I enter a date "2 months" in the future into "Departure date"
  And I continue
  # Is this your flight page
  Then I should be on the "Is this your flight" page of the "Update journey details" app
  And the page title should contain "Is this your flight to the UK?"
  And the "Flight number" should contain "KU101"
  And the "Departure airport" should contain "Dubai"
  And the "Departure date" should contain a date "2 months" in the future
  And the "Departure time" should contain "14:35"
  And the "Arrival airport" should contain "London Gatwick Airport"
  And the "Arrival date" should contain a date "2 months" in the future
  And the "Arrival time" should contain "18:25"
  And I click "Yes"
  And I continue
  # Your stay page
  Then I should be on the "Visit information" page of the "Update journey details" app
  Then I enter "123 Lane Street" into "UK address 1"
  And I enter "Avenue Road" into "UK address 2"
  And I enter "Bromley" into "UK address 3"
  And I enter "West Surrey" into "UK address 4"
  And I enter "CR1 9ZQ" into "UK postcode"
  And I continue
  # Check your answers page
  Then the page title should contain "Check your answers"
  And the "inbound-summary" table should contain
    """
    Departure country
                      United Arab Emirates
    Departure airport
                      Dubai Airport
    Departure date
                      ${"2 months" in the "future"}
    Departure time
                      14:35
    Flight number
                      KU101
    Arrival airport
                      London Gatwick Airport
    Arrival date
                      ${"2 months" in the "future"}
    Arrival time
                      18:25
    """
  And the "accommodation-summary" table should contain
    """
    123 Lane Street,
    Avenue Road,
    Bromley,
    West Surrey,
    CR1 9ZQ
    """
  And I continue
  # Declaration page
  Then I should be on the "Declaration" page of the "Update journey details" app
  And the page title should contain "Declaration"
  And the new EVW warning should be present
  When I click id "Accept Declaration"
  And I continue
  Then I should be on the "Confirmation" page of the "Update journey details" app
  And the "header notice complete" should contain "Request received"
  And the reference number should be present
  And the user is told they will receive a new EVW

Scenario: Entering new outbound flight details and address details
  Given I start the Update journey details app
  When I click exact id "update-from-uk"
  When I click exact id "update-accommodation"
  And I continue
  # UK departure
  Then I should be on the "UK departure" page of the "Update journey details" app
  And I select "Yes" for "Know departure details"
  And I enter "FL1001" into "UK departure travel number"
  And I enter a date "3 months" in the future into "UK date of departure"
  And I enter "London Gatwick Airport" into "UK port of departure"
  And I continue
  # Your stay page
  Then I should be on the "Visit information" page of the "Update journey details" app
  Then I enter "123 Lane Street" into "UK address 1"
  And I enter "Avenue Road" into "UK address 2"
  And I enter "Bromley" into "UK address 3"
  And I enter "West Surrey" into "UK address 4"
  And I enter "CR1 9ZQ" into "UK postcode"
  And I continue
  # Check your answers page
  Then the page title should contain "Check your answers"
  And the "outbound-summary" table should contain
  """
  Departure airport
                    London Gatwick Airport
  Departure date
                    ${"3 months" in the "future"}
  Flight number
                    FL1001
  """
  And the "accommodation-summary" table should contain
    """
    123 Lane Street,
    Avenue Road,
    Bromley,
    West Surrey,
    CR1 9ZQ
    """
  And I continue
  # Declaration page
  Then I should be on the "Declaration" page of the "Update journey details" app
  And the page title should contain "Declaration"
  And the new EVW warning should not be present
  When I click id "Accept Declaration"
  And I continue
  Then I should be on the "Confirmation" page of the "Update journey details" app
  And the "header notice complete" should contain "Request received"
  And the reference number should be present
  And the user is told their EVW details will be changed

Scenario: Entering new trip duration and address details
  Given I start the Update journey details app
  Then the page title should contain "Your electronic visa waiver"
  And I click exact id "update-from-uk"
  And I click exact id "update-accommodation"
  And I continue
  Then I should be on the "UK departure" page of the "Update journey details" app
  And the page title should contain "Do you have your travel details for your departure from the UK?"
  And I select "No" for "Know departure details"
  And I select "1 to 3 months" for "UK duration"
  And I continue
  # Your stay page
  Then I should be on the "Visit information" page of the "Update journey details" app
  Then I enter "123 Lane Street" into "UK address 1"
  And I enter "Avenue Road" into "UK address 2"
  And I enter "Bromley" into "UK address 3"
  And I enter "West Surrey" into "UK address 4"
  And I enter "CR1 9ZQ" into "UK postcode"
  And I continue
  # Check your answers page
  Then the page title should contain "Check your answers"
  And the "outbound-summary" table should contain
    """
    Length of stay
                      1 to 3 months
    """
  And the "accommodation-summary" table should contain
    """
    123 Lane Street,
    Avenue Road,
    Bromley,
    West Surrey,
    CR1 9ZQ
    """
  And I continue
  # Declaration page
  Then I should be on the "Declaration" page of the "Update journey details" app
  And the page title should contain "Declaration"
  And the new EVW warning should not be present
  When I click id "Accept Declaration"
  And I continue
  Then I should be on the "Confirmation" page of the "Update journey details" app
  And the "header notice complete" should contain "Request received"
  And the reference number should be present
  And the user is told their EVW details will be changed

Scenario: Choosing Train

  Given I start the Update journey details app
  Then the page title should contain "Your electronic visa waiver"
  When I click exact id "update-to-uk"
  And I continue
  Then I should be on the "How will you arrive" page of the "Update journey details" app
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
  Then the page title should contain "Your electronic visa waiver"
  When I click exact id "update-to-uk"
  And I continue
  Then I should be on the "How will you arrive" page of the "Update journey details" app
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
  Then the page title should contain "Your electronic visa waiver"
  When I click exact id "update-to-uk"
  And I continue
  Then I should be on the "How will you arrive" page of the "Update journey details" app
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
  Then the page title should contain "Your electronic visa waiver"
  When I click exact id "update-to-uk"
  And I continue
  Then I should be on the "How will you arrive" page of the "Update journey details" app
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
