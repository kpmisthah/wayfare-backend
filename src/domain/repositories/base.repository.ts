export interface IBaseRepository<T> {
  create(entity: T): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  update(id: string, update: T): Promise<T>;
}
