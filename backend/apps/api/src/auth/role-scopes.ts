/**
 * Maps organization/authority roles to OAuth scopes.
 * Format: domain.resource.action
 */
export const ROLE_SCOPES: Record<string, string[]> = {
  // Individual
  Musallih: [
    'profile.basic.read',
    'profile.contact.read',
    'profile.update',
    'request.service.write',
    'organization.profile.read',
    'organization.services.read',
    'organization.activities.read',
  ],
  'Family Admin': [
    'profile.basic.read',
    'profile.contact.read',
    'profile.update',
    'family.basic.read',
    'family.members.read',
    'family.requests.write',
    'request.service.write',
    'organization.profile.read',
    'organization.services.read',
    'organization.activities.read',
  ],
  // Organization
  'Organization Owner': [
    'profile.basic.read',
    'profile.contact.read',
    'profile.update',
    'organization.profile.read',
    'organization.team.read',
    'organization.services.read',
    'organization.services.manage',
    'organization.activities.read',
    'organization.activities.manage',
    'organization.requests.read',
    'organization.requests.manage',
    'organization.analytics.read',
    'request.service.write',
  ],
  'Organization Admin': [
    'profile.basic.read',
    'profile.contact.read',
    'organization.profile.read',
    'organization.services.read',
    'organization.services.manage',
    'organization.activities.read',
    'organization.activities.manage',
    'organization.requests.read',
    'organization.requests.manage',
    'request.service.write',
  ],
  'Organization Staff': [
    'profile.basic.read',
    'organization.requests.read',
    'organization.services.read',
    'request.service.write',
  ],
  'Masjid Trustee': [
    'profile.basic.read',
    'organization.profile.read',
    'organization.services.read',
    'organization.services.manage',
    'organization.activities.read',
    'organization.activities.manage',
    'organization.requests.read',
    'organization.requests.manage',
    'request.service.write',
  ],
  // Authority
  'City Authority Admin': [
    'authority.organizations.approve',
    'authority.announcements.publish',
    'authority.ads.approve',
    'authority.disputes.resolve',
  ],
  'State Authority Admin': [
    'authority.organizations.approve',
    'authority.announcements.publish',
    'authority.ads.approve',
    'authority.disputes.resolve',
    'authority.compliance.monitor',
  ],
  'Country Authority Admin': [
    'authority.organizations.approve',
    'authority.announcements.publish',
    'authority.ads.approve',
    'authority.disputes.resolve',
    'authority.compliance.monitor',
    'authority.rulings.issue',
  ],
  'Global Authority Admin': [
    'authority.organizations.approve',
    'authority.announcements.publish',
    'authority.ads.approve',
    'authority.disputes.resolve',
    'authority.compliance.monitor',
    'authority.rulings.issue',
    'authority.global.manage',
  ],
};

const BASE_SCOPES = ROLE_SCOPES['Musallih'];

export function getScopesForRoles(roles: string[]): string[] {
  const scopeSet = new Set<string>(BASE_SCOPES);
  for (const role of roles) {
    const scopes = ROLE_SCOPES[role];
    if (scopes) scopes.forEach((s) => scopeSet.add(s));
  }
  return Array.from(scopeSet);
}
