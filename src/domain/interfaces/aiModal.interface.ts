export interface IAiModel {
  askModal(prompt: string): Promise<string>;
}
