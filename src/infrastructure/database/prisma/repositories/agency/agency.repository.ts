import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Agency } from '@prisma/client';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { AgencyStatus } from 'src/domain/enums/agency-status.enum';
import { AgencyListItem } from 'src/domain/interfaces/agency-list-items.interface';
import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { AgencyMapper } from 'src/infrastructure/mappers/agency.mapper';
import { AgencyProfileDto } from 'src/application/dtos/agency-profile.dto';
import { BaseRepository } from '../base.repository';

@Injectable()
export class AgencyRepository extends BaseRepository<AgencyEntity> implements IAgencyRepository {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.agency,AgencyMapper)
  }

  async findByEmail(email: string):Promise<AgencyEntity|null>{
    const agency = await this.prisma.agency.findFirst({
      where: {
        user: {
          email: email
        }
      }
    });
    if(!agency){
      return null
    }
    return AgencyMapper.toDomain(agency)
  }

  // async create(agency:AgencyEntity): Promise<AgencyEntity | null> {
  //   let createAgency =  await this.prisma.agency.create({
  //     data: AgencyMapper.toPrisma(agency)
  //   })
  //   return AgencyMapper.toDomain(createAgency)
  // }

  async findAll(): Promise<AgencyProfileDto[] | null>
  {
    let agency = await this.prisma.agency.findMany({
      where: {
        role: 'AGENCY',
      },
      select: {
        id: true,
        description:true,
        status: true,        
        phone:true,
        user:{
          select:{
            name:true,
            email:true
          }
        }
      },
    });
    if(!agency){
      return null
    }
    return AgencyMapper.toProfile(agency)
  }

  async updateStatus(
    id: string,
    updateAgencyStatus,
  ): Promise<AgencyEntity | null> {
    const updatedData = await this.prisma.agency.update({
      where: { id }, 
      data:AgencyMapper.toPrisma(updateAgencyStatus) 
    });
    if(!updatedData) return null
    return AgencyMapper.toDomain(updatedData);
  }

  // async findById(id: string): Promise<AgencyEntity | null> {
  //   const agency = await this.prisma.agency.findUnique({ where: { id } });
  //   if(!agency) return null
  //   return AgencyMapper.toDomain(agency);
  // }
}
