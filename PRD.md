# 📘 PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Project: Musallih – Open Islamic Civic Infrastructure Platform

## Type: Open-source, federated, API-first community infrastructure

## Clients: Cross-platform mobile (React Native), Web admin, Public APIs

---

# 1. Vision & Purpose

To build an **open, neutral, and federated digital infrastructure** for Muslim communities that connects:

* 👤 individuals & families
* 🏛️ masjids & Islamic institutions
* 🌍 local, regional, and global authorities
* 🤝 service & welfare organizations
* 🏢 Muslim businesses
* 🔌 external platforms

into a single interoperable ecosystem for **religious coordination, civic services, welfare support, and community development.**

This is not a social network.
This is **public digital infrastructure for the Muslim world.**

---

# 2. Core Principles

1. Open-source and community-owned
2. Consent-first data design
3. Fiqh-neutral, institution-respecting
4. Federated & self-hostable
5. Authority-aware, not authority-controlled
6. API-first, platform-grade
7. Auditability over convenience
8. Ethical monetization only
9. Offline-tolerant, low-bandwidth ready
10. Infrastructure over features

---

# 3. Platform Scope

The platform consists of the following integrated systems:

* Identity & family graph
* Organization & institution network
* Islamic calendar & prayer engine
* School of thought system
* Authority & jurisdiction governance
* Consent & data-governance engine
* Geo-discovery & mapping
* Service & activity catalogues
* Request & case-management system
* Announcements & broadcast engine
* Donations, campaigns & webinars
* Public & partner API platform
* Ethical advertising & revenue routing
* Audit, compliance & trust layer

---

# 4. Users, Roles & Interfaces

## 4.1 User Groups

### Individuals

* Musallih
* Family admin
* Family member

### Institutions

* Masjid trustees
* Madrasa admins
* Education institute admins
* Burial authority staff
* Welfare/help organization teams

### Authorities

* City Islamic bodies
* State Islamic bodies
* Country Islamic authorities
* Global coordinating bodies

### Ecosystem

* Muslim business owners
* Donors
* Partner platforms (via API)

---

## 4.2 Platform Interfaces

The platform must support **three role-specific interfaces** (single codebase, role-gated UI shells):

### A. Musallih App

* Prayer & Hijri calendar
* Masjid & institution map
* Service discovery
* Activities & events
* Requests & appointments
* Announcements
* Donations
* Family & consent controls

### B. Admin & Authority App

* Organization approvals
* Trustee/staff management
* Jurisdiction dashboards
* Calendar & prayer governance
* Broadcast alerts
* Compliance & audits
* Revenue routing oversight

### C. Organization & Business App

* Organization profiles
* Services & activity catalogues
* Request inbox & case handling
* Appointment scheduling
* Team management
* Ads & campaign management
* Analytics

---

# 5. Functional Requirements

---

## 5.1 Identity & Structured Profiles

### Mandatory at Signup

* Full name
* Date of birth
* Gender
* Marital status
* City/location

### Optional (structured)

* Education level
* Field of study
* Occupation
* Income range
* Skills
* Languages

### Capabilities

* Multi-masjid/institution membership
* Family creation & management
* Per-member school of thought
* Consent management
* Data export & deletion
* Login via OAuth (for partner apps)

### Mandatory

* Field-level encryption
* Consent versioning
* Access logs visible to users

---

## 5.2 Family System

* Create family groups
* Add members (with/without accounts)
* Store demographic, educational, and welfare fields
* Each member:

  * independent consent profile
  * independent school of thought
* Family-level service requests
* Authority-approved welfare visibility

---

## 5.3 Organization & Institution Network

All institutions are unified as **Organizations**.

### Supported Types

* Masjid
* Madrasa
* Educational institutes (multiple levels)
* Burial ground authorities
* Welfare & help organizations
* NGOs
* Muslim businesses

### Capabilities

* Profile & verification
* Geo-location & jurisdiction binding
* Facilities & operating hours
* Team & role management
* Service catalogue
* Activity/event publishing

Masjid-specific extensions:

* prayer configuration
* jamaat times
* fiqh classification

---

## 5.4 Service & Activity Catalogue

Each organization can publish:

### Services

* Nikah
* Burial
* Education
* Welfare
* Counseling
* Legal aid
* Financial assistance
* Youth programs

### Activities/Events

* Classes
* Seminars
* Drives
* Camps
* Webinars
* Community programs

Must support:

* discovery
* filtering
* registration
* appointment flows

---

## 5.5 Request & Case Management System

Musallihs must be able to submit requests to local organizations:

Examples:

* Nikah appointment
* Burial preparation
* Funding assistance
* Counseling
* Admissions

### Request System

* Structured forms
* Urgency levels
* Attachments
* Status tracking
* Appointment booking
* Secure internal notes

Organizations get:

* request inbox
* assignment to staff
* status updates
* scheduling tools
* audit trails

---

## 5.6 Islamic Calendar & Prayer Engine

### Calendar

* Hijri conversion
* Islamic events
* Ramadan & Hajj flags
* Authority & masjid overrides

### Prayer Engine

* calculation methods
* fajr/isha angles
* hanafi vs standard asr
* prayer start & end windows
* jamaat times

Mandatory:

* precomputed tables
* offline support
* override logs
* authority rulings

---

## 5.7 School of Thought Layer

Supported:

* General
* Hanafi
* Shafi
* Maliki
* Hanbali
* Ahl-e-Hadith
* Jafari
* Zaydi
* Ismaili

Applies to:

* organizations
* musallihs
* family members

Used for:

* prayer logic
* filtering
* targeting
* program relevance

---

## 5.8 Authority & Governance System

### Authority Levels

* City
* State
* Country
* Global

### Capabilities

* Approve institutions
* Appoint primary admins
* Publish official rulings
* Lock or override data
* Monitor compliance
* Resolve disputes

Mandatory:

* geo-jurisdiction checks
* digital signatures
* appeal workflows
* transparency logs

---

## 5.9 Consent & Data Governance

Every access must pass:

Role → Jurisdiction → Relationship → Consent → Audit

### Data Classes

* identity
* location
* education
* income
* welfare
* religious affiliation

Mandatory:

* field-level masking
* encryption
* revocation
* visible access history

---

## 5.10 Discovery, Maps & Geo Engine

* masjid & organization map
* service-based discovery
* proximity filtering
* school-based filters
* authority boundary enforcement

Must support:

* low-cost open map tiles
* offline caching
* clustering

---

## 5.11 Announcement & Broadcast Engine

* organization announcements
* authority alerts
* emergency broadcasts
* activity promotions

Must support:

* targeting rules
* rate limits
* override channels
* delivery logs

---

## 5.12 Donations, Campaigns & Webinars

* donation drives

* zakat/sadaqah tagging

* transparency hooks

* campaign limits

* live sessions

* event registration

* replays

---

## 5.13 Public API Platform

### Open APIs (no auth)

* nearby masjids
* prayer times
* hijri dates
* islamic events
* masjid profiles

Use cases:

* Alexa
* wearables
* public displays
* websites

---

## 5.14 Partner API & OAuth Platform

Approved external platforms can:

* authenticate users
* read consented profiles
* publish/read activities
* submit requests
* receive webhooks

Use cases:

* job portals
* matchmaking platforms
* education portals
* zakat platforms

Platform becomes **identity & trust layer**.

---

## 5.15 Ethical Ads & Revenue Routing

Organizations may run location-scoped ads.

### Features

* geo-targeted campaigns
* context-aware placement
* transparent pricing
* community reporting

### Revenue Engine

* 10% platform operations
* remainder routed to:

  * local organizations
  * city authority
  * national bodies
  * global charities

Ledger-based accounting required.

---

# 6. Mobile App Requirements

* React Native (Expo)
* modular feature architecture
* role-based shells
* map-first UX
* fal.ai-level smoothness

Screens:

* prayer dashboard
* hijri calendar
* organization map
* service discovery
* request flows
* announcements
* profile & consent
* organization tools

---

# 7. Non-Functional Requirements

## Security

* encryption
* audit logs
* scoped tokens
* incident response

## Performance

* aggressive caching
* background sync
* low-bandwidth support

## Compliance

* right to export
* right to delete
* self-hostable deployments

## Open-Source

* modular repos
* no proprietary lock-ins
* strong documentation

---

# 8. Technical Architecture

* API-first modular monolith
* PostgreSQL + PostGIS
* Redis
* Object storage
* Message broker
* OAuth server
* Consent middleware
* Geo-engine

Designed to evolve into federated services.

---

# 9. Phased Delivery

## Phase 1 — Infrastructure Core

* identity
* organizations
* masjid & prayer
* calendar
* maps
* announcements
* open APIs

## Phase 2 — Community Operations

* families
* services
* requests
* organizations app
* consent v2
* donations

## Phase 3 — Platform & Ecosystem

* OAuth platform
* partner APIs
* ads engine
* revenue routing
* analytics
* global dashboards

---

# 10. Risks

* misuse of authority
* sectarian conflict
* data exploitation
* political pressure
* financial abuse

Mitigation:

* open governance
* auditability
* neutrality charter
* community oversight

---

# 11. Success Metrics

* verified institutions
* daily prayer queries
* active requests handled
* services listed
* partner apps integrated
* community contributions
* independent deployments

---

# 12. Long-Term Vision

* global Islamic civic grid
* zakat & waqf infrastructure
* nikah & burial registries
* disaster response coordination
* open religious data APIs

---

# 13. Immediate Execution Deliverables

* ERD
* permission matrix
* authority workflows
* consent spec
* prayer engine spec
* API contracts
* mobile UI architecture
* governance documents

