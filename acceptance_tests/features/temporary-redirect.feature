Feature: Temporary redirect from old first step URL to new one

Scenario: Following an old link
	Given I start the Update journey details app using the old URL
	Then I should be redirected to the first step, with the query string intact