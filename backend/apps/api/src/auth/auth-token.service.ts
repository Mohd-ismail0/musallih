import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma';
import { FirebaseService, DecodedIdToken } from '../firebase/firebase.service';
import { getScopesForRoles } from './role-scopes';
import { JwtPayload } from './jwt.strategy';
import { getEnv } from '../config/env';

@Injectable()
export class AuthTokenService {
  constructor(
    private firebase: FirebaseService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async exchangeToken(
    firebaseIdToken: string,
  ): Promise<{ access_token: string; expires_in: number }> {
    const decoded = await this.firebase.verifyIdToken(firebaseIdToken);

    let user = await this.prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      include: {
        organizationTeams: { include: { organization: { include: { authority: true } } } },
        authorityAdmins: { include: { authority: true } },
      },
    });

    if (!user) {
      user = await this.createUserFromFirebase(decoded);
    }

    const payload = this.buildJwtPayload(user);
    const env = getEnv();
    const token = this.jwt.sign(payload, {
      expiresIn: env.JWT_EXPIRES_IN_SECONDS,
    });

    return {
      access_token: token,
      expires_in: env.JWT_EXPIRES_IN_SECONDS,
    };
  }

  private async createUserFromFirebase(decoded: DecodedIdToken) {
    const fullName = decoded.name || decoded.email?.split('@')[0] || decoded.phone_number || 'User';
    return this.prisma.user.create({
      data: {
        firebaseUid: decoded.uid,
        fullName,
        email: decoded.email ?? undefined,
        phone: decoded.phone_number ?? undefined,
      },
      include: {
        organizationTeams: { include: { organization: { include: { authority: true } } } },
        authorityAdmins: { include: { authority: true } },
      },
    });
  }

  private buildJwtPayload(user: {
    id: string;
    organizationTeams: Array<{
      role: string;
      organization: { id: string; authority: { level: string; id: string } };
    }>;
    authorityAdmins: Array<{
      role: string;
      authority: { level: string; id: string };
    }>;
  }): JwtPayload {
    const roles: string[] = ['Musallih'];
    let orgId: string | undefined;
    let authorityLevel: string | undefined;
    const jurisdictionCodes: string[] = [];

    for (const t of user.organizationTeams) {
      roles.push(t.role);
      if (!orgId) orgId = t.organization.id;
      const level = t.organization.authority?.level;
      const authId = t.organization.authority?.id;
      if (level && authId) {
        jurisdictionCodes.push(`${level}:${authId}`);
      }
    }

    for (const a of user.authorityAdmins) {
      roles.push(a.role);
      if (
        !authorityLevel ||
        rankAuthorityLevel(a.authority.level) > rankAuthorityLevel(authorityLevel)
      ) {
        authorityLevel = a.authority.level;
      }
      jurisdictionCodes.push(`${a.authority.level}:${a.authority.id}`);
    }

    const scopes = getScopesForRoles(roles);

    return {
      sub: user.id,
      scopes,
      org_id: orgId,
      authority_level: authorityLevel,
      jurisdiction_codes: jurisdictionCodes.length > 0 ? jurisdictionCodes : undefined,
    };
  }
}

function rankAuthorityLevel(level: string): number {
  const order: Record<string, number> = {
    CITY: 1,
    STATE: 2,
    COUNTRY: 3,
    GLOBAL: 4,
  };
  return order[level] ?? 0;
}
