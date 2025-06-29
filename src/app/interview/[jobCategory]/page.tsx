"use client";

import { InterviewSession } from '@/components/InterviewSession';
import { notFound, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, use } from 'react';
import { Loader2 } from 'lucide-react';


export default function InterviewPage({ params }: { params: { jobCategory: string } }) {
  const { jobCategory } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!jobCategory) {
    notFound();
  }
  
  const formattedJobCategory = decodeURIComponent(jobCategory)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <InterviewSession jobCategory={jobCategory} formattedJobCategory={formattedJobCategory} />
  );
}
