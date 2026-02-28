import { Question } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getQuestions(): Promise<Question[]>;
}

export class JsonStorage implements IStorage {
  async getQuestions(): Promise<Question[]> {
    const dataPath = path.join(process.cwd(), "server", "data", "questiondata.json");
    const data = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(data) as Question[];
  }
}

export const storage = new JsonStorage();