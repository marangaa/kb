# 09 — Runtime

The runtime is the execution environment for organizational processes. It determines when and how work occurs.

## The OODA Loop Execution Model

The runtime enforces an Observe, Orient, Decide, Act (OODA) loop for all agent execution.

1. **Observe:** The agent reads the event log. It constructs a point-in-time view of its domain.
2. **Orient:** The agent applies institutional memory. It maps the current observation against historical context and System 5 policies. This is the critical phase. Data becomes intelligence here.
3. **Decide:** The agent selects a course of action. It generates a plan.
4. **Act:** The agent executes the plan. It writes new events to the log.

## Scheduling and Delegation

Execution is asynchronous. There is no global clock. Agents react to events.

When a task exceeds an agent's capability or scope, it delegates. Delegation is a structured request written to the log. The System 2 coordination layer routes the request to the appropriate agent.

Tasks are scheduled based on resource availability and System 3 priorities. Preemption is supported.

## Planning

Plans are directed acyclic graphs (DAGs) of discrete actions. They are deterministic. 

An agent generates a plan during the Decide phase. The plan is recorded in the event log before execution begins. If execution fails, the runtime uses the recorded plan to calculate the blast radius and trigger compensation logic.

## Interrupts

The runtime supports immediate suspension of execution via interrupts. 

Interrupts are high-priority events. When an interrupt occurs, the target agent halts its current OODA loop. It saves its local state. It processes the interrupt. It resumes or aborts the suspended execution based on the interrupt's resolution.

## Algedonic Feedback Channels

Standard feedback moves sequentially through the VSM hierarchy. This is too slow for critical failures.

The runtime implements algedonic (pain/pleasure) channels. These are non-hierarchical, low-latency signaling paths. They bypass System 2, 3, and 4. 

If a System 1 agent encounters a catastrophic error, it sends an algedonic signal directly to System 5. System 5 issues a global interrupt. Operations halt until the policy layer resolves the anomaly.
