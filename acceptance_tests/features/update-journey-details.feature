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

Scenario: Choosing Train

  Given I am on the "How will you arrive" page
  When I click "By train"
  And I continue
  Then I should be on the "Email us" page
  And the need to know list should contain
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

  Given I am on the "How will you arrive" page
  When I click "By private plane"
  And I continue
  Then I should be on the "Email us" page
  And the need to know list should contain
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

  Given I am on the "How will you arrive" page
  When I click "By boat"
  And I continue
  Then I should be on the "Email us" page
  And the need to know list should contain
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

  Given I am on the "How will you arrive" page
  When I click "By land"
  And I continue
  Then I should be on the "Email us" page
  And the need to know list should contain
    """
    date of arrival in Northern Ireland
    expected time of arrival at your destination in Northern Ireland
    method of road travel to Northern Ireland, eg bus or private car
    arrival point in Northern Ireland, for example, the town or bus station where your bus or car drops you off
    """

Scenario: Requesting a flight change link

  Given I am on the "Link sent" page
  Then the page title should contain "Flight change link sent"
  And the page content should contain "We have emailed you with a link for you to change your flight details."
