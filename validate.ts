import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { questionSchema } from "./shared/schema";

async function run() {
    const dataPath = path.join(process.cwd(), "server", "data", "questiondata.json");
    const data = await fs.readFile(dataPath, "utf-8");
    const parsed = JSON.parse(data);
    const result = z.array(questionSchema).safeParse(parsed);
    if (!result.success) {
        console.log("Validation failed:");
        console.dir(result.error.issues, { depth: null });
    } else {
        console.log("Validation succeeded for", result.data.length, "questions");
    }
}
run();
