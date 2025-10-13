I have thought about the fields for exercise, and  I would structure it in the following way- >

## 1 : Broad market exploration (exercise 1)

fields:

- General market trend (market_trend) [text] select from options growing, growing rapidly, stagnant etc
- Top Pain point of customers in this market (top_pain_point) [text] input
- Competitor Overview (competitors) [json] mixed fields capture basic competitor details
- Barriers to Entry (barriers_to_entry) string[] checkbox select from given list

## 2: Deep Dive into customer research

from broad research we are narrowing down to target customer research

fields:

- Demography (target_demographics )[json]
- Psychography (target_psychograhics)[json]
- Buying behaviour (target_buying_behaviour) [json]
- Unmet Need (target_unmet_needs)
- Motivations (target_motivation)

## 3 Sizing the Opportunity

Getting the sense of market size

fields:

- Market Size (market_size)[json] text {TAM,SAM, SOM}
- Rational for Size(market_size_rational) text textbox

## Personal Fit

fields:

- Self Assessment of skill fitness (skill_assessment_score) -> number(1-5) dropdown with options
- Self Assessment of capital (capital_assessment_score) -> number(1-5) dropdown with options
- Self Assessment of resources (resource_assessment_score) -> number(1-5) dropdown with options
- Self Assessment of Alignment (alignment_assessment_score) -> number(1-5) dropdown with options
- Risk Assessment (risk_comfort_score)
- Assessment explanation (assessment_rationale) text textbox