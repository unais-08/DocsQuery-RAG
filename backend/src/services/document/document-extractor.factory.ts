import { DocumentExtractor } from "./document-extractor.js";
import { TxtExtractor } from "./extractors/txt.extractor.js";
import { DocxExtractor } from "./extractors/docx.extractor.js";
import { PdfExtractor } from "./extractors/pdf.extractor.js";

export class DocumentExtractorFactory {
    static getExtractor(extension: string): DocumentExtractor {
        switch (extension.toLowerCase()) {
            case ".pdf":
                return new PdfExtractor();
            case ".docx":
                return new DocxExtractor();
            case ".txt":
                return new TxtExtractor();

            default:
                throw new Error(
                    `Unsupported document extension: ${extension}`
                );
        }
    }
}