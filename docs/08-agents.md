# 08 — Agents

Agents are roles. They do not emulate humans. They own specific projections of the organizational model.

The architecture of these roles follows the Viable System Model (VSM). This provides a strict functional decomposition for continuous, autonomous organizational execution.

## The Viable System Model Mapping

### System 1: Operations (The Work)
System 1 agents execute specialized tasks. They interact with external resources. They mutate state.
- **Roles:** Engineering, Research, Design.
- **Responsibilities:** Code generation, data analysis, artifact production.
- **State:** Local task context. Ephemeral.

### System 2: Coordination (The Protocol)
System 2 agents prevent conflict between System 1 agents. They are the message brokers.
- **Roles:** Program Management, CI/CD orchestration.
- **Responsibilities:** Dependency resolution, scheduling, lock management.
- **State:** In-flight queues. Resource contention graphs.

### System 3: Management (The Optimization)
System 3 agents optimize System 1 performance. They allocate resources based on operational telemetry.
- **Roles:** Product Management, Engineering Management.
- **Responsibilities:** Priority assignment, budget allocation, quality control.
- **State:** Tactical backlog. Performance metrics.

### System 4: Intelligence (The Environment)
System 4 agents observe the external environment. They construct the strategic model.
- **Roles:** Market Research, Threat Intelligence.
- **Responsibilities:** Environmental scanning, competitor analysis, risk assessment.
- **State:** External market graph. Long-term forecasting model.

### System 5: Policy (The Identity)
System 5 agents define the system's operational boundaries. They manage the normative layer.
- **Roles:** Executive, Compliance.
- **Responsibilities:** Constraint enforcement, goal setting, identity preservation.
- **State:** Core axioms. Risk tolerance thresholds.

## Agent Ownership

An agent owns its designated slice of the event log. It is the sole mutator of its projection. 

When a System 1 Engineering agent commits code, it writes an event. When a System 3 Product agent reprioritizes a feature, it writes an event. The agents communicate solely by appending events to the log and observing the projections of others.

Human operators do not interact directly with the internal state of an agent. They interface through the event log. They provide inputs as events. They observe outputs as events.
