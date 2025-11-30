import { Injectable } from '@nestjs/common';
import { preference, Role } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { IAdminRepository } from 'src/domain/repositories/admin/admin.repository.interface';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createPreference(preference: {
    name: string;
  }): Promise<preference | null> {
    return await this.prisma.preference.create({
      data: {
        name: preference.name,
      },
    });
  }

  async getAllPreferences(): Promise<preference[] | null> {
    return await this.prisma.preference.findMany();
  }

  async findAdmin():Promise<UserEntity|null>{
   let admin = await this.prisma.user.findFirst({
      where:{
        role:Role.ADMIN
      }
    })
    if(!admin) return null
    console.log(admin,'admin in infra repo');
      return UserMapper.toDomain(admin)
  }

    async findRecentBookings(limit:number) {
    const bookings = await this.prisma.booking.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        user: { select: { name: true }},
        agency: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        package: { select: { destination: true }},
      },
    });

    return bookings;
  }
}
