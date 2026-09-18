export interface AnswerModel {
  generate(prompt: string): Promise<string>;
}