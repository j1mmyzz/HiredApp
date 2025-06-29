"use server";

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const AnalyzeUserAnswerInputSchema = z.object({
  question: z.string().describe("The interview question asked to the user."),
  answer: z.string().describe("The transcribed answer provided by the user."),
  jobCategory: z.string().describe("The job category for the interview."),
});
export type AnalyzeUserAnswerInput = z.infer<
  typeof AnalyzeUserAnswerInputSchema
>;

const AnalyzeUserAnswerOutputSchema = z.object({
  feedback: z
    .string()
    .describe("Feedback on the clarity, coherence, and content of the answer."),
  score: z
    .number()
    .min(0)
    .max(100)
    .describe("A score for the user's answer out of 100."),
  greatResponse: z
    .string()
    .describe("An example of a great response to the question."),
});
export type AnalyzeUserAnswerOutput = z.infer<
  typeof AnalyzeUserAnswerOutputSchema
>;

export async function analyzeUserAnswer(
  input: AnalyzeUserAnswerInput
): Promise<AnalyzeUserAnswerOutput> {
  return analyzeUserAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: "analyzeUserAnswerPrompt",
  input: { schema: AnalyzeUserAnswerInputSchema },
  output: { schema: AnalyzeUserAnswerOutputSchema },
  prompt: `You are an expert interview coach providing feedback to candidates.

  Based on the job category, question, and the answer, provide constructive feedback to help the candidate improve their interviewing skills.

  Job Category: {{{jobCategory}}}
  Question: {{{question}}}
  Answer: {{{answer}}}

  Consider the following aspects in your feedback:
  - Clarity: Was the answer easy to understand?
  - Coherence: Did the answer flow logically?
  - Content: Was the answer complete and relevant to the question?

  Return the feedback in a concise and actionable manner.

  Also, provide a score for the answer on a scale of 0 to 100 based on the quality of the response.

  Finally, provide an example of a great response to the interview question. The example should be well-structured and concise, similar in length to what a strong candidate would provide in a real interview (roughly 1-2 minutes of speaking time).
  `,
});

const analyzeUserAnswerFlow = ai.defineFlow(
  {
    name: "analyzeUserAnswerFlow",
    inputSchema: AnalyzeUserAnswerInputSchema,
    outputSchema: AnalyzeUserAnswerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
