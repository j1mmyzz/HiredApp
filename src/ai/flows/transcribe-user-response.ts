"use server";

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const TranscribeUserResponseInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The user's voice recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeUserResponseInput = z.infer<
  typeof TranscribeUserResponseInputSchema
>;

const TranscribeUserResponseOutputSchema = z.object({
  transcription: z.string().describe("The transcription of the user response."),
});
export type TranscribeUserResponseOutput = z.infer<
  typeof TranscribeUserResponseOutputSchema
>;

export async function transcribeUserResponse(
  input: TranscribeUserResponseInput
): Promise<TranscribeUserResponseOutput> {
  return transcribeUserResponseFlow(input);
}

const transcribeUserResponsePrompt = ai.definePrompt({
  name: "transcribeUserResponsePrompt",
  input: { schema: TranscribeUserResponseInputSchema },
  output: { schema: TranscribeUserResponseOutputSchema },
  prompt: `Transcribe the following audio recording of the user's response to an interview question.  Here is the recording: {{media url=audioDataUri}}`,
});

const transcribeUserResponseFlow = ai.defineFlow(
  {
    name: "transcribeUserResponseFlow",
    inputSchema: TranscribeUserResponseInputSchema,
    outputSchema: TranscribeUserResponseOutputSchema,
  },
  async (input) => {
    const { output } = await transcribeUserResponsePrompt(input);
    return output!;
  }
);
