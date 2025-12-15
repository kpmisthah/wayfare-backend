import {
  Controller,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../../domain/enums/role.enum';
import { AgencyDashboardUseCase } from '../../application/usecases/agency/implementation/agency-dashboard.usecase';

@Controller('agency/dashboard')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.Agency)
export class AgencyDashboardController {
  constructor(
    private readonly agencyDashboardUseCase: AgencyDashboardUseCase,
  ) {}

  @Get()
  async getDashboardData(@Req() req: any) {
    console.log('[AgencyDashboardController] GET /agency/dashboard called');
    try {
      const userId = req.user['userId'];
      console.log(`[AgencyDashboardController] User ID from token: ${userId}`);

      if (!userId) {
        console.error(
          '[AgencyDashboardController] User ID is missing from token!',
        );
      }

      const data = await this.agencyDashboardUseCase.execute(userId);

      return {
        success: true,
        data,
        message: 'Dashboard data fetched successfully',
      };
    } catch (error) {
      console.error('[AgencyDashboardController] Error:', error);
      throw error;
    }
  }
}
