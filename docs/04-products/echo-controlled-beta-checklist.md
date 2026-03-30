# Echo Controlled Beta Checklist

## Purpose

This checklist defines the first controlled beta package for Echo after MVP shell readiness is close enough to test with a small group.

It is not the public launch checklist.

It is the first-risk containment checklist.

Related documents:

- [echo-beta-readiness-gates.md](/c:/dev/northstar_ecosystem/docs/04-products/echo-beta-readiness-gates.md)
- [echo-beta-week-01-plan.md](/c:/dev/northstar_ecosystem/docs/05-operations/echo-beta-week-01-plan.md)
- [echo-beta-operator-runbook.md](/c:/dev/northstar_ecosystem/docs/05-operations/echo-beta-operator-runbook.md)

## Beta Goal

Validate:

- first-session value
- creator upload usability
- save and follow behavior
- trust/report workflow
- admin operational response

## Beta Size Recommendation

- creators: `10 to 25`
- listeners: `25 to 75`
- territories: one or two initial territories only
- beta duration: `7 to 14 days`

## Before Opening Beta

### Product

- [x] feed loads reliably
- [x] minimal player exists
- [x] save works
- [x] follow works
- [x] report works
- [x] upload works
- [x] creator setup works
- [x] category browse works
- [x] creator workspace shows basic beta readiness feedback
- [x] creator workspace shows week-one creator pulse metrics
- [x] creator workspace shows accepted-versus-onboarded onboarding path
- [x] public track sharing surface exists

### Trust

- [x] report queue visible in admin
- [x] moderation actions visible in admin
- [x] report-to-moderation path tested
- [x] duplicate and spam rules documented for beta operators

### Data

- [x] seed catalog is present
- [x] at least one seeded creator exists
- [x] demo verification loop already passed once
- [x] analytics recent events reflect live actions

### Ops

- [x] founder or operator knows the review clock
- [x] daily review rhythm is scheduled
- [x] issue logging path is defined
- [x] rollback rule is defined
- [x] week-01 beta operating plan is defined
- [x] explicit beta entry gates are defined
- [x] creator intake checklist is defined

## Beta Operating Rhythm

### Daily

- review feed health
- review save and follow actions
- review upload success/failure
- review report queue
- review storage and event growth

### Every 48 Hours

- review first-session friction
- review creator complaints
- review empty-state problems
- review low-quality content patterns

### End Of Week

- review D1 retention
- review creator week-1 return
- review save rate
- review percent of tracks with meaningful plays

## Beta Success Signals

- listeners save tracks without prompting
- creators can upload without operator rescue
- at least some creators return to post again
- reports remain manageable
- admin reflects reality fast enough for operator trust

## Beta Failure Signals

- empty or weak first session
- upload confusion
- save/follow actions failing in practice
- reports not closing properly
- admin lagging behind real user actions
- too many unusable seeded or user-uploaded tracks

## Beta Exit Decision

At the end of the controlled beta, choose one:

- continue to wider launch
- hold and repair specific gaps
- narrow scope and rerun beta

## Required Artifacts After Beta

- retention summary
- creator summary
- trust summary
- cost summary
- list of blockers for broader launch
