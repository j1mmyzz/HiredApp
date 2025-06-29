"use client";

import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { generateQuestionsAction, transcribeAnswerAction, analyzeAnswerAction } from '@/lib/actions';
import { Mic, Square, Bot, User, CheckCircle, BrainCircuit, Loader2, ArrowLeft, Settings, SkipForward } from 'lucide-react';

export interface InterviewResult {
  question: string;
  transcription: string | null;
  feedback: string | null;
  score: number | null;
  greatResponse: string | null;
}

type InterviewState = 'idle' | 'generating_questions' | 'asking' | 'recording' | 'transcribing' | 'analyzing' | 'showing_feedback';

interface InterviewClientProps {
  jobCategory: string;
  formattedJobCategory: string;
  onComplete: (results: InterviewResult[]) => Promise<void>;
  onReset: () => void;
}

export function InterviewClient({ jobCategory, formattedJobCategory, onComplete, onReset }: InterviewClientProps) {
  const [interviewState, setInterviewState] = useState<InterviewState>('idle');
  const [isCompleting, setIsCompleting] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [greatResponse, setGreatResponse] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>();
  const [interviewResults, setInterviewResults] = useState<InterviewResult[]>([]);

  const { toast } = useToast();
  const { isRecording, audioDataUri, startRecording, stopRecording, setAudioDataUri } = useAudioRecorder();
  const { isSpeaking, speak, cancel, voices } = useSpeechSynthesis();
  
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  
  useEffect(() => {
    if (voices.length > 0 && !selectedVoice) {
      const defaultVoice = voices.find(v => v.default);
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.voiceURI);
      } else if (voices.length > 0) {
        setSelectedVoice(voices[0].voiceURI);
      }
    }
  }, [voices, selectedVoice]);

  const handleStartInterview = async () => {
    setInterviewState('generating_questions');
    try {
      const { questions: newQuestions } = await generateQuestionsAction({ jobCategory, numberOfQuestions: 3 });
      if (newQuestions && newQuestions.length > 0) {
        setQuestions(newQuestions);
        setCurrentQuestionIndex(0);
        setInterviewResults([]);
        setInterviewState('asking');
        speak(newQuestions[0], selectedVoice);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No questions were generated. Please try again.' });
        setInterviewState('idle');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate questions. Please try again.' });
      setInterviewState('idle');
    }
  };

  const handleStartRecording = () => {
    setAudioDataUri(null);
    setInterviewState('recording');
    startRecording();
  };

  const handleSkipToAnswer = () => {
    cancel();
    handleStartRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const processAnswer = useCallback(async () => {
    if (!audioDataUri) return;

    setInterviewState('transcribing');
    try {
      const { transcription } = await transcribeAnswerAction({ audioDataUri });
      setTranscription(transcription);
      
      setInterviewState('analyzing');

      const { feedback, score, greatResponse } = await analyzeAnswerAction({
        question: currentQuestion,
        answer: transcription,
        jobCategory,
      });
      setFeedback(feedback);
      setScore(score);
      setGreatResponse(greatResponse);

      setInterviewResults(prev => [...prev, {
        question: currentQuestion,
        transcription,
        feedback,
        score,
        greatResponse,
      }]);

      setInterviewState('showing_feedback');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to process your answer. Please try again.' });
      setInterviewState('asking');
    } finally {
      setAudioDataUri(null);
    }
  }, [audioDataUri, jobCategory, currentQuestion, toast, setAudioDataUri]);

  useEffect(() => {
    if (!isRecording && audioDataUri) {
      processAnswer();
    }
  }, [isRecording, audioDataUri, processAnswer]);

  const handleNextQuestion = async () => {
    if (isCompleting) return;

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setAudioDataUri(null);
      setTranscription(null);
      setFeedback(null);
      setScore(null);
      setGreatResponse(null);
      setInterviewState('asking');
      speak(questions[nextIndex], selectedVoice);
    } else {
      setIsCompleting(true);
      try {
        await onComplete(interviewResults);
        // On success, parent component will unmount this one.
      } catch (error) {
        // The error is already handled and toasted by the parent.
        // We just need to reset the loading state here.
        setIsCompleting(false);
      }
    }
  };
  
  const handleReset = () => {
    cancel();
    onReset();
  };

  const renderContent = () => {
    switch (interviewState) {
      case 'idle':
        return (
          <div className="text-center">
            <p className="mb-4">Ready to start your mock interview for a {formattedJobCategory} role?</p>
            <Button onClick={handleStartInterview} size="lg">Start Interview</Button>
          </div>
        );
      case 'generating_questions':
        return (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Generating interview questions...</p>
          </div>
        );
      case 'asking':
        return (
          <div className="text-center space-y-6">
            <div className="flex items-start gap-4 text-left">
              <Bot className="h-8 w-8 text-primary flex-shrink-0 mt-1"/>
              <p className="text-xl font-semibold">{currentQuestion}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleStartRecording} size="lg" disabled={isSpeaking}>
                <Mic className="mr-2 h-4 w-4" /> Record Answer
              </Button>
              <Button onClick={handleSkipToAnswer} size="lg" variant="outline" disabled={!isSpeaking}>
                <SkipForward className="mr-2 h-4 w-4" /> Skip
              </Button>
            </div>
          </div>
        );
      case 'recording':
        return (
          <div className="text-center space-y-6">
            <div className="flex items-start gap-4 text-left">
              <Bot className="h-8 w-8 text-primary flex-shrink-0 mt-1"/>
              <p className="text-xl font-semibold">{currentQuestion}</p>
            </div>
             <div className="flex flex-col items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-red-500 pulse-red-animation flex items-center justify-center">
                <Mic className="h-6 w-6 text-white" />
               </div>
               <p>Recording...</p>
             </div>
            <Button onClick={handleStopRecording} size="lg" variant="destructive">
              <Square className="mr-2 h-4 w-4" /> Stop Recording
            </Button>
          </div>
        );
      case 'transcribing':
        return (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Transcribing your answer...</p>
          </div>
        );
      case 'analyzing':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Analyzing your answer...</p>
            {transcription && (
              <blockquote className="mt-2 text-sm text-muted-foreground italic border-l-2 pl-4 max-w-md">
                {transcription}
              </blockquote>
            )}
          </div>
        );
      case 'showing_feedback':
        return (
          <div className="space-y-6 text-left w-full">
            <h3 className="text-lg font-semibold text-center">Your Answer & Feedback</h3>
            <div className="space-y-6">
              {score !== null && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center font-semibold">
                    <p>Your Score</p>
                    <p className="font-bold text-2xl text-primary">{score}<span className="text-sm text-muted-foreground">/100</span></p>
                  </div>
                  <Progress value={score} className="w-full" />
                </div>
              )}
              <div className="space-y-2">
                 <h4 className="font-semibold flex items-center gap-2"><User className="h-5 w-5 text-accent" /> Your Answer</h4>
                <p className="italic bg-secondary/50 p-3 rounded-lg border">{transcription}</p>
              </div>
              <div className="space-y-2">
                 <h4 className="font-semibold flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary" /> AI Feedback</h4>
                 <p className="bg-primary/10 p-3 rounded-lg border">{feedback}</p>
              </div>
              {greatResponse && (
                <div className="space-y-2">
                   <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Example of a Great Response
                   </h4>
                   <p className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">{greatResponse}</p>
                </div>
              )}
            </div>
            <div className="text-center pt-4">
              <Button onClick={handleNextQuestion} size="lg" disabled={isCompleting}>
                {isCompleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finishing...
                  </>
                ) : currentQuestionIndex < questions.length - 1 ? (
                  'Next Question'
                ) : (
                  'Finish Interview'
                )}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <CardTitle className="text-center font-headline text-2xl sm:text-3xl px-2">{formattedJobCategory} Interview</CardTitle>
            <div className="w-10">
              {voices.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-6 w-6" />
                      <span className="sr-only">Voice Settings</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Voice Settings</h4>
                        <p className="text-sm text-muted-foreground">
                          Select a voice for the interviewer.
                        </p>
                      </div>
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a voice" />
                        </SelectTrigger>
                        <SelectContent>
                          {voices.map((voice) => (
                            <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                              {voice.name} ({voice.lang})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
          {questions.length > 0 && (
            <CardDescription className="text-center pt-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="min-h-[20rem] flex items-center justify-center">
          {renderContent()}
        </CardContent>
        <CardFooter className="flex justify-center">
          {interviewState !== 'idle' && (
             <Button onClick={handleReset} variant="ghost" size="sm">
               End & Reset
             </Button>
           )}
        </CardFooter>
      </Card>
    </div>
  );
}
