import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-user-answer.ts';
import '@/ai/flows/transcribe-user-response.ts';
import '@/ai/flows/generate-interview-questions.ts';