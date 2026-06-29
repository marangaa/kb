# 05 — Reasoning

The system does not expose a search interface. It exposes a reasoning engine. Search implies retrieving documents. The system answers questions. 

Execution follows a deterministic pipeline: Question -> Planner -> Runtimes -> Evidence -> Debate -> Conclusion -> Model Update.

## Execution Pipeline

### 1. Question
The system receives a query. The query initiates a new execution context.

### 2. Planner
A planning component decomposes the query into a directed acyclic graph of discrete hypotheses. Dependencies are explicitly modeled.

### 3. Delegation to Runtimes
The system delegates the evaluation of hypotheses to specialized runtimes. Runtimes are isolated execution environments. They execute concurrently across independent nodes of the dependency graph.

### 4. Evidence
Runtimes interact with the event log and the organizational model to gather evidence. Evidence is immutable. It consists of historical events, state projections, and structural relationships. Runtimes do not guess; they reference specific log entries.

### 5. Debate
Runtimes evaluate evidence. If evidence conflicts, the system initiates a resolution phase. Runtimes submit formal arguments based on the weight of their collected data. A synthesis component evaluates these arguments to resolve contradictions. 

### 6. Conclusion
The system aggregates the resolved hypotheses into a final conclusion. The output includes the answer, the dependency graph, and pointers to the foundational evidence. 

### 7. Model Update
The execution trace is appended to the event log. The reasoning process becomes organizational memory. Future queries use this trace as evidence.
