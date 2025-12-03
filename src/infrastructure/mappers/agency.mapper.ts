import { Agency, Prisma } from '@prisma/client';
import { AgencyEntity } from 'src/domain/entities/agency.entity';

export class AgencyMapper {
  static toDomain(agency: Agency): AgencyEntity {
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
      domain: new AgencyEntity(
        a.id,
        a.description,
        a.userId,
        a.pendingPayouts,
        a.totalEarnings,
        a.address,
        a.licenseNumber ?? '',
        a.ownerName ?? '',
        a.websiteUrl ?? '',
      ),

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
