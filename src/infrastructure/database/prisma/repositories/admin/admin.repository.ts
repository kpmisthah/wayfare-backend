import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { IAdminRepository } from '../../../../../domain/repositories/admin/admin.repository.interface';
import { UserEntity } from '../../../../../domain/entities/user.entity';
import { UserMapper } from '../../../../mappers/user.mapper';

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async findAdmin(): Promise<UserEntity | null> {
    const admin = await this._prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
      },
    });
    if (!admin) return null;
    return UserMapper.toDomain(admin);
  }

  async findRecentBookings(limit: number) {
    const bookings = await this._prisma.booking.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        user: { select: { name: true } },
        agency: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        package: { select: { destination: true } },
      },
    });

    return bookings;
  }
}
