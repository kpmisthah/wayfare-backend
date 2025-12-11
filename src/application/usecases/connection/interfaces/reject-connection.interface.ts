export interface IRejectConnection {
  execute(id: string): Promise<{ message: string }>;
}
