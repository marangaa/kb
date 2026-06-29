# 02 — The Company Model

This document defines the core ontology of the system. The organization is modeled as a structured, queryable graph of entities and the relationships between them.

## The Ontology

The model consists of eleven fundamental entities. Every piece of organizational context maps to one or more of these entities.

### 1. People
Individuals operating within or interacting with the organization.
- **Attributes:** Identifiers, roles, active status.
- **Relationships:** Belong to Teams, possess Skills, involved in Events, responsible for Decisions.

### 2. Teams
Bounded groups of People organized around specific functional boundaries.
- **Attributes:** Mandate, lifecycle state.
- **Relationships:** Composed of People, own Projects, pursue Goals.

### 3. Projects
Time-bound initiatives designed to achieve specific outcomes.
- **Attributes:** Scope, status, milestones.
- **Relationships:** Owned by Teams, serve Goals, generate Events.

### 4. Customers
External entities exchanging value with the organization.
- **Attributes:** Lifecycle stage, scale, identifiers.
- **Relationships:** Interact via Events, drive Projects, validate Beliefs.

### 5. Goals
Quantifiable or strictly defined targets guiding organizational focus.
- **Attributes:** Metrics, timeframes, status.
- **Relationships:** Pursued by Teams, justified by Beliefs, dictate Decisions.

### 6. Decisions
Irreversible or highly constrained choices made by the organization.
- **Attributes:** Context, options considered, vetoed alternatives, selected outcome.
- **Relationships:** Made by People, affect Projects, alter Systems, constrained by Beliefs.

### 7. Systems
Technical or operational constructs maintained by the organization.
- **Attributes:** Architecture, dependencies, health state.
- **Relationships:** Maintained by Teams, automate Procedural Memory, generate Events.

### 8. Skills
Capabilities required or possessed by the organization.
- **Attributes:** Competency levels, domain context.
- **Relationships:** Held by People, required by Projects, developed through Events.

### 9. Beliefs
The normative assumptions and working theories that drive organizational behavior.
- **Attributes:** Assertion, confidence level, origin.
- **Relationships:** Inform Decisions, shape Goals, validated or invalidated by Events.

### 10. Relationships
The edges connecting nodes within the ontology.
- **Attributes:** Weight, origin timestamp, decay rate.
- **Relationships:** Connect any two entities. Represent the transactive memory system ("who knows what", "what depends on what").

### 11. Events
Discrete, immutable occurrences at a specific point in time.
- **Attributes:** Timestamp, payload, source schema.
- **Relationships:** Emitted by People, Systems, or Customers. Mutate entity states.
