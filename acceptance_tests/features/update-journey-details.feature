Feature: Updating Journey Details

# Scenario: Choosing Plane

#   Given I start on the "How will you arrive" page of the "Update journey details" app
#   When I click "By plane"
#   And I continue
#   Then I should be on the "Email us" page of the "Update journey details" app
#   And the need to know list should contain
#     """
#     your electronic visa waiver number
#     new flight number (if your journey has any stops or connecting flights we only need details of the flight landing in the UK)
#     airport this flight takes off from
#     new date this flight takes off
#     new time this flight takes off
#     UK arrival airport
#     new date of arrival in the UK
#     new time of arrival in the UK
#     """

# Scenario: Choosing Train
#   Given I start on the "How will you arrive" page of the "Update journey details" app
#   When I click "By train"
#   And I continue
#   Then I should be on the "Email us" page of the "Update journey details" app
#   And the need to know list should contain
#     """
#     your electronic visa waiver number
#     new train number, eg Eurostar 9140
#     new train station you depart for the UK from
#     new date of departure for the UK
#     new time of departure for the UK
#     new UK arrival train station
#     new date of arrival in the UK
#     new time of arrival in the UK
#     """

# Scenario: Choosing Private Plane

#   Given I start on the "How will you arrive" page of the "Update journey details" app
#   When I click "By private plane"
#   And I continue
#   Then I should be on the "Email us" page of the "Update journey details" app
#   And the need to know list should contain
#     """
#     your electronic visa waiver number
#     tail number of the plane you’ll be taking
#     airport this flight takes off from
#     new date your flight takes off
#     new time your flight takes off
#     new date of arrival in the UK
#     new time of arrival in the UK
#     UK arrival airport
#     """

# Scenario: Choosing Boat

#   Given I start on the "How will you arrive" page of the "Update journey details" app
#   When I click "By boat"
#   And I continue
#   Then I should be on the "Email us" page of the "Update journey details" app
#   And the need to know list should contain
#     """
#     your electronic visa waiver number
#     new boat name, eg ‘Spirit of Britain’
#     new port of departure for the UK, eg Calais
#     new date of departure for the UK
#     new time of departure for the UK
#     new port of arrival in the UK, eg Dover
#     new date of arrival in the UK
#     new time of arrival in the UK
#     """

# Scenario: Choosing Land

#   Given I start on the "How will you arrive" page of the "Update journey details" app
#   When I click "By land"
#   And I continue
#   Then I should be on the "Email us" page of the "Update journey details" app
#   And the need to know list should contain
#     """
#     date of arrival in Northern Ireland
#     expected time of arrival at your destination in Northern Ireland
#     method of road travel to Northern Ireland, eg bus or private car
#     arrival point in Northern Ireland, for example, the town or bus station where your bus or car drops you off
#     """

Scenario: Entering new flight details happy path

  Given I start on the "Flight number" page of the "Update journey details" app
  Then the page title should contain "Your new flight details"
  And I enter "EK009" into "Flight number"
  And I continue
  # Arrival date page
  Then I should be on the "Arrival date" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  And I enter the date "08-08-2016" into "Arrival date"
  And I continue
  # Is this your flight page
  Then I should be on the "Is this your flight" page of the "Update journey details" app
  And the page title should contain "Is this your flight to the UK?"
  And I click "Yes"
  And I continue
  # Departure date and time page
  Then I should be on the "Departure date and time" page of the "Update journey details" app
  And the page title should contain "Your journey to the UK"
  And I enter the date "07-08-2016" into "Departure date"
  And I enter the time "12:23" into "Departure time"
  And I continue
  # Check your amswers page
  Then the page title should contain "Check your answers"
  And the summary table should contain
    """
    EK009
    """

Scenario: Entering new flight details unhappy path

  Given I start on the "Flight number" page of the "Update journey details" app
  Then the page title should contain "Your new flight details"
  And I enter "EK009" into "Flight number"
  And I continue
  # Arrival date page
  Then I should be on the "Arrival date" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  And I enter the date "08-08-2016" into "Arrival date"
  And I continue
  # Is this your flight page
  Then I should be on the "Is this your flight" page of the "Update journey details" app
  And the page title should contain "Is this your flight to the UK?"
  And I click "No"
  And I continue
  # Flight not found page
  Then I should be on the "Flight not found" page of the "Update journey details" app
  And the page title should contain "We can’t find your flight"
  And I retry
  Then I should be on the "Flight number" page of the "Update journey details" app
