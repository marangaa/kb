# 06 — Organizational Beliefs

Organizations operate under constraints. We define these constraints as organizational beliefs. Examples include "optimize for enterprise customers" or "avoid Kubernetes."

Beliefs dictate the "why" behind operational decisions.

## Tacit vs. Explicit Knowledge

Explicit knowledge is codified. It resides in wikis, onboarding guides, and architectural decision records. It is visible but frequently stale.

Tacit knowledge is uncodified. It is the practical understanding of the organization's mechanics. It comprises the majority of institutional memory. Traditional software systems ignore tacit knowledge. When personnel turn over, tacit knowledge is destroyed.

## Inference from Behavior

The system does not provide interfaces for humans to document beliefs. Explicit codification introduces bias and strips context. The system infers beliefs from behavioral patterns.

1. **Observation**
   The system processes the event log. It observes code reviews, deployment configurations, incident responses, and policy updates.

2. **Pattern Recognition**
   Repeated actions indicate an underlying constraint. If infrastructure changes consistently reject container orchestration, the system identifies a preference against Kubernetes.

3. **Inference Generation**
   The system constructs a belief hypothesis. The hypothesis is attached to the organizational model as a probabilistic constraint.

4. **Continuous Validation**
   Beliefs are not static. New events update the confidence score of each inferred belief. If the organization starts deploying Kubernetes clusters, the confidence score of the associated belief decays.

The system projects these beliefs onto the organizational model. This layer provides contextual bounds for future reasoning operations.
