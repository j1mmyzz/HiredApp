'use server';
import { generateInterviewQuestions } from "@/ai/flows/generate-interview-questions";
import { transcribeUserResponse } from "@/ai/flows/transcribe-user-response";
import { analyzeUserAnswer } from "@/ai/flows/analyze-user-answer";
import type { GenerateInterviewQuestionsInput } from "@/ai/flows/generate-interview-questions";
import type { TranscribeUserResponseInput } from "@/ai/flows/transcribe-user-response";
import type { AnalyzeUserAnswerInput } from "@/ai/flows/analyze-user-answer";

export async function generateQuestionsAction(input: GenerateInterviewQuestionsInput) {
    return await generateInterviewQuestions(input);
}

export async function transcribeAnswerAction(input: TranscribeUserResponseInput) {
    return await transcribeUserResponse(input);
}

export async function analyzeAnswerAction(input: AnalyzeUserAnswerInput) {
    return await analyzeUserAnswer(input);
}
