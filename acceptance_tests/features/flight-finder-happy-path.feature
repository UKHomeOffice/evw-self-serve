Feature: Flight finder happy path

Scenario: Entering new flight details

  Given I start on the "Flight number" page
  Then the page title should contain "Your new flight details"
  When I enter "EK009" into "Flight number"
  And I continue
  # Arrival date page
  Then I should be on the "Arrival date" page
  And the page title should contain "Your new flight details"
  When I enter the date "08-08-2016" into "Arrival date"
  And I continue
  # Is this your flight page
  Then I should be on the "Is this your flight" page
  And the page title should contain "Is this your flight to the UK?"
  When I click "Yes"
  And I continue
  # Check your amswers page
  And the page title should contain "Check your answers"
  And the summary table should contain
    """
    EK009
    """
