# Musallih Platform – Request & Case-Management Workflow Diagrams

This document defines the **end-to-end workflows, state machines, and escalation paths** for the Musallih platform’s Request & Case-Management system.

This system is the **community operations layer** enabling musallihs and families to request services (nikah, burial, education, welfare, counseling, etc.) and organizations to process them securely and transparently.

---

# 1. Core Design Principles

- Every request is a **case** with lifecycle states
- Every case belongs to exactly one organization
- Every case has:
  - requester
  - service type
  - audit trail
  - consent binding
  - jurisdiction binding

No case can be:
- silently deleted
- reassigned across jurisdictions without authority involvement
- accessed without role + consent validation

---

# 2. Core Entities Involved

- Musallih / Family Admin (requester)
- Organization (case owner)
- Organization Staff (case handlers)
- Authority (oversight / escalation)
- Consent Engine (field-level access)
- Audit System (non‑repudiation)

---

# 3. Universal Request Lifecycle (State Machine)

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Submitted
    Submitted --> Acknowledged
    Acknowledged --> In_Review
    In_Review --> Scheduled
    In_Review --> Rejected
    Scheduled --> In_Progress
    In_Progress --> Completed
    Completed --> Closed

    Submitted --> Cancelled
    Acknowledged --> Cancelled
    In_Review --> Cancelled

    Rejected --> Closed
```

State definitions:
- Draft: local user form, not yet visible
- Submitted: officially lodged, immutable core fields
- Acknowledged: org has seen it
- In_Review: staff assigned, assessment ongoing
- Scheduled: appointment/date locked
- In_Progress: service being delivered
- Completed: service delivered
- Closed: archived, read‑only
- Cancelled: user/org withdrawal
- Rejected: organization declined (reason mandatory)

---

# 4. Standard Request Submission Flow (Musallih → Organization)

```mermaid
flowchart TD
    U[Musallih / Family Admin]
    U --> F[Select Service]
    F --> C[Fill Structured Form]
    C --> A[Attach Documents]
    A --> V[Consent Validation]
    V --> J[Jurisdiction Check]
    J --> S[Submit Request]
    S --> DB[(ServiceRequest)]
    DB --> N[Notify Organization]
```

System actions:
- snapshot of consent profile
- geo‑jurisdiction validation
- automatic local contact surfaced
- audit record created

---

# 5. Organization Intake Workflow

```mermaid
flowchart TD
    N[New Request]
    N --> Q[Request Queue]
    Q --> T[Assign to Staff]
    T --> A[Acknowledge]
    A --> R[Review Details]
    R --> D{Accept?}
    D -->|Yes| S[Schedule / Plan]
    D -->|No| J[Reject with reason]
    S --> P[In Progress]
    P --> C[Complete]
    C --> CL[Close]
```

Controls:
- SLA timers
- staff assignment limits
- escalation triggers

---

# 6. Appointment Scheduling Flow

```mermaid
flowchart TD
    R[Request In Review]
    R --> S[Propose Slots]
    S --> U[User Confirms]
    U --> L[Lock Appointment]
    L --> I[In Progress]
    I --> C[Completed]
```

Supports:
- rescheduling
- cancellation windows
- authority override (burial emergencies)

---

# 7. High‑Sensitivity Flows

## A. Nikah Requests

```mermaid
flowchart TD
    U[Submit Nikah Request]
    U --> M[Masjid Intake]
    M --> I[Imam Assignment]
    I --> D[Document Verification]
    D --> S[Schedule Ceremony]
    S --> C[Conduct Nikah]
    C --> R[Archive & Certificate]
```

Controls:
- imam‑only validation
- authority compliance checks
- mandatory document attachments

---

## B. Burial Requests (Emergency)

```mermaid
flowchart TD
    U[Emergency Burial Request]
    U --> E[Emergency Flag]
    E --> B[Burial Authority]
    B --> I[Immediate Assignment]
    I --> S[Schedule & Prepare]
    S --> C[Completion]
    C --> A[Authority Record]
```

Controls:
- bypass standard SLA
- authority notification
- immutable audit log

---

## C. Welfare / Financial Aid

```mermaid
flowchart TD
    U[Financial Aid Request]
    U --> W[Welfare Org]
    W --> C[Consent Check]
    C --> A[Assessment]
    A --> V[Verification]
    V --> D[Decision]
    D --> P[Disbursement]
    P --> R[Review & Close]
```

Controls:
- multi‑staff approval
- encrypted notes
- audit & reporting hooks

---

# 8. Cross‑Organization Escalation

```mermaid
flowchart TD
    O[Organization cannot resolve]
    O --> C[City Authority]
    C -->|resolve| R[Resolution]
    C -->|escalate| S[State Authority]
    S -->|resolve| R
    S -->|escalate| N[Country Authority]
```

Triggers:
- jurisdiction conflict
- abuse reports
- compliance issues

---

# 9. Case Reassignment & Transfer

Rules:
- cannot transfer without user consent
- must remain inside jurisdiction
- creates immutable case fork

```mermaid
flowchart TD
    C[Active Case]
    C --> T[Transfer Request]
    T --> U[User Consent]
    U --> A[Authority Review]
    A --> N[New Organization]
```

---

# 10. Audit & Compliance Layer

Every state change must log:
- actor
- timestamp
- role
- before/after snapshot
- consent hash

Special alerts on:
- welfare data access
- burial emergencies
- nikah registry updates

---

# 11. Engineering Requirements

Backend must provide:

- Case state machine service
- Request routing engine
- SLA timers & alerts
- Assignment system
- Secure attachments service
- Consent snapshots
- Escalation handler
- Authority oversight dashboard

---

# 12. UX Implications

Musallih App:
- timeline view
- appointment cards
- document upload
- emergency shortcut

Organization App:
- Kanban board
- filters by urgency
- staff workload view
- compliance flags

Authority App:
- dispute inbox
- emergency console
- audit trail viewer

---

This request & case system is designed to operate as the **service backbone of the platform**, enabling religious, civic, welfare, and institutional workflows to run transparently and at scale.

