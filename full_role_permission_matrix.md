# Musallih Platform – Full Role & Permission Matrix

This document defines the **canonical role system and permission model** for the Musallih open Islamic civic infrastructure platform.

The platform enforces **four simultaneous control layers** on every protected action:

1. Role-based access (RBAC)
2. Jurisdiction-based access (authority & geo scope)
3. Relationship-based access (member, trustee, staff, etc.)
4. Consent-based access (field-level permissions)

---

# 1. Core Role Taxonomy

## A. Individual Layer
- Musallih (User)
- Family Admin
- Family Member (linked or unlinked)

## B. Organization Layer
- Organization Owner
- Organization Admin
- Organization Staff
- Masjid Trustee
- Imam / Religious Authority
- Welfare Officer
- Burial Officer
- Education Coordinator
- Business Manager

## C. Authority Layer
- City Authority Admin
- State Authority Admin
- Country Authority Admin
- Global Authority Admin

## D. Platform Layer
- Core Maintainer
- Security Maintainer
- Read-only Auditor

## E. Partner Layer
- OAuth Partner App
- Verified External Platform

---

# 2. Permission Categories

Permissions are grouped into these domains:

- Identity & Profiles
- Family & Welfare Data
- Organizations & Institutions
- Services & Activities
- Requests & Case Management
- Prayer & Calendar Systems
- Announcements & Broadcasts
- Donations & Campaigns
- Ads & Revenue Systems
- Authorities & Governance
- APIs & Integrations
- Security, Audit & Compliance

Each permission is always further filtered by:
- geo-jurisdiction
- organization relationship
- consent profile

---

# 3. Individual Layer Permissions

## Musallih (User)

- Create & manage own profile
- Set school of thought
- View prayer times & Hijri calendar
- Discover masjids & organizations
- Follow/join organizations
- Create & manage family
- Add/edit family members
- Submit service requests
- Book appointments
- Register for activities
- Donate to campaigns
- View announcements
- Control consent profiles
- View access logs
- Export or delete own data

Restrictions:
- Cannot view others’ sensitive data without explicit consent
- Cannot access authority or admin panels

---

## Family Admin

All Musallih permissions, plus:

- Create family unit
- Invite/remove family members
- Maintain family demographic data
- Submit family-level service requests
- Manage consent on behalf of minors
- View family request history

Restrictions:
- Cannot override an adult member’s consent

---

## Family Member

- View own basic profile
- View own requests
- Participate in activities
- Set school of thought

Restrictions:
- No administrative powers
- No family-wide actions

---

# 4. Organization Layer Permissions

## Organization Owner

- Full control of organization profile
- Assign/remove admins
- Approve internal roles
- Manage services & activities
- View all organization requests
- Manage campaigns & webinars
- Launch ads
- Access organization analytics

Restrictions:
- Cannot self-verify organization
- Cannot override authority

---

## Organization Admin

- Edit organization profile
- Manage staff
- Manage services catalogue
- Publish activities/events
- Receive & assign service requests
- Schedule appointments
- Send announcements
- Manage donations & webinars

Restrictions:
- Cannot delete organization
- Cannot bypass audits

---

## Organization Staff

- View assigned service requests
- Update case status
- Communicate with requesters
- Upload documents
- Schedule appointments

Restrictions:
- Cannot change organization settings
- Cannot access unrelated cases

---

## Masjid Trustee

Includes Organization Admin permissions, plus:

- Configure prayer system
- Manage jamaat times
- Approve nearby businesses
- Validate local institutions
- Publish religious announcements

Restrictions:
- Cannot override authority rulings

---

## Imam / Religious Authority

- Issue religious notices
- Approve Hijri rulings (if delegated)
- Host webinars
- Validate nikah requests

Restrictions:
- No financial or revenue permissions by default

---

## Welfare Officer

- View welfare-tagged profiles (consented)
- Manage financial aid requests
- Maintain welfare notes

Restrictions:
- Cannot see unrelated family data

---

## Burial Officer

- Receive burial preparation requests
- Manage burial scheduling
- Coordinate with families

---

## Education Coordinator

- Manage education services
- Handle admissions requests
- Publish academic activities

---

## Business Manager

- Manage business profile
- Submit ads
- Respond to inquiries
- View campaign analytics

---

# 5. Authority Layer Permissions

## City Authority Admin

- Approve local organizations
- Appoint primary admins
- Manage jurisdiction boundaries
- Publish city-wide announcements
- Approve city-level ads
- View city dashboards
- Resolve organization disputes

Restrictions:
- Cannot act outside jurisdiction

---

## State Authority Admin

- Approve city authorities
- Override city disputes
- Publish state rulings
- Approve state-level ads
- Monitor city compliance

---

## Country Authority Admin

- Approve state authorities
- Issue national Hijri rulings
- Freeze disputed organizations
- Oversee zakat/welfare programs
- Approve country-level ads

---

## Global Authority Admin

- Approve countries
- Maintain global calendar
- Issue global advisories
- Arbitrate conflicts
- Manage global funds

---

# 6. Platform Layer Permissions

## Core Maintainer

- Manage platform configuration
- Review system logs
- Approve protocol changes
- Maintain repositories

Restrictions:
- No access to private user data

---

## Security Maintainer

- View audit logs
- Investigate breaches
- Disable compromised keys
- Issue security patches

---

## Read-only Auditor

- View anonymized dashboards
- Review compliance logs

---

# 7. Partner Layer Permissions

## OAuth Partner App

- Authenticate users
- Read approved profile scopes
- Submit service requests
- Register activities
- Receive webhooks

Restrictions:
- Cannot bypass consent
- Cannot store unapproved fields

---

## Verified External Platform

- All OAuth permissions
- Organization-scoped data sync
- Event-based integrations

---

# 8. High-Risk Permission Map

The following actions always require **multi-factor + authority + audit**:

- Organization verification
- Authority creation
- Hijri calendar override
- Prayer system override
- Welfare financial access
- Burial registry updates
- Ad revenue settlement
- OAuth scope expansion

---

# 9. Consent Overlay Rules

Even with role permission, access is denied unless:

- A valid ConsentProfile exists
- The scope allows the field
- The consent is not expired
- The request is within relationship bounds

---

# 10. Example Permission Flow

Welfare Officer → attempts to view family income:

1. Check role (welfare officer)
2. Check organization relationship
3. Check jurisdiction
4. Check consent profile
5. Mask unapproved fields
6. Log access

---

# 11. Role-to-Permission Summary Table

| Role | Scope | Core Capabilities |
|------|-------|-------------------|
Musallih | Self | Profile, requests, donations, discovery |
Family Admin | Family | Family data, minors, requests |
Org Staff | Org | Case handling |
Org Admin | Org | Services, staff, announcements |
Masjid Trustee | Org | Prayer, validation, religious ops |
Authority Admin | Jurisdiction | Approvals, rulings, audits |
Platform Maintainer | Global | Infra & governance |
OAuth Partner | Scoped | API-driven features |

---

# 12. Design Notes

- No role bypasses consent.
- No role bypasses jurisdiction.
- Authorities do not directly edit user data.
- Platform maintainers do not access private data.
- All sensitive access is auditable and user-visible.

---

This matrix is the **security backbone** of the platform and must be enforced at:
- API gateway
- service layer
- data-access layer

