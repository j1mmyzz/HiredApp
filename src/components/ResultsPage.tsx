"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Bot, CheckCircle, User, BrainCircuit, ArrowLeft } from 'lucide-react';
import type { InterviewResult } from "./InterviewClient";
import Link from "next/link";

interface ResultsPageProps {
  results: InterviewResult[];
  jobCategory: string;
  onReset: () => void;
  formattedJobCategory: string;
}

export function ResultsPage({ results, onReset, formattedJobCategory }: ResultsPageProps) {
  const averageScore = results.length > 0
    ? Math.round(results.reduce((acc, curr) => acc + (curr.score ?? 0), 0) / results.length)
    : 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardHeader>
          <div className="flex w-full items-center justify-between">
             <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="text-center flex-grow">
              <CardTitle className="font-headline text-2xl sm:text-3xl">Interview Results</CardTitle>
              <CardDescription className="pt-1">{formattedJobCategory}</CardDescription>
            </div>
            <div className="w-10"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 bg-secondary/50 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Overall Performance</h3>
            <p className="font-bold text-4xl text-primary">{averageScore}<span className="text-lg text-muted-foreground">/100</span></p>
            <p className="text-muted-foreground mt-1">Average Score</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {results.map((result, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex flex-col">
                    <span className="text-sm font-normal text-muted-foreground">Question {index + 1}</span>
                    <span className="font-semibold">{result.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  {result.score !== null && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center font-semibold">
                        <p>Your Score</p>
                        <p className="font-bold text-2xl text-primary">{result.score}<span className="text-sm text-muted-foreground">/100</span></p>
                      </div>
                      <Progress value={result.score} className="w-full" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2"><User className="h-5 w-5 text-accent" /> Your Answer</h4>
                    <p className="italic bg-secondary/50 p-3 rounded-lg border">{result.transcription}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary" /> AI Feedback</h4>
                    <p className="bg-primary/10 p-3 rounded-lg border">{result.feedback}</p>
                  </div>
                  {result.greatResponse && (
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" /> Example of a Great Response
                      </h4>
                      <p className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">{result.greatResponse}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center pt-4">
            <Button onClick={onReset} size="lg">Practice Again</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
