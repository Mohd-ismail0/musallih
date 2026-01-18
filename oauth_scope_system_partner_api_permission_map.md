# Musallih Platform – OAuth Scope System & Partner API Permission Map

This document defines the **canonical OAuth2 scope system and partner API permission model** for the Musallih open Islamic civic infrastructure platform.

It is designed to enable **external platforms (job portals, nikah/matchmaking apps, education portals, zakat systems, devices like Alexa, etc.)** to safely build on top of Musallih’s identity, organization, and religious data layer.

The system enforces:
- least‑privilege access
- explicit user consent
- organization scoping
- jurisdiction awareness
- full auditability

---

# 1. OAuth Architecture Overview

The platform exposes two API classes:

### A. Public Open APIs (No OAuth)
- Masjid discovery
- Prayer times
- Hijri date & Islamic events
- Public organization profiles
- Public announcements

Used for: websites, displays, Alexa, widgets, public dashboards.

---

### B. Partner APIs (OAuth 2.1 + PKCE)
Used for any access involving:
- user identity
- family data
- requests
- services
- activities
- donations
- organization operations

OAuth server must support:
- Authorization Code + PKCE
- Device flow (for IoT)
- Refresh tokens
- Fine‑grained scopes
- Webhook signing

---

# 2. OAuth Client Types

## 2.1 Public Client
- Mobile apps
- Web apps
- Devices

Restrictions:
- PKCE mandatory
- No client secrets
- Strict redirect URI matching

---

## 2.2 Confidential Client
- Server apps
- Organization systems

Restrictions:
- Signed secrets
- IP/domain allowlists
- Manual approval required

---

# 3. Core Scope Taxonomy

Scopes are grouped into **domains**. All scopes are namespaced.

Format:
```
<domain>.<resource>.<action>
```

Example:
```
profile.basic.read
request.service.write
organization.services.manage
```

---

# 4. Identity & Profile Scopes

| Scope | Description | Consent Required |
|------|-------------|------------------|
profile.basic.read | Name, age group, city | Yes |
profile.contact.read | Email, phone | Yes |
profile.demographics.read | Gender, marital status | Yes |
profile.education.read | Education fields | Yes |
profile.financial.read | Income range | High‑risk |
profile.religious.read | School of thought | Sensitive |
profile.update | Update own profile | Yes |

Notes:
- Financial and religious scopes require **explicit, separate consent**.
- No scope allows raw DOB; only age group unless elevated.

---

# 5. Family & Welfare Scopes

| Scope | Description |
|------|-------------|
family.basic.read | Family structure |
family.members.read | Family members |
family.demographics.read | Age, gender |
family.education.read | Education data |
family.welfare.read | Welfare flags |
family.financial.read | Financial indicators (high‑risk) |
family.requests.read | Family service requests |
family.requests.write | Submit requests |

Rules:
- Minors always require Family Admin consent.
- Welfare & financial scopes always trigger audit alerts.

---

# 6. Organization & Services Scopes

| Scope | Description |
|------|-------------|
organization.profile.read | Org public + verified data |
organization.team.read | Org team (limited) |
organization.services.read | Services catalogue |
organization.services.manage | Create/update services |
organization.activities.read | Events & programs |
organization.activities.manage | Publish activities |
organization.requests.read | Incoming service requests |
organization.requests.manage | Case handling |
organization.analytics.read | Aggregated metrics |

Rules:
- Manage scopes only issued to organization‑bound clients.
- All writes require organization signature.

---

# 7. Request & Case Management Scopes

| Scope | Description |
|------|-------------|
request.service.write | Submit service request |
request.service.read | View own requests |
request.family.write | Submit family requests |
request.organization.read | Org request inbox |
request.organization.update | Update case status |
request.attachments.write | Upload documents |
appointment.manage | Schedule/modify appointments |

---

# 8. Religious Systems Scopes

| Scope | Description |
|------|-------------|
prayer.times.read | Prayer times |
calendar.hijri.read | Hijri calendar |
calendar.events.read | Islamic events |
calendar.override.propose | Propose changes |
calendar.override.approve | Authority‑only |

Rules:
- Approve scopes only issuable to Authority clients.

---

# 9. Donations, Campaigns & Ads

| Scope | Description |
|------|-------------|
donations.read | Donation history |
donations.write | Make donations |
campaigns.manage | Create campaigns |
ads.campaign.create | Create ads |
ads.campaign.read | View performance |
ads.settlement.read | Revenue settlement |

High‑risk:
- ads.settlement.read
- campaigns.manage

Require multi‑factor + audit.

---

# 10. Authority & Governance Scopes

| Scope | Description |
|------|-------------|
authority.organizations.approve | Verify institutions |
authority.admins.manage | Manage authority users |
authority.rulings.publish | Publish rulings |
authority.calendar.manage | Calendar governance |
authority.audit.read | Audit dashboards |

---

# 11. Platform & Security Scopes

| Scope | Description |
|------|-------------|
platform.keys.rotate | Rotate secrets |
platform.webhooks.manage | Register webhooks |
platform.audit.read | View logs |
platform.security.respond | Incident handling |

---

# 12. Webhook Event System

All partner apps can subscribe to events.

Standard events:

- user.created
- consent.updated
- organization.approved
- service.created
- activity.published
- request.submitted
- request.updated
- appointment.scheduled
- donation.completed
- ad.campaign.started
- ad.settlement.completed

Security:
- HMAC signatures
- rotating secrets
- replay protection

---

# 13. Example Partner Permission Maps

## A. Job Portal
- profile.basic.read
- profile.education.read
- family.basic.read (optional)
- request.service.write
- webhooks: user.created, consent.updated

---

## B. Nikah / Matchmaking Platform
- profile.basic.read
- profile.demographics.read
- profile.religious.read
- family.basic.read
- request.service.write
- appointment.manage

---

## C. Education Platform
- profile.basic.read
- profile.education.read
- organization.services.read
- request.service.write

---

## D. Alexa / Smart Devices
(no OAuth, public APIs only)
- prayer.times.read
- calendar.hijri.read
- masjid.discovery.read

---

# 14. Token Structure

JWT claims must include:
- sub (user id)
- client_id
- scopes
- org_id (if applicable)
- authority_level (if applicable)
- jurisdiction codes
- consent_hash

Tokens are invalid if consent_hash mismatches.

---

# 15. Scope Enforcement Rules

Every partner API call must:

1. Validate token
2. Validate scope
3. Validate jurisdiction
4. Validate organization binding
5. Validate consent profile
6. Mask unauthorized fields
7. Log access

---

# 16. Revocation & Safety

- User can revoke any app
- Authority can freeze apps
- Emergency kill‑switch for scopes
- Automated anomaly detection

---

# 17. Design Guarantees

- No partner gets blanket access
- No silent data sharing
- No bypassing consent
- No monetization access without authority
- No religious system override without governance

---

This OAuth & partner API system positions Musallih as a **neutral identity, trust, and data coordination layer** for the Muslim digital ecosystem.

