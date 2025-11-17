import { Injectable } from '@nestjs/common';
// import { PrismaService } from "../prisma.service";

@Injectable()
export class BaseRepository<T> {
  constructor(
    protected model,
    protected mapper,
  ) {
  }
  async create(entity: T): Promise<T | null> {
    const data = await this.model.create({
      data: this.mapper.toPrisma(entity),
    });
    console.log(data, 'for creating suer in base repo');

    return this.mapper.toDomain(data);
  }

  async findById(id: string): Promise<T | null> {
    const data = await this.model.findUnique({ where: { id } });

    if (!data) return null;
    return this.mapper.toDomain(data);
  }

  async update(id: string, update: T): Promise<T> {
    const data = await this.model.update({
      where: { id },
      data: this.mapper.toPrisma(update),
    });
    return this.mapper.toDomain(data);
  }
}
