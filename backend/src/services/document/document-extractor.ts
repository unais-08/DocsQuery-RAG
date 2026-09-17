export interface TextPage {
    pageNumber?: number;
    text: string;
}

export interface DocumentExtractor {
    extract(filePath: string): Promise<TextPage[]>;
}