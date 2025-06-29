"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, User, BrainCircuit, CheckCircle, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import type { InterviewResult } from '@/components/InterviewClient';
import type { StoredInterviewSession } from '@/components/InterviewSession';
import { getInterviewSessions, clearInterviewHistory } from '@/services/interview-results-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function AllResultsPage() {
  const [allSessions, setAllSessions] = useState<StoredInterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchSessions = async () => {
        try {
          const sessions = await getInterviewSessions(user);
          setAllSessions(sessions);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Could not load past results.';
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSessions();
    }
  }, [user]);

  const handleClearHistory = async () => {
    if (isClearing || !user) return;
    if (window.confirm('Are you sure you want to delete all your interview history? This action cannot be undone.')) {
      setIsClearing(true);
      try {
        await clearInterviewHistory(user);
        setAllSessions([]);
        toast({
          title: 'Success',
          description: 'Your interview history has been cleared.',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Could not clear history. Please try again.';
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        });
      } finally {
        setIsClearing(false);
      }
    }
  };

  const calculateAverageScore = (results: InterviewResult[]) => {
    if (!results || results.length === 0) return 0;
    const scores = results.map(r => r.score).filter(s => s !== null) as number[];
    if (scores.length === 0) return 0;
    const totalScore = scores.reduce((acc, curr) => acc + curr, 0);
    return Math.round(totalScore / scores.length);
  };
  
  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const renderContent = () => {
    if (error) {
       return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Failed to load results</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
          </AlertDescription>
        </Alert>
      );
    }

    if (allSessions.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-muted-foreground">You have no past interview results.</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Start a New Interview</Button>
          </Link>
        </div>
      );
    }

    return (
      <Accordion type="single" collapsible className="w-full">
        {allSessions.map((session) => {
          const averageScore = calculateAverageScore(session.results);
          return (
            <AccordionItem value={session.id} key={session.id}>
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex justify-between w-full pr-4">
                  <div className="flex flex-col">
                    <span className="font-semibold">{session.formattedJobCategory}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {new Date(session.date).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="font-bold text-lg text-primary">{averageScore}<span className="text-xs text-muted-foreground">/100</span></span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                {session.results.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-secondary/30">
                    <h4 className="font-semibold mb-3">{index + 1}. {result.question}</h4>
                    <div className="space-y-4">
                      {result.score !== null && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center font-semibold">
                            <p>Your Score</p>
                            <p className="font-bold text-xl text-primary">{result.score}<span className="text-sm text-muted-foreground">/100</span></p>
                          </div>
                          <Progress value={result.score} className="w-full" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h5 className="font-semibold flex items-center gap-2"><User className="h-5 w-5 text-accent" /> Your Answer</h5>
                        <p className="italic bg-card p-3 rounded-md border text-sm">{result.transcription || 'No answer recorded.'}</p>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-semibold flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary" /> AI Feedback</h5>
                        <p className="bg-primary/10 p-3 rounded-md border text-sm">{result.feedback}</p>
                      </div>
                      {result.greatResponse && (
                        <div className="space-y-2">
                          <h5 className="font-semibold flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" /> Great Response Example
                          </h5>
                          <p className="bg-green-500/10 p-3 rounded-md border border-green-500/20 text-sm">{result.greatResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="text-center flex-grow">
              <CardTitle className="font-headline text-2xl sm:text-3xl">All Interview Results</CardTitle>
              <CardDescription className="pt-1">Review your past performance</CardDescription>
            </div>
            <div className="w-10">
              {allSessions.length > 0 && !isLoading && (
                <Button variant="destructive" size="icon" onClick={handleClearHistory} title="Clear History" disabled={isClearing}>
                  {isClearing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                  <span className="sr-only">Clear History</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
