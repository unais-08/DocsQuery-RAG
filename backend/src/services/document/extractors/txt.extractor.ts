import fs from "fs/promises";

import { DocumentExtractor } from "../document-extractor.js";

export class TxtExtractor implements DocumentExtractor {
    async extract(filePath: string): Promise<string> {
        const text = await fs.readFile(filePath, "utf-8");

        return text;
    }
}