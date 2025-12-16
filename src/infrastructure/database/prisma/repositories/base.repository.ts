import { Injectable } from '@nestjs/common';

export interface IMapper<T, U> {
  toPrisma(entity: T): U;
  toDomain(data: unknown): T;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IModel<_U = unknown> {
  create(args: any): Promise<unknown>;

  findUnique(args: any): Promise<unknown>;

  update(args: any): Promise<unknown>;
}

@Injectable()
export class BaseRepository<T, U = unknown> {
  constructor(
    protected model: IModel<U>,
    protected mapper: IMapper<T, U>,
  ) {}
  async create(entity: T): Promise<T | null> {
    console.log(entity, 'in Bankingcratio');
    const data: unknown = await this.model.create({
      data: this.mapper.toPrisma(entity),
    });
    console.log(data, 'for creating suer in base repo');

    return this.mapper.toDomain(data);
  }

  async findById(id: string): Promise<T | null> {
    const data: unknown = await this.model.findUnique({ where: { id } });

    if (!data) return null;
    return this.mapper.toDomain(data);
  }

  async update(id: string, update: T): Promise<T> {
    console.log(id, 'iddd in base repo and update', update);
    const data: unknown = await this.model.update({
      where: { id },
      data: this.mapper.toPrisma(update),
    });
    console.log(data, 'in updateee');

    return this.mapper.toDomain(data);
  }
}
