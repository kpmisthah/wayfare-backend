import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IAgencyRevenueRepository } from '../../../../../domain/repositories/admin/agency-revenue.repository.interface';
import { AgencyRevenueSummaryResult } from '../../../../../application/dtos/repository-results';
import { AgencyRevenueDTO } from '../../../../../application/dtos/agency-revenue.dto';

@Injectable()
export class AgenciesRevenueRepository implements IAgencyRevenueRepository {
  constructor(private readonly _prisma: PrismaService) { }

  async getAgencyRevenueSummary(
    page: number,
    limit: number,
    search?: string,
  ): Promise<AgencyRevenueSummaryResult> {
    const agencySummary = await this._prisma.booking.groupBy({
      by: ['agencyId'],
      _sum: {
        platformEarning: true,
      },
      _count: {
        _all: true,
      },
    });

    const agencyIds = agencySummary.map((a) => a.agencyId);

    const agencyWhereClause: {
      id: { in: string[] };
      user?: { name: { contains: string; mode: 'insensitive' } };
    } = {
      id: { in: agencyIds },
    };

    if (search && search.trim()) {
      agencyWhereClause.user = {
        name: { contains: search, mode: 'insensitive' },
      };
    }

    const agencies = await this._prisma.agency.findMany({
      where: agencyWhereClause,
      select: { id: true, user: { select: { name: true } } },
    });

    const filteredResults: AgencyRevenueDTO[] = [];
    for (const summary of agencySummary) {
      const matchedAgency = agencies.find(
        (agency) => agency.id === summary.agencyId,
      );
      if (matchedAgency) {
        filteredResults.push({
          agencyId: summary.agencyId,
          agencyName: matchedAgency.user.name,
          platformEarning: summary._sum.platformEarning ?? 0,
          all: summary._count._all,
        });
      }
    }

    const total = filteredResults.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const data = filteredResults.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      totalPages,
    };
  }
}
