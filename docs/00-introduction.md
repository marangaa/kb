# 00 — Introduction

> **What are we building?**

---

Software has spent fifty years modeling the resources a company uses.

Accounting software models money. CRMs model customers. GitHub models code. Calendars model time. ERP systems model inventory, supply chains, and logistics. HRIS systems model headcount.

Every one of these systems captures one slice of organizational reality and optimizes for it in isolation.

None of them models the organization itself.

Not the decisions it has made, or why. Not the knowledge it has accumulated, or where it lives. Not the capabilities it has developed, or how they were earned. Not the beliefs it holds, or how they formed. Not the relationships between any of these things, or how they have changed.

The organization — as a coherent entity with memory, judgment, and identity — exists only as an emergent property scattered across dozens of disconnected systems. When a senior engineer leaves, part of the organization's knowledge leaves with them. When a product direction changes, the reasoning behind the change lives in a Slack thread that nobody will find in six months. When a decision gets reversed, the system that records the original decision has no field for "why this was wrong."

This project builds what is missing.

---

## The System

Kompany is a continuously evolving computational model of an organization.

It observes the organization through its event streams — commits, messages, tickets, meetings, contracts, incidents, deployments — and maintains a structured representation of what the organization knows, what it has done, what it believes, and what it is capable of.

It is not a chatbot. It is not a search engine over documents. It is not a wrapper around an existing tool.

It is infrastructure. The same kind of infrastructure that Git is for code — a durable, queryable, versioned record that makes the organization's history legible to the people and processes that need to work with it.

---

## What It Is Not

It is not a replacement for human judgment.

It is not a system that runs the company.

It is not a product that works out of the box for any organization without configuration.

It does not make decisions. It surfaces the context and history that makes decisions better.

---

## The Analogy That Fits

Before Git, code history existed in backups, in email threads, in people's memories. You could not ask "why was this function written this way?" and get a reliable answer. You could not understand how the codebase arrived at its current state. The knowledge was there, but it was not organized into anything queryable.

Git did not change what code was. It changed how the history of code was represented and stored — as an append-only log of changes, each one annotated with who, what, and why.

This project does the same thing for the organization.

---

## Who This Is For

Engineers building the system should read this document to understand the goal.

Engineers using the system should understand that they are not interacting with a tool that automates their work. They are interacting with an organizational substrate — a layer beneath all existing tools that makes the organization's accumulated knowledge accessible and queryable.

Every other document in this series answers one more question about how that substrate is designed.
