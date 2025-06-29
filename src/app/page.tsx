"use client";

import Link from "next/link";
import { JobCategoryCard } from "@/components/JobCategoryCard";
import type { JobCategory } from "@/components/JobCategoryCard";
import { Briefcase, Code, PenTool, BarChart2, History, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const jobCategories: JobCategory[] = [
  { name: "Software Engineer", slug: "software-engineer", Icon: Code },
  { name: "Product Manager", slug: "product-manager", Icon: Briefcase },
  { name: "UX/UI Designer", slug: "ux-ui-designer", Icon: PenTool },
  { name: "Data Scientist", slug: "data-scientist", Icon: BarChart2 },
];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center bg-background text-foreground">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16">
        <header className="text-center flex flex-col gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
            Welcome to <span style={{color: 'hsl(var(--primary))'}}>Hired</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground font-body">
            Select a job category to start your mock interview. Our AI will ask you relevant questions and provide instant feedback on your answers.
          </p>
        </header>

        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-center font-headline">Choose a Category</h2>
            <Link href="/results">
              <Button variant="outline">
                <History className="mr-2" />
                View Past Results
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {jobCategories.map((category) => (
              <JobCategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
