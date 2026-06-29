# 03 — Events and Observation

This document specifies the ingestion and state-mutation architecture for the organizational model.

## State Mutates Through Events

The organization is a process, not a static entity. Consequently, the canonical data store is an immutable event log. The system observes the world through discrete events and projects state from that log.

State snapshots are lossy. They record current configuration but discard the trajectory that produced it. Event sourcing preserves both the current state and the historical progression. This enables time travel, counterfactual reasoning, and decision provenance.

## Observation Mechanisms

Events enter the system continuously. There is no batch processing or polling loop. External systems push events to the ingestion layer.

1. **Communication Streams:** Slack channels, email threads, and meeting transcripts.
2. **Engineering Operations:** Git commits, pull requests, continuous integration pipelines.
3. **Business Operations:** Customer relationship management state changes, contract executions, human resources updates.

The ingestion layer normalizes external payloads into the internal event schema. Every event must include a timestamp, a source identifier, and the raw payload.

## No Polling

The system operates strictly on a push-based architecture.

Polling incurs latency and mandates an artificial execution cadence. When an event occurs in an external system, a webhook or streaming connector immediately pushes the payload to the event bus. Every event changes the model.

## Event Sourcing vs State Snapshots

The system strictly distinguishes between commands and events.
- **Commands** are requests to perform an action.
- **Events** are immutable facts that an action has occurred.

When an event is ingested:
1. It is appended to the immutable event log.
2. Event handlers process the payload.
3. Entity states are updated in the projection layer.
4. The system delegates subsequent analysis or coordination tasks to specialized runtimes based on the updated state.

This architecture guarantees that the organizational memory can be deterministically rebuilt from genesis by replaying the event log. All mutations to the ontology are auditable via the event that caused them.
