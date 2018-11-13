@update_journey_smoke
Feature: Updating Journey Details Smoke Test

Background: Adding a canned case
  Given I add a canned case

Scenario: Entering new flight details and correct flight found

  Given I start the Update journey details app with smoke params
  Then the page title should contain "Your electronic visa waiver"
  When I click exact id "update-to-uk"
  When I click exact id "update-from-uk"
  And I continue
  Then I should be on the "How will you arrive" page of the "Update journey details" app
  When I click "By plane"
  And I continue
  Then I should be on the "Flight number" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  Then I enter "EK0009" into "Flight number"
  And I continue
  # Arrival date page
  Then I should be on the "Arrival date" page of the "Update journey details" app
  And the page title should contain "Your new flight details"
  And I enter a date "2 months" in the future into "Arrival date"
  And I continue
  # Is this your flight page
  Then I should be on the "Is this your flight" page of the "Update journey details" app
  And the page title should contain "Is this your flight to the UK?"
  And the "Flight number" should contain "EK0009"
  And the "Departure airport" should contain "Dubai"
  And the "Arrival airport" should contain "London - Gatwick"
  # And the "Arrival date" should contain a date "2 months" in the future
  And the "Arrival time" should contain "19:45"
  And I click "Yes"
  And I continue
  # Departure date and time page
  Then I should be on the "Departure date and time" page of the "Update journey details" app
  And the page title should contain "Your journey to the UK"
  And I enter a date "2 months" in the future into "Departure date"
  And I enter the time "12:15" into "Departure time"
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
    Departure airport
                      Dubai
    Departure date

    Departure time
                      12:15
    Flight number
                      EK0009
    Arrival airport
                      London - Gatwick
    Arrival date

    Arrival time
                      19:45
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
  And the page title should contain "Electronic visa waiver"
  And the "header notice complete" should contain "Request received"
  And the reference number should be present
