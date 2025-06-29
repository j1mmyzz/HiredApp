"use server";

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateInterviewQuestionsInputSchema = z.object({
  jobCategory: z
    .string()
    .describe("The job category for which to generate interview questions."),
  numberOfQuestions: z
    .number()
    .default(3)
    .describe("The number of interview questions to generate."),
});
export type GenerateInterviewQuestionsInput = z.infer<
  typeof GenerateInterviewQuestionsInputSchema
>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe("An array of generated interview questions."),
});
export type GenerateInterviewQuestionsOutput = z.infer<
  typeof GenerateInterviewQuestionsOutputSchema
>;

export async function generateInterviewQuestions(
  input: GenerateInterviewQuestionsInput
): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

// Prompt for gemini definitely will have to change this later
const generateQuestionsPrompt = ai.definePrompt({
  name: "generateQuestionsPrompt",
  input: { schema: GenerateInterviewQuestionsInputSchema },
  output: { schema: GenerateInterviewQuestionsOutputSchema },
  prompt: `You are an expert career coach helping candidates prepare for interviews.

  Generate {{numberOfQuestions}} interview questions for the following job category:
  {{jobCategory}}.

  Return the questions as a JSON array of strings.
  Do not include any introductory or concluding remarks.  Just the JSON.
  Make sure that the questions are challenging and test the candidate's knowledge
  and experience related to the job category.
  `,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: "generateInterviewQuestionsFlow",
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await generateQuestionsPrompt(input);
    return output!;
  }
);
