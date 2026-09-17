import { generateAnswer } from "./generate-answer.js";

const question = "What is the pay of John?";

const context = `
SOURCE 1
Document: company-policy.pdf
Page: 3
Content:
Customers can request a refund within 30 days.
`;

const answer = await generateAnswer(question, context);

console.log("Answer:", answer);