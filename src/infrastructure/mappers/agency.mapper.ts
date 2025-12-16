import { Agency, Prisma } from '@prisma/client';
import { AgencyEntity } from '../../domain/entities/agency.entity';

/**
 * Type for Agency with optional user relation
 */
type AgencyWithUser = Agency & {
  user?: {
    bannerImage: string | null;
    profileImage: string | null;
  };
};

export class AgencyMapper {
  static toDomain(agency: Agency): AgencyEntity {
    const agencyWithUser = agency as AgencyWithUser;
    return new AgencyEntity(
      agency.id,
      agency.description,
      // agency.status as AgencyStatus,
      // agency.specialization,
      // agency.phone,
      // agency.role as Role,
      agency.userId,
      agency.pendingPayouts,
      agency.totalEarnings,
      agency.address,
      agency.licenseNumber ?? '',
      agency.ownerName ?? '',
      agency.websiteUrl ?? '',
      agency.transactionId ?? '',
      agency.rejectionReason,
      agencyWithUser.user?.bannerImage ?? null,
      agencyWithUser.user?.profileImage ?? null,
    );
  }

  static toDomainMany(agencies: Agency[]): AgencyEntity[] {
    return agencies.map((agency) => {
      return AgencyMapper.toDomain(agency);
    });
  }
  static toPrisma(agency: AgencyEntity): Prisma.AgencyCreateInput {
    return {
      description: agency.description,
      // status: agency.status,
      // specialization:agency.specialization,
      // phone:agency.phone,
      // role:agency.role,
      pendingPayouts: agency.pendingPayouts,
      totalEarnings: agency.totalEarnings,
      address: agency.address,
      licenseNumber: agency.licenseNumber,
      ownerName: agency.ownerName,
      websiteUrl: agency.websiteUrl,
      user: {
        connect: { id: agency.userId },
      },
      rejectionReason: agency.reason,
    };
  }
  static toProfile(agencies: Agency[]): AgencyEntity[] {
    return agencies.map((agency) => {
      return AgencyMapper.toDomain(agency);
    });
  }
  static fromPrisma(
    a: Prisma.AgencyGetPayload<{
      include: { user: true; package: true };
    }>,
  ) {
    console.log(a.user, 'in frompirsma');
    return {
      domain: {
        id: a.id,
        userId: a.userId,
        description: a.description,
        address: a.address,
        licenseNumber: a.licenseNumber ?? '',
        ownerName: a.ownerName ?? '',
        websiteUrl: a.websiteUrl ?? '',
        pendingPayouts: a.pendingPayouts,
        totalEarnings: a.totalEarnings,
        reason: a.rejectionReason,
      },

      user: {
        id: a.user.id,
        name: a.user.name,
        email: a.user.email,
        isVerified: a.user.isVerified ?? false,
        profileImage: a.user.profileImage || '',
        isBlock: a.user.isBlock,
      },

      packageCount: a.package.length,
    };
  }
}
