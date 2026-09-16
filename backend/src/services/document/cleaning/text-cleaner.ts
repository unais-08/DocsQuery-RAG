export class TextCleaner {
    clean(text: string): string {
        const normalizedLineEndings = text.replace(/\r\n?/g, "\n");
        const lines = normalizedLineEndings.split("\n").map((line) =>
            line.trim().replace(/[ \t]+/g, " ")
        );

        return lines
            .join("\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }
}

export const textCleaner = new TextCleaner();
