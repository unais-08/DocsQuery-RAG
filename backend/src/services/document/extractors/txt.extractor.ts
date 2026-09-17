import fs from "fs/promises";

import { DocumentExtractor, TextPage } from "../document-extractor.js";

export class TxtExtractor implements DocumentExtractor {
    async extract(filePath: string): Promise<TextPage[]> {
        const text = await fs.readFile(filePath, "utf-8");

        return [{ text }];
    }
}