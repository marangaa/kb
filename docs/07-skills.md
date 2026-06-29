# 07 — Skills

Organizations accumulate capabilities. Launching a product, executing a hiring loop, and migrating a database are operational capabilities. The system models these capabilities as "Skills."

A skill is a persistent computational structure. It represents the organization's demonstrated ability to execute a specific class of work.

## Skill Composition

A skill is synthesized from four primitives:

1. **People**
   The graph of individuals who possess tacit knowledge of the execution. The system identifies these operators by querying the event log for past participation in similar tasks.

2. **Evidence**
   The immutable record of the skill being exercised. This includes commit histories, deployment events, and review cycles. Evidence grounds the skill in historical reality.

3. **Processes**
   The operational sequence required to execute the work. The system derives the sequence by analyzing the chronological order of events within the evidence layer.

4. **Examples**
   Reference implementations. The system identifies execution traces that resulted in optimal outcomes and tags them as canonical examples.

## Capability Persistence

Capabilities typically reside in individuals. When an individual departs, the capability degrades.

The system decouples the capability from the operator. Skills are continuously synthesized from the event log. The structural knowledge remains in the system. The organization retains the capability independent of personnel changes.

When a new operator initiates a task, the system surfaces the relevant skill. It provides the derived process, canonical examples, and historical evidence. The operator is bootstrapped with the organization's accumulated experience.
