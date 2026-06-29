# The Organization as Living Computational Entity: A Research Synthesis

## 1. Organizational Memory (Walsh & Ungson 1991 + Extensions)
- **Definition:** Stored information from history brought to bear on present decisions.
- **Bins:** Individuals, Culture, Transformations (SOPs/workflows), Structure, External Archives.
- **Transactive Memory Systems (TMS):** The distributed "who knows what" map.
- **OM vs KM:** Knowledge Management is the strategic process; Organizational Memory is the storage/retrieval substrate.

## 2. Institutional Memory — The "Why" vs. "What" Distinction
- **What gets lost:** The "why" (intent, vetoed options, relational knowledge). Highly tacit, catastrophic loss when people leave.
- **Why orgs forget:** Attrition, poor knowledge transfer, intentional unlearning.

## 3. Viable System Model (Stafford Beer)
- **S1 — Operations:** The value-creating units (agents).
- **S2 — Coordination:** Message broker, prevents conflict.
- **S3 — Operational Management:** Optimization and resource allocation.
- **S4 — Intelligence/Strategy:** Outward-looking, environmental scanning.
- **S5 — Policy/Identity:** Normative layer, values, constraints.

## 4. Event Sourcing Applied to Organizations
- Traditional systems store state snapshots. This system must store an **immutable event log**.
- **Enables:** Time travel, decision provenance, counterfactual reasoning.
- **ADR Pattern:** Architectural Decision Records generalized to all org decisions.

## 5. Tacit vs. Explicit Knowledge (SECI Model)
- **Polanyi's Paradox:** "We know more than we can tell." 80% of knowledge is tacit.
- **Failure of software:** Codification bias, capture fallacy, context collapse.
- **AI Opportunity:** Infer tacit knowledge from behavioral patterns rather than asking humans to write it down.

## 6. Prior Art
- **Palantir Foundry/AIP:** Ontology layer maps raw data to business objects.
- **Backstage.io:** Catalog graph of engineering components/ownership.
- **Gap:** Nobody models the "why" or the tacit cultural beliefs.

## 7. OODA Loop
- **Observe → Orient → Decide → Act**
- **Orient:** The most critical phase, where institutional memory lives. Turning raw observation into contextualized intelligence.

## System Design Implications
1. **Multi-layer memory:** Episodic (event log), Semantic (graph), Procedural, Institutional.
2. **Event-first:** The canonical store is an event log. State is a projection.
3. **VSM Architecture:** Agents mapped to S1-S5 roles.
4. **Tacit Inference:** Observe behavior to map "who knows what".
5. **The "Why" Layer:** Every event captures context, options, and rationale.
