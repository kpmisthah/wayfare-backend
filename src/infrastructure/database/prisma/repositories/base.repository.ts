import { Injectable } from '@nestjs/common';

export interface IMapper<T, U> {
  toPrisma(entity: T): U;
  toDomain(data: unknown): T;
}


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
  ) { }
  async create(entity: T): Promise<T | null> {
    const data: unknown = await this.model.create({
      data: this.mapper.toPrisma(entity),
    });

    return this.mapper.toDomain(data);
  }

  async findById(id: string): Promise<T | null> {
    const data: unknown = await this.model.findUnique({ where: { id } });

    if (!data) return null;
    return this.mapper.toDomain(data);
  }

  async update(id: string, update: T): Promise<T> {
    const data: unknown = await this.model.update({
      where: { id },
      data: this.mapper.toPrisma(update),
    });

    return this.mapper.toDomain(data);
  }
}
