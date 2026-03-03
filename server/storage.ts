import { Question, questionSchema } from "@shared/schema";
import { z } from "zod";
import questionData from "./data/questiondata.json";

export interface IStorage {
  getQuestions(): Promise<Question[]>;
}

export class JsonStorage implements IStorage {
  async getQuestions(): Promise<Question[]> {
    const data = questionData;
    const result = z.array(questionSchema).safeParse(data);
    if (!result.success) {
      const summary = result.error.issues
        .slice(0, 5)
        .map((i) => `[${i.path.join(".")}] ${i.message}`)
        .join("; ");
      throw new Error(`Question data validation failed: ${summary}`);
    }
    return result.data;
  }
}

export const storage = new JsonStorage();