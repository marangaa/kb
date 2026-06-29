# 04 — Memory

This document specifies the memory architecture. It defines how data from the event log is processed, categorized, and retrieved to form organizational memory.

## The Memory Pipeline

Memory is implemented as a multi-layered pipeline. It transforms raw signals into contextual intelligence. Information flows through five distinct stages.

### 1. Working Memory
Working memory holds recent context. It is highly volatile and scoped to active threads of execution.
- **Purpose:** Immediate decision routing and context buffering.
- **Input:** Real-time event streams.
- **Lifespan:** Milliseconds to hours.
- **Mechanism:** In-memory stores holding active context for currently executing tasks.

### 2. Episodic Memory
Episodic memory is the canonical, immutable log of everything that has happened.
- **Purpose:** Audit, time travel, and source of truth.
- **Input:** Processed and normalized events from Working Memory.
- **Lifespan:** Permanent.
- **Mechanism:** Append-only event store.

### 3. Semantic Memory
Semantic memory represents the factual, relational state of the organization. It is the materialized projection of Episodic Memory into the entity ontology.
- **Purpose:** Answering structural queries.
- **Input:** Projections from the Episodic Memory log.
- **Lifespan:** Continuously updated; historical states are accessible via time travel.
- **Mechanism:** Graph database mapping the transactive memory system. (Aligns with Walsh & Ungson's *Individuals* and *Structure* bins).

### 4. Procedural Memory
Procedural memory captures how the organization executes tasks.
- **Purpose:** Standardizing workflows and capabilities.
- **Input:** Inferred from repeated behavioral patterns in the event log; explicit documentation.
- **Lifespan:** Versioned and iteratively refined.
- **Mechanism:** Standard operating procedures, automated workflows, and runbooks. (Aligns with Walsh & Ungson's *Transformations* bin).

### 5. Institutional Memory
Institutional memory captures the "why". It records intent, vetoed options, and the context surrounding decisions.
- **Purpose:** Preventing knowledge loss and avoiding repeated mistakes.
- **Input:** Extracted from meeting transcripts, design documents, and decision records.
- **Lifespan:** Permanent, subject to relevance decay.
- **Mechanism:** Vector stores and linked decision graphs mapped against Semantic Memory. (Aligns with Walsh & Ungson's *Culture* and *External Archives* bins).

## Transactive Memory Integration

Following Walsh & Ungson (1991), the system implements a Transactive Memory System. The system does not mandate that all knowledge be explicitly codified. 

Instead, the pipeline observes behavioral patterns to map "who knows what". It infers tacit knowledge by tracking event origination and review patterns. This secures the organizational index of expertise continuously.
