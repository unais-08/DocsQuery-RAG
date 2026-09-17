export function buildPrompt(
    question: string,
    context: string
): string {
    return `
You are a document question-answering assistant.

Answer the user's question using ONLY the provided context.

Rules:
- Use only information present in the context.
- Do not use outside knowledge.
- Do not invent or assume information.
- Do not provide information that is not explicitly stated in the context.
- If the answer cannot be found in the context, say:
  "I couldn't find the answer in the provided documents."

CONTEXT:
${context}

QUESTION:
${question}
`;
}