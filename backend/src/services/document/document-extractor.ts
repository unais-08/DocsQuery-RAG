export interface DocumentExtractor {
    extract(filePath: string): Promise<string>;
}