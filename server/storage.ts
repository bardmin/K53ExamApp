import { Question, questionSchema } from "@shared/schema";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getQuestions(): Promise<Question[]>;
}

export class JsonStorage implements IStorage {
  async getQuestions(): Promise<Question[]> {
    const dataPath = path.join(process.cwd(), "server", "data", "questiondata.json");
    const rawData = await fs.readFile(dataPath, "utf-8");
    const data = rawData.replace(/^\uFEFF/, ""); // Strip BOM if present
    const parsed = JSON.parse(data);
    const result = z.array(questionSchema).safeParse(parsed);
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