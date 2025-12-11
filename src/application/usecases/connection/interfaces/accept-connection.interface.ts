export interface IAcceptConnection {
  execute(id: string): Promise<{ message: string }>;
}
