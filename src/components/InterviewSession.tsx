"use client";

import { useState } from "react";
import { InterviewClient, type InterviewResult } from "./InterviewClient";
import { ResultsPage } from "./ResultsPage";
import { saveInterviewSession } from "@/services/interview-results-service";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface StoredInterviewSession {
  id: string;
  jobCategory: string;
  formattedJobCategory: string;
  date: string;
  results: InterviewResult[];
}

interface InterviewSessionProps {
  jobCategory: string;
  formattedJobCategory: string;
}

export function InterviewSession({
  jobCategory,
  formattedJobCategory,
}: InterviewSessionProps) {
  const [view, setView] = useState<"interview" | "results">("interview");
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [sessionKey, setSessionKey] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInterviewComplete = async (finalResults: InterviewResult[]) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to save results.",
      });
      return;
    }

    setResults(finalResults);

    try {
      const sessionToSave = {
        jobCategory,
        formattedJobCategory,
        results: finalResults,
      };
      await saveInterviewSession(user, sessionToSave);
      setView("results");
    } catch (error) {
      let errorMessage = "Could not save your interview results.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Save Error",
        description: errorMessage,
      });
      throw error;
    }
  };

  const handleReset = () => {
    setResults([]);
    setView("interview");
    setSessionKey((prevKey) => prevKey + 1);
  };

  if (view === "results") {
    return (
      <ResultsPage
        results={results}
        onReset={handleReset}
        jobCategory={jobCategory}
        formattedJobCategory={formattedJobCategory}
      />
    );
  }

  return (
    <InterviewClient
      key={sessionKey}
      onComplete={handleInterviewComplete}
      onReset={handleReset}
      jobCategory={jobCategory}
      formattedJobCategory={formattedJobCategory}
    />
  );
}
