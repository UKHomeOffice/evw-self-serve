@validation
Feature: Validation

Scenario: Wrong details in Enter Your Details

  Given I start on the "Enter Your Details" page
  And I enter "" into "Evw Number"
  And I enter the date "!!-10-1978" into "dob"
  And I continue
  Then the "validation summary" class should contain
    """
    Please enter numbers only
    Please enter your electronic visa wavier number
    """