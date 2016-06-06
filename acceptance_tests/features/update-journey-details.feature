Feature: Updating Journey Details

Scenario: Choosing Plane

  Given I am on the "How will you arrive" page
  When I click "By plane"
  And I continue
  Then I should be on the "Email us" page
  And the need to know list should contain
    """
    your electronic visa waiver number
    new flight number (if your journey has any stops or connecting flights we only need details of the flight landing in the UK)
    airport this flight takes off from
    new date this flight takes off
    new time this flight takes off
    UK arrival airport
    new date of arrival in the UK
    new time of arrival in the UK
    """